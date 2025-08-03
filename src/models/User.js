import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  bio: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export { User };
