import TrainingRecord from "../models/trainingRecord.model.js";

export const createTrainingRecord = async (req, res) => {
    try {
        const recordData = req.body;
        const newTrainingRecord = new TrainingRecord(recordData)
        const savedRecord = await newTrainingRecord.save()
        const returnData = await TrainingRecord
            .findById(savedRecord._id).
            populate({
                path: 'training',
                populate: {
                    path: 'exercises.exercise',

                }
            })
        res.status(201).json({ message: "Tạo bản ghi tập luyện thành công!", data: returnData })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getTrainingRecord = async (req, res) => {
    try {
        const id = req.params.id
        const training = await TrainingRecord.findById(id)
            .populate("user")
            .populate({
                path: 'training',
                populate: {
                    path: 'exercises.exercise',

                }
            })
        res.status(200).json(training)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// export const getAllTrainingRecordByUserId = async (req, res) => {
//     try {
//         const userId = req.params.userId
//         const countRecords = await TrainingRecord.find({ user: userId })
//         res.status(200).json(countRecords)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// }

export const getAllTrainingRecordByUserId = async (req, res) => {
    try {
        const { _id } = req.user;
        const limit = parseInt(req.query.limit) || 0;
        const skip = parseInt(req.query.skip) || 0;
        // const offset = parseInt(req.query.offset) || 0;  // Default offset is 0
        // const limit = parseInt(req.query.limit);  // No default for limit

        const data = await TrainingRecord.find({ user: _id })
            .populate({
                path: 'training',
                populate: {
                    path: 'exercises.exercise',

                }
            })
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({ message: "Lấy dữ liệu lịch sử thành công", data: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTrainingsByMonth = async (req, res) => {


    try {
        const month = req.params.month
        const { _id } = req.user;

        const year = new Date().getFullYear();
        const startOfMonth = new Date(year, month - 1, 1);
        const startOfNextMonth = new Date(year, month, 1);

        const records = await TrainingRecord.find({
            user: _id,
            created_at: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }
        }).sort({ created_at: -1 })

        res.status(200).json(records)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getTrainingsByWeek = async (req, res) => {
    try {
        const { _id } = req.user; // Lấy user ID từ middleware xác thực

        // Lấy thời gian hiện tại
        const now = new Date();

        // Tính ngày đầu tuần (Thứ 2) dựa trên UTC
        const startOfWeek = new Date(now);
        const day = startOfWeek.getUTCDay(); // Lấy ngày trong tuần (0 = Chủ Nhật, 1 = Thứ 2, ...)
        const diff = (day === 0 ? -6 : 1) - day; // Tính khoảng cách đến Thứ 2
        startOfWeek.setUTCDate(startOfWeek.getUTCDate() + diff);
        startOfWeek.setUTCHours(0, 0, 0, 0);

        // Tính ngày cuối tuần (Chủ Nhật)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);

        // Truy vấn MongoDB
        const records = await TrainingRecord.find({
            user: _id,
            created_at: {
                $gte: startOfWeek,
                $lte: endOfWeek,
            },
        })
            .populate({
                path: 'training',
                populate: {
                    path: 'exercises.exercise',
                },
            })
            .sort({ created_at: -1 });

        res.status(200).json({
            message: "Lấy dữ liệu trong tuần thành công",
            data: records,
        });
    } catch (error) {
        console.error("Error fetching weekly data:", error);
        res.status(500).json({ message: error.message });
    }
};


