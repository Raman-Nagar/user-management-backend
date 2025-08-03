import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import sendEmail from "../utils/mailer.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailToken,
  verifyToken,
} from "../utils/token.js";
import {
  getVerificationEmail,
  getResetPasswordEmail,
} from "../utils/emailTemplates.js";

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
    });

    const emailToken = generateEmailToken({ id: user.id });
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailToken}`;

    const fullName = `${user.firstName} ${user.lastName}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: getVerificationEmail(fullName, verifyLink),
    });

    res.status(201).json({ message: "Registered. Please verify your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = verifyToken(token, process.env.EMAIL_TOKEN_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    }

    const token = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.cookie("token", token, { httpOnly: true });
    res.json({ token, refreshToken, user, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    const token = generateAccessToken({ id: decoded.id });

    res.cookie("token", token, { httpOnly: true });
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = generateEmailToken({ id: user.id });
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const fullName = `${user.firstName} ${user.lastName}`;

    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: getResetPasswordEmail(fullName, link),
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = verifyToken(token, process.env.EMAIL_TOKEN_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export {
  register,
  verifyEmail,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};
