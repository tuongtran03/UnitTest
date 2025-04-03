import Calendar from "../models/calendar.model.js"

export const createCalendarNotify = async (req, res) => {
    try {
        const newCalendar = await Calendar.create(req.body)
        res.status(201).json({ message: 'Tạo mới thông báo thành công', data: newCalendar })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getCalendarNotifications = async (req, res) => {
    try {
        const currentDate = new Date();
        const { _id } = req.user

        const calendars = await Calendar.find({ user: _id, calendarDate: { $gt: currentDate } })
            .populate('training')
            .sort({ calendarDate: 1 })
            .exec();

        res.status(200).json({ message: 'Tạo mới thông báo thành công', data: calendars })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteCalendarNotifyById = async (req, res) => {
    try {
        const id = req.params.id
        await Calendar.findByIdAndDelete(id);
        res.status(200).json({ message: "Đã xóa hẹn thông báo!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteNotificationsPassed = async (req, res) => {
    try {
        const currentDate = Date.now();
        const { _id } = req.user
        await Calendar.deleteMany({ user: _id, calendarDate: { $lt: currentDate } })

        res.status(200).json({ message: "Đã xóa tất cả thông báo đã qua!" })
    } catch (error) {
        res.status(500).json({ message: "Loi gi do" })
    }
}