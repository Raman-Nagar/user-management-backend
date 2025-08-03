import { Op } from "sequelize";
import { User } from "../models/User.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcryptjs";

const getProfile = async (req, res) => {
  res.json(req.user);
};

const addUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      bio,
      role = "user",
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      bio,
      role,
      isVerified: false,
    });

    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const localPath = req.file?.path;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { firstName, lastName, phone, bio } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (localPath) {
      const avatar = await uploadOnCloudinary(localPath);
      if (!avatar.url) {
        throw new ApiError(400, "Error while uploading");
      }
      user.avatar = avatar.url;
    }

    await user.save();
    const { password, ...safeUser } = user.toJSON();
    res.json(safeUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
      search = "",
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const order = [[sortBy, sortOrder.toUpperCase()]];

    const whereCondition = {
      [Op.or]: [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ],
    };

    const { count, rows } = await User.findAndCountAll({
      where: search ? whereCondition : undefined,
      limit: parseInt(limit),
      offset,
      order,
      attributes: { exclude: ["password"] },
    });

    res.json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      users: rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();

    const verifiedUsers = await User.count({
      where: { isVerified: true },
    });

    const adminUsers = await User.count({
      where: { role: "admin" },
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newThisMonth = await User.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    res.json({
      totalUsers,
      verifiedUsers,
      adminUsers,
      newThisMonth,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  getProfile,
  addUser,
  updateProfile,
  getAllUsers,
  deleteUser,
  getUserStats,
};
