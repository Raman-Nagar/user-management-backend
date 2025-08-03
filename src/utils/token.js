import jwt from "jsonwebtoken";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const generateEmailToken = (payload) => {
  return jwt.sign(payload, process.env.EMAIL_TOKEN_SECRET, { expiresIn: "1d" });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

export {
  generateAccessToken,
  generateRefreshToken,
  generateEmailToken,
  verifyToken,
};
