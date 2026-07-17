import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const volunteerProfileSchema = new mongoose.Schema({
  skills: [
    {
      type: String,
    },
  ],

  availability: {
    type: Boolean,
    default: true,
  },

  rewardPoints: {
    type: Number,
    default: 0,
  },

  missionsCompleted: {
    type: Number,
    default: 0,
  },

  // Admin verification
  verified: {
    type: Boolean,
    default: false,
  },

  rating: {
    type: Number,
    default: 0,
  },
});

const ngoProfileSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
  },

  registrationId: {
    type: String,
    required: true,
  },

  // Admin approval
  approved: {
    type: Boolean,
    default: false,
  },

  description: {
    type: String,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,

      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],

      minlength: [6, "Password must be at least 6 characters"],

      select: false,
    },

    role: {
      type: String,

      enum: ["citizen", "volunteer", "ngo", "admin"],

      default: "citizen",
    },

    phone: {
      type: String,
    },

    avatar: {
      type: String,
    },

    location: {
      lat: {
        type: Number,
      },

      lng: {
        type: Number,
      },

      address: {
        type: String,
      },
    },

    // Admin verification status
    // Citizen true during registration
    // Volunteer/NGO false until admin approves

    isVerified: {
      type: Boolean,
      default: false,
    },

    // Email verification removed

    emailVerified: {
      type: Boolean,
      default: true,
    },

    volunteerProfile: volunteerProfileSchema,

    ngoProfile: ngoProfileSchema,
  },

  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
