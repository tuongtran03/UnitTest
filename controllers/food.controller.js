import Food from "../models/food.model.js"

export const getAllFoods = async (req, res) => {
    try {

        const limit = parseInt(req.query.limit) || 0;
        const skip = parseInt(req.query.skip) || 0;
        const { ...filters } = req.query;

        const query = {};
        if (filters.name || filters.name != "") {
            query.name = { $regex: filters?.name, $options: 'i' };
        }
        if (filters.Calories && filters.Calories != '0') {
            query.Calories = { $lte: parseFloat(filters.Calories) };
        }
        if (filters.Protein && filters.Protein != '0') {
            query.Protein = { $lte: parseFloat(filters.Protein) };
        }
        if (filters.Fat && filters.Fat != '0') {
            query.Fat = { $lte: parseFloat(filters.Fat) };
        }
        if (filters.Carbonhydrates && filters.Carbonhydrates != '0') {
            query.Carbonhydrates = { $lte: parseFloat(filters.Carbonhydrates) };
        }

        const foods = await Food.find(query)
            .skip(skip)
            .limit(limit);


        res.status(200).json({
            success: true,
            message: "Lấy dữ liệu thực phẩm thành công",
            data: foods,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Đã xảy ra lỗi khi truy vấn dữ liệu',
            error: error.message,
        });
    }
}