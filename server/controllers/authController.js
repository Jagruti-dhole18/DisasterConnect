import User from "../models/User.js";
import Volunteer from "../models/Volunteer.js";
import jwt from "jsonwebtoken";
import { generateToken, generateRefreshToken } from "../config/jwt.js";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      organizationName,
      registrationId,
      skills,
    } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,

      // Email verification removed
      emailVerified: true,

      // Admin verification required
      isVerified: role === "citizen",

      volunteerProfile:
        role === "volunteer"
          ? {
              skills: skills || [],
              availability: true,
              rewardPoints: 0,
              missionsCompleted: 0,

              // Admin will verify volunteer
              verified: false,
            }
          : undefined,

      ngoProfile:
        role === "ngo"
          ? {
              organizationName: organizationName || name,
              registrationId,
              approved: false,
            }
          : undefined,
    });

    // Create volunteer profile
    if (role === "volunteer") {
      await Volunteer.create({
        user: user._id,

        name,

        skills: skills || [],

        availability: true,

        location: user.location || {
          lat: 0,
          lng: 0,
        },
      });
    }

    const token = generateToken(user._id, user.role);

    const refreshToken = generateRefreshToken(user._id);

    return res.status(201).json({
      success: true,

      token,

      refreshToken,

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        phone: user.phone,

        // Admin verification status
        isVerified: user.isVerified,

        // Email verification removed
        emailVerified: true,

        volunteerProfile: user.volunteerProfile,

        ngoProfile: user.ngoProfile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,

        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id, user.role);

    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,

      token,

      refreshToken,

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        phone: user.phone,

        // Admin verification status
        isVerified: user.isVerified,

        // Email verification removed
        emailVerified: true,

        volunteerProfile: user.volunteerProfile,

        ngoProfile: user.ngoProfile,

        location: user.location,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,

        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(
      refreshToken,

      process.env.JWT_REFRESH_SECRET || "fallback_refresh",
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "Invalid refresh token",
      });
    }

    const newToken = generateToken(user._id, user.role);

    res.json({
      success: true,

      token: newToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,

      message: "Invalid refresh token",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    return res.json({
      success: true,

      message: "User found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    user.password = password;

    await user.save();

    res.json({
      success: true,

      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,

    user: req.user,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, skills } = req.body;

    const update = {
      name,

      phone,

      location,
    };

    if (req.user.role === "volunteer" && skills) {
      update.volunteerProfile = {
        ...req.user.volunteerProfile,

        skills,
      };

      const vol = await Volunteer.findOne({
        user: req.user._id,
      });

      if (vol) {
        vol.skills = skills;

        vol.name = name;

        await vol.save();
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,

      update,

      {
        new: true,
      },
    );

    res.json({
      success: true,

      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
