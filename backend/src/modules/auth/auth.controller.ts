import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import User from "../../models/User";
import generateToken from "../../utils/generateToken";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hash = await bcryptjs.hash(password, SALT_ROUNDS);
    const user = await User.create({ email, passwordHash: hash, name });

    return res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      token: generateToken(user._id.toString())
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const credentials = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).lean();
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcryptjs.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // Return minimal user object for NextAuth
    return res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      token: generateToken(user._id.toString())
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return res.status(500).json({ message: "Admin credentials not configured in environment" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      // Update role if exists but not admin
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        return res.json({ message: "User promoted to admin" });
      }
      return res.json({ message: "Admin account already exists" });
    }

    const hash = await bcryptjs.hash(password, SALT_ROUNDS);
    await User.create({
      email,
      passwordHash: hash,
      name: "Admin Caca",
      role: "admin"
    });

    return res.status(201).json({ message: "Admin account created successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
