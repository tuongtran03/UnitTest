import { jest } from "@jest/globals";

const Exercise = {
  find: jest.fn(),
  aggregate: jest.fn(),
};

const Food = {
  find: jest.fn(),
};

const getAllExercisesBySearchQueryName = async (req, res) => {
  try {
    const searchQueryName = req.params.searchQueryName || "";
    const bodyParts = req.query.bodyParts
      ? JSON.parse(req.query.bodyParts)
      : [];
    const equipments = req.query.equipments
      ? JSON.parse(req.query.equipments)
      : [];
    const limit = parseInt(req.query.limit) || 0;
    const skip = parseInt(req.query.skip) || 0;

    const filter = {
      ...(searchQueryName && {
        name: { $regex: searchQueryName, $options: "i" },
      }),
      ...(bodyParts.length > 0 && { bodyPart: { $in: bodyParts } }),
      ...(equipments.length > 0 && { equipment: { $in: equipments } }),
    };

    const data = await Exercise.find(filter).skip(skip).limit(limit);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No exercises data found!" });
    }

    res
      .status(200)
      .json({ message: "Fetch Exercises Data Successfully!", data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFoods = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const skip = parseInt(req.query.skip) || 0;
    const { ...filters } = req.query;

    const query = {};
    if (filters.name || filters.name != "") {
      query.name = { $regex: filters?.name, $options: "i" };
    }
    if (filters.Calories && filters.Calories != "0") {
      query.Calories = { $lte: parseFloat(filters.Calories) };
    }
    if (filters.Protein && filters.Protein != "0") {
      query.Protein = { $lte: parseFloat(filters.Protein) };
    }
    if (filters.Fat && filters.Fat != "0") {
      query.Fat = { $lte: parseFloat(filters.Fat) };
    }
    if (filters.Carbonhydrates && filters.Carbonhydrates != "0") {
      query.Carbonhydrates = { $lte: parseFloat(filters.Carbonhydrates) };
    }

    const foods = await Food.find(query).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      message: "Lấy dữ liệu thực phẩm thành công",
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      message: "Đã xảy ra lỗi khi truy vấn dữ liệu",
      error: error.message,
    });
  }
};

const getAllExercisesByBodyPart = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    const bodyPart = req.params.bodyPart;

    const data = await Exercise.find({
      bodyPart: bodyPart,
    })
      .skip(skip)
      .limit(limit);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No exercises data found!" });
    }

    res
      .status(200)
      .json({ message: "Fetch Exercises Data Successfully!", data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

describe("Kiểm thử chức năng Tìm kiếm (Black Box)", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("TC1: Tìm kiếm bài tập theo tên", async () => {
    const mockExercises = [
      {
        _id: "exercise1",
        name: "Bench Press",
        bodyPart: "Ngực",
        equipment: "barbell",
      },
      {
        _id: "exercise2",
        name: "Incline Bench Press",
        bodyPart: "Ngực",
        equipment: "barbell",
      },
    ];

    req.params.searchQueryName = "Bench";
    Exercise.find.mockImplementation(() => ({
      skip: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue(mockExercises),
      })),
    }));

    await getAllExercisesBySearchQueryName(req, res);

    expect(Exercise.find).toHaveBeenCalledWith({
      name: { $regex: "Bench", $options: "i" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Fetch Exercises Data Successfully!",
      data: mockExercises,
    });
  });

  test("TC2: Tìm kiếm thực phẩm theo tên", async () => {
    const mockFoods = [
      {
        _id: "food1",
        name: "Chuối",
        Calories: 89,
        Protein: 1.1,
        Fat: 0.3,
        Carbonhydrates: 22.8,
      },
      {
        _id: "food2",
        name: "Bánh mì chuối",
        Calories: 250,
        Protein: 4,
        Fat: 9,
        Carbonhydrates: 40,
      },
    ];

    req.query = { name: "Chuối" };
    Food.find.mockImplementation(() => ({
      skip: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue(mockFoods),
      })),
    }));

    await getAllFoods(req, res);

    expect(Food.find).toHaveBeenCalledWith({
      name: { $regex: "Chuối", $options: "i" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Lấy dữ liệu thực phẩm thành công",
      data: mockFoods,
    });
  });

  test("TC3: Lọc bài tập theo vùng cơ thể", async () => {
    const mockExercises = [
      {
        _id: "exercise1",
        name: "Bench Press",
        bodyPart: "Ngực",
        equipment: "barbell",
      },
      {
        _id: "exercise2",
        name: "Incline Bench Press",
        bodyPart: "Ngực",
        equipment: "dumbbell",
      },
    ];

    req.params.bodyPart = "Ngực";
    Exercise.find.mockImplementation(() => ({
      skip: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue(mockExercises),
      })),
    }));

    await getAllExercisesByBodyPart(req, res);

    expect(Exercise.find).toHaveBeenCalledWith({ bodyPart: "Ngực" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Fetch Exercises Data Successfully!",
      data: mockExercises,
    });
  });

  test("TC4: Tìm kiếm với từ khóa rỗng", async () => {
    const mockExercises = [
      {
        _id: "exercise1",
        name: "Bench Press",
        bodyPart: "Ngực",
        equipment: "barbell",
      },
      {
        _id: "exercise2",
        name: "Squat",
        bodyPart: "Đùi",
        equipment: "barbell",
      },
    ];

    req.params.searchQueryName = ""; // Từ khóa rỗng
    Exercise.find.mockImplementation(() => ({
      skip: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue(mockExercises),
      })),
    }));

    await getAllExercisesBySearchQueryName(req, res);

    expect(Exercise.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Fetch Exercises Data Successfully!",
      data: mockExercises,
    });
  });

  test("TC5: Tìm kiếm với từ khóa quá dài", async () => {
    const longSearchQuery = "a".repeat(100); // Tạo chuỗi dài 100 ký tự 'a'

    req.params.searchQueryName = longSearchQuery;
    Exercise.find.mockImplementation(() => ({
      skip: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue([]),
      })),
    }));

    await getAllExercisesBySearchQueryName(req, res);

    expect(Exercise.find).toHaveBeenCalledWith({
      name: { $regex: longSearchQuery, $options: "i" },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No exercises data found!",
    });
  });

  test("TC6: Tìm kiếm với ký tự đặc biệt", async () => {
    const specialCharacters = "$%^&*()";

    req.params.searchQueryName = specialCharacters;

    const error = new Error("Lỗi cú pháp regex");
    Exercise.find.mockImplementation(() => {
      throw error;
    });

    await getAllExercisesBySearchQueryName(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
    });
  });

  test("TC7: Tìm kiếm khi không có kết quả", async () => {
    req.params.searchQueryName = "NonExistentExercise";
    Exercise.find.mockImplementation(() => ({
      skip: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue([]),
      })),
    }));

    await getAllExercisesBySearchQueryName(req, res);

    expect(Exercise.find).toHaveBeenCalledWith({
      name: { $regex: "NonExistentExercise", $options: "i" },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No exercises data found!",
    });
  });
});
