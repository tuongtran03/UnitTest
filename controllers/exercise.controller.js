import Exercise from "../models/exercise.model.js";
import Training from "../models/training.model.js";
// Các bộ phận cơ thể (bodyPart) trong dữ liệu:
// Bắp tay
// Cardio
// Cẳng chân
// Cẳng tay
// Eo
// Lưng
// Neck (cổ)
// Ngực
// Vai
// Đùi
export const getAllEquipments = async (req, res) => {
    try {
        const data = await Exercise.aggregate([
            { $group: { _id: "$equipment", count: { $sum: 1 } } }
        ]);

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No bodyParts data found!' });
        }

        res.status(200).json({
            message: "Fetch equipments data successfully!",
            data: data
        });


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const deleteExercisesById = async (req, res) => {
    try {
        await Exercise.findOneAndDelete({ _id: req.params.id });

        res.status(200).json({ message: "Xóa bài tập thành công!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateExercise = async (req, res) => {
    try {

        const newExe = await Exercise.findByIdAndUpdate(req.body._id, req.body)

        res.status(200).json({ message: "Cập nhật bài tập thành công!", data: newExe })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createNewExercise = async (req, res) => {
    try {

        const newExe = await Exercise.create(req.body)

        res.status(200).json({ message: "Tạo mới bài tập thành công!", data: newExe })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAllExercisesByBodyPart = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const skip = parseInt(req.query.skip) || 0
        const bodyPart = req.params.bodyPart

        const data = await Exercise.find({
            bodyPart: bodyPart
        })
            .skip(skip)
            .limit(limit)

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No exercises data found!' });
        }


        res.status(200).json({ message: "Fetch Exercises Data Successfully!", data: data })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAllExercisesBySearchQueryName = async (req, res) => {
    try {
        const searchQueryName = req.params.searchQueryName || "";

        const bodyParts = req.query.bodyParts ? JSON.parse(req.query.bodyParts) : [];
        const equipments = req.query.equipments ? JSON.parse(req.query.equipments) : [];

        const limit = parseInt(req.query.limit) || 0;
        const skip = parseInt(req.query.skip) || 0;

        const filter = {
            ...(searchQueryName && { name: { $regex: searchQueryName, $options: 'i' } }), // Tìm kiếm theo tên
            ...(bodyParts.length > 0 && { bodyPart: { $in: bodyParts } }),  // Tìm theo các bodyPart trong mảng
            ...(equipments.length > 0 && { equipment: { $in: equipments } }),  // Tìm theo các equipment trong mảng
        }

        const data = await Exercise.find(filter)
            .skip(skip)
            .limit(limit);

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No exercises data found!' });
        }

        res.status(200).json({ message: "Fetch Exercises Data Successfully!", data: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getExerciseById = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: 'Id is invalid!' });
        }

        const data = await Exercise.findById(id)

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No exercises data found!' });
        }

        res.status(200).json({ message: "Fetch Exercise Data By Id Successfully!", data: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getAllBodyPart = async (req, res) => {
    try {
        // Sử dụng aggregate để nhóm và đếm số lần xuất hiện của từng bodyPart
        const data = await Exercise.aggregate([
            { $group: { _id: "$bodyPart", count: { $sum: 1 } } },
            { $sort: { count: -1 } } // Sắp xếp theo số lượng giảm dần (tùy chọn)
        ]);

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No bodyParts data found!' });
        }

        res.status(200).json({
            message: "Fetch bodyPart data successfully!",
            data: data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllExercises = async (req, res) => {
    try {
        // Sử dụng aggregate để nhóm và đếm số lần xuất hiện của từng bodyPart
        const data = await Exercise.find();

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy dữ liệu!' });
        }

        res.status(200).json({
            message: "Lấy dữ liệu thành công!",
            data: data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

