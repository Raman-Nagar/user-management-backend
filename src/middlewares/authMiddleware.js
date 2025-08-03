import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "No token, auth denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });
    next();
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: "Invalid token" });
  }
}

export default authMiddleware;
