import mongoose from "mongoose";
import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'
export const lockUser = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ params
        const { isLocked } = req.query; // Lấy isLocked từ query string

        console.log("Dang khoa ? ", isLocked);

        // Cập nhật isLocked trong cơ sở dữ liệu
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isLocked: isLocked === 'true' }, // Chuyển đổi sang boolean
            { new: true } // Trả về tài liệu đã cập nhật
        );

        res.status(200).json({ message: "Khóa tài khoản thành công", data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const findUserByUsernameOrEmail = async (req, res) => {
    try {
        const { query } = req.params; // Lấy query từ params

        if (!query) {
            return res.status(400).json({ message: "Query không được để trống" });
        }

        // Tìm kiếm user dựa trên username hoặc email
        const user = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        res.status(200).json({ message: "Tìm thấy người dùng", data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {

        const data = await User.find({ _id: { $ne: req.user._id } })
        res.status(200).json({ message: "Lấy toàn bộ dữ liệu user thành công", data: data })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateUserById = async (req, res) => {
    try {
        const { _id } = req.user;
        const body = req.body;
        const updated = await User.findByIdAndUpdate(_id, body, { new: true })
        res.status(200).json({ message: "Cập nhật dữ liệu thông tin người dùng thành công", data: updated })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {

        const id = req.params.id
        const user = await User.findById(id)

        res.status(200).json({ message: "Get user data successfully!", data: user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email
        const user = await User.findOne({ email: email })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const userBody = req.body
        const userId = req.params.userId
        const user = await User.findByIdAndUpdate(userId, userBody, { new: true })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updatePasswordByEmail = async (req, res) => {
    try {
        const { password } = req.body
        const email = req.params.email
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = password

        await user.save()

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

        if (!token) {
            return res.status(401).json({ message: 'Token không tồn tại' });
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedUser) => {
            if (err) {
                return res.status(403).json({ message: 'Token không hợp lệ' });
            }
            res.status(200).json({ user: decodedUser });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const isEmailExist = async (req, res) => {
    try {
        const email = req.params.email
        const isExist = await User.findOne({ email: email })
        if (isExist) {
            res.status(200).json({ email: email })
        }
        else {
            res.status(200).json({ email: "", message: "Email was not exist!" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}