import FeedBack from "../models/feedback.model.js"
export const deleteById = async (req, res) => {
    try {
        await FeedBack.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Xóa dữ liệu phản hồi thành công!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const getAllFeedbacks = async (req, res) => {
    try {
        const data = await FeedBack.find().populate('user', 'username')
        res.status(200).json({ message: "Lấy dữ liệu phản hồi thành công!", data: data })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createFeedBack = async (req, res) => {
    try {
        const newFeedback = new FeedBack(req.body)
        const savedFeedback = await newFeedback.save()
        res.status(201).json(savedFeedback)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}