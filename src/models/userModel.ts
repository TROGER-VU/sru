import mongoose, { Document, Model } from 'mongoose';

interface IUser extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  points?: number;
  isVerified?: boolean;
  isAdmin?: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  scanHistory?: Array<{
    timestamp: Date;
    points: number;
    code?: string;
    expiry?: Date;
  }>;
}

const userSchema = new mongoose.Schema<IUser>({
  fullName: {
    type: String,
    required: [true, "Please provide Full name"],
  },
  email: {
    type: String,
    required: [true, "Please provide Email"],
    unique: true,
  },
  mobileNumber: {
    type: String,
    required: [true, "Please provide Mobile Number"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide Password"],
  },
  points: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  scanHistory: [
    {
      timestamp: { type: Date, default: Date.now },
      points: { type: Number, required: true },
      code: { type: String },
      expiry: { type: Date },
    },
  ],
});

const User: Model<IUser> = mongoose.models.users || mongoose.model<IUser>('users', userSchema);
export default User;
