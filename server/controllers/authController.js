import User from '../models/User.js';
import Volunteer from '../models/Volunteer.js';
import jwt from 'jsonwebtoken';
import { generateToken, generateRefreshToken } from '../config/jwt.js';
import { sendEmail } from '../services/emailService.js';
import crypto from 'crypto';

const EMAIL_VERIFICATION_TTL_MS = 10 * 60 * 1000;

const hashVerificationCode = (code) => crypto.createHash('sha256').update(code).digest('hex');

const sendVerificationCode = async (user) => {
  const code = crypto.randomInt(100000, 1000000).toString();
  user.emailVerificationCode = hashVerificationCode(code);
  user.emailVerificationExpires = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
  await user.save();
  await sendEmail({
    to: user.email,
    subject: 'DisasterConnect - Verify your email',
    text: `Your DisasterConnect verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your DisasterConnect verification code is:</p><h1 style="letter-spacing: 6px;">${code}</h1><p>This code expires in 10 minutes.</p>`,
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, organizationName, registrationId, skills } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name, email, password, role, phone,
      emailVerified: false,
      isVerified: role === 'citizen',
      volunteerProfile: role === 'volunteer' ? {
        skills: skills || [], availability: true, rewardPoints: 0, missionsCompleted: 0, verified: false,
      } : undefined,
      ngoProfile: role === 'ngo' ? {
        organizationName: organizationName || name, registrationId, approved: false,
      } : undefined,
    });

    if (role === 'volunteer') {
      await Volunteer.create({
        user: user._id, name, skills: skills || [], availability: true,
        location: user.location || { lat: 0, lng: 0 },
      });
    }

    try {
      await sendVerificationCode(user);
    } catch (emailErr) {
      return res.status(201).json({
        success: true,
        message: 'Account created, but the verification code could not be sent. Please resend it.',
        email: user.email,
        verificationCodeSent: false,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Verification code sent to your email',
      email: user.email,
      verificationCodeSent: true,
    });

    /* Legacy link verification flow (kept unreachable temporarily).
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = verificationToken;
    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to DisasterConnect — Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #2c3e50; margin-top: 0;">Welcome to DisasterConnect, ${user.name}!</h2>
              <p style="color: #555; line-height: 1.6;">Thank you for signing up as a <strong>${user.role}</strong>. Please verify your email address to activate your account.</p>
              <div style="margin: 30px 0; text-align: center;">
                <a href="${verificationUrl}" style="background-color: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #0066cc; background-color: #f9f9f9; padding: 10px; border-radius: 4px; font-size: 12px;">${verificationUrl}</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #999; font-size: 12px;">
                This verification link expires in 24 hours. If you didn't create this account, please contact our support team.
              </p>
              <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                DisasterConnect — Connecting Communities in Crisis
              </p>
            </div>
          </div>
        `,
        text: `Welcome to DisasterConnect! Please verify your email by clicking: ${verificationUrl}`,
      });
    } catch (emailErr) {
      console.warn('Email sending failed (expected in dev):', emailErr.message);
    }

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      token,
      refreshToken,
      user: {
        _id: user._id, name: user.name, email: user.email, role: user.role,
        phone: user.phone, isVerified: user.isVerified, emailVerified: user.emailVerified,
        volunteerProfile: user.volunteerProfile, ngoProfile: user.ngoProfile,
      },
    });
    */
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check if email is verified before allowing login
    if (!user.emailVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before logging in',
        emailNotVerified: true,
        email: user.email,
      });
    }
    
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        _id: user._id, name: user.name, email: user.email, role: user.role,
        phone: user.phone, isVerified: user.isVerified, emailVerified: user.emailVerified,
        volunteerProfile: user.volunteerProfile, ngoProfile: user.ngoProfile,
        location: user.location,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback_refresh');
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    const newToken = generateToken(user._id, user.role);
    res.json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    try {
      await sendEmail({
  to: user.email,
  subject: 'DisasterConnect — Password Reset',
  text: `Reset your password here: ${resetUrl}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #f8fafc;">
      <div style="background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">

        <h2 style="margin:0; color:#1e293b;">
          Reset Your Password
        </h2>

        <p style="margin:20px 0; color:#475569; line-height:1.6;">
          We received a request to reset the password for your
          <strong>DisasterConnect</strong> account.
        </p>

        <a
  href="${resetUrl}"
  rel="notrack"
  style="
    background:#2563eb;
    color:#ffffff;
    text-decoration:none;
    padding:14px 28px;
    border-radius:8px;
    font-weight:600;
    display:inline-block;
  "
>
  Reset Password
</a>

        <p style="color:#475569; line-height:1.6;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>

        <p style="word-break: break-all; color:#2563eb;">
          ${resetUrl}
        </p>

        <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;" />

        <p style="font-size:13px; color:#64748b;">
          This link will expire in <strong>10 minutes</strong>.
        </p>

        <p style="font-size:13px; color:#64748b;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>

      </div>
    </div>
  `,
});
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
      return res.status(500).json({ success: false, message: 'Unable to send password reset email right now. Please try again later.' });
    }

    res.json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !/^[0-9]{6}$/.test(code || '')) {
      return res.status(400).json({ success: false, message: 'Email and a 6-digit verification code are required' });
    }
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationCode: hashVerificationCode(code),
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationCode +emailVerificationExpires');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }
    user.emailVerified = true;
    if (user.role === 'citizen') user.isVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    return res.json({ success: true, message: 'Email verified successfully' });

    /* Legacy token verification flow.
    const { token } = req.body;
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid verification token' });
    }
    user.emailVerified = true;
    // For citizens, automatically set isVerified to true after email verification
    if (user.role === 'citizen') {
      user.isVerified = true;
    }
    user.emailVerificationToken = undefined;
    await user.save();
    res.json({ success: true, message: 'Email verified successfully', user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      isVerified: user.isVerified,
    }});
    */
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, skills } = req.body;
    const update = { name, phone, location };
    if (req.user.role === 'volunteer' && skills) {
      update.volunteerProfile = { ...req.user.volunteerProfile, skills };
      const vol = await Volunteer.findOne({ user: req.user._id });
      if (vol) { vol.skills = skills; vol.name = name; await vol.save(); }
    }
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    try {
      await sendVerificationCode(user);
      return res.json({ success: true, message: 'A new verification code has been sent' });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
      return res.status(500).json({ success: false, message: 'Unable to send verification code. Please try again later.' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = verificationToken;
    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'DisasterConnect — Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Welcome to DisasterConnect</h2>
            <p>Thank you for signing up! Please verify your email address to activate your account.</p>
            <p style="margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Verify Email Address
              </a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #0066cc;">${verificationUrl}</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This link expires in 24 hours. If you didn't create this account, please ignore this email.
            </p>
          </div>
        `,
        text: `Welcome to DisasterConnect! Please verify your email by clicking: ${verificationUrl}`,
      });
      res.json({ success: true, message: 'Verification email sent successfully' });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
      res.status(500).json({ success: false, message: 'Unable to send verification email. Please try again later.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
