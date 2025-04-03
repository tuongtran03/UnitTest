import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userSockets } from "../index.js";

export const signup = async (req, res) => {
  try {
    const { email, password, username, clerkId } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại!" });
    }
    const user = await User.create(req.body);

    res.status(201).json({ user, message: "Đăng ký tài khoản thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await User.find({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Email chưa được đăng ký" });
    }
    if (userSockets[user._id]) {
      return res
        .status(400)
        .json({
          message:
            "Đã có thiết bị đăng nhập. Vui lòng đăng xuất trên thiết bị khác!",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Sai mat khau");
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ data: user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { _id } = req.user;
    delete userSockets[_id];
    res.status(200).json({ message: "Đăng xuất thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
