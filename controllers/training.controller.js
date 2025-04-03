import Training from "../models/training.model.js";

export const createTrainings = async (req, res) => {
    try {

        const trainings = await Training.insertMany(req.body)
        res.status(200).json({ message: "Tạo dữ liệu training thành công!", data: trainings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getByUserId = async (req, res) => {
    try {

        const userId = req.user._id

        const isCustom = req.query.isCustom
        const isInPlan = req.query.isInPlan

        const data = await Training.find({ user: userId, isCustom: isCustom, isInPlan: isInPlan }).populate('exercises.exercise')
        if (data)
            res.status(200).json({ message: "Lấy dữ liệu training thành công!", data: data });
        else
            res.status(404).json({ message: "Không tìm thấy dữ liệu", data: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const recreateByUserId = async (req, res) => {
    try {
        const { _id } = req.user
        await Training.deleteMany({ user: _id, isCustom: false })

        const trainings = await Training.insertMany(req.body)
        res.status(200).json({ message: "Tạo lại dữ liệu training thành công!", data: trainings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}