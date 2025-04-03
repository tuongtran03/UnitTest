import { jest } from "@jest/globals";

const Exercise = {
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  findById: jest.fn(),
  aggregate: jest.fn(),
  find: jest.fn(),
};

const Training = {
  updateMany: jest.fn(),
};

const createNewExercise = async (req, res) => {
  try {
    const newExe = await Exercise.create(req.body);
    res
      .status(200)
      .json({ message: "Tạo mới bài tập thành công!", data: newExe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExercise = async (req, res) => {
  try {
    const newExe = await Exercise.findByIdAndUpdate(req.body._id, req.body);
    res
      .status(200)
      .json({ message: "Cập nhật bài tập thành công!", data: newExe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExercisesById = async (req, res) => {
  try {
    await Exercise.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "Xóa bài tập thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

describe("Kiểm thử chức năng Quản lý Bài tập (Black Box)", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("TC1: Tạo bài tập mới với thông tin đầy đủ", async () => {
    const mockExercise = {
      bodyPart: "Ngực",
      equipment: "barbell",
      gifUrl: "http://example.com/exercise.gif",
      name: "Bench Press",
      target: "pectorals",
      secondaryMuscles: ["deltoids", "triceps"],
      instructions: ["Nằm trên ghế", "Đẩy thanh tạ lên"],
      levels: ["beginner", "intermediate"],
      purposes: ["strength", "muscle"],
    };

    req.body = mockExercise;
    Exercise.create.mockResolvedValue(mockExercise);

    await createNewExercise(req, res);

    expect(Exercise.create).toHaveBeenCalledWith(mockExercise);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tạo mới bài tập thành công!",
      data: mockExercise,
    });
  });

  test("TC2: Tạo bài tập mới với thông tin thiếu", async () => {
    // Arrange
    const mockExercise = {
      bodyPart: "Ngực",
      equipment: "barbell",
      name: "Bench Press",
    };

    req.body = mockExercise;
    const error = new Error("Thiếu thông tin bắt buộc");
    Exercise.create.mockRejectedValue(error);

    await createNewExercise(req, res);

    expect(Exercise.create).toHaveBeenCalledWith(mockExercise);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
    });
  });

  test("TC3: Chỉnh sửa bài tập hiện có", async () => {
    const mockExercise = {
      _id: "exercise123",
      bodyPart: "Ngực",
      equipment: "barbell",
      gifUrl: "http://example.com/exercise.gif",
      name: "Bench Press",
      target: "pectorals",
      secondaryMuscles: ["deltoids", "triceps"],
      instructions: ["Nằm trên ghế", "Đẩy thanh tạ lên"],
      levels: ["beginner", "intermediate"],
      purposes: ["strength", "muscle"],
    };

    req.body = mockExercise;
    Exercise.findByIdAndUpdate.mockResolvedValue(mockExercise);

    await updateExercise(req, res);

    expect(Exercise.findByIdAndUpdate).toHaveBeenCalledWith(
      mockExercise._id,
      mockExercise
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cập nhật bài tập thành công!",
      data: mockExercise,
    });
  });

  test("TC4: Tạo bài tập với tên rỗng", async () => {
    const mockExercise = {
      bodyPart: "Ngực",
      equipment: "barbell",
      gifUrl: "http://example.com/exercise.gif",
      name: "", // Tên rỗng
      target: "pectorals",
    };

    req.body = mockExercise;
    const error = new Error("Tên bài tập không được để trống");
    Exercise.create.mockRejectedValue(error);

    await createNewExercise(req, res);

    expect(Exercise.create).toHaveBeenCalledWith(mockExercise);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
    });
  });

  test("TC5: Tạo bài tập với số lần tập = 0", async () => {
    const mockExercise = {
      bodyPart: "Ngực",
      equipment: "barbell",
      gifUrl: "http://example.com/exercise.gif",
      name: "Bench Press",
      target: "pectorals",
      sets: 0, // Số lần tập = 0
    };

    req.body = mockExercise;
    const error = new Error("Số lần tập phải lớn hơn 0");
    Exercise.create.mockRejectedValue(error);

    await createNewExercise(req, res);

    expect(Exercise.create).toHaveBeenCalledWith(mockExercise);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
    });
  });

  test("TC6: Xóa bài tập đang được sử dụng", async () => {
    const exerciseId = "exercise123";
    req.params.id = exerciseId;

    // Giả lập lỗi khi xóa bài tập đang được sử dụng
    const error = new Error("Bài tập đang được sử dụng trong các training");
    Exercise.findOneAndDelete.mockRejectedValue(error);

    await deleteExercisesById(req, res);

    expect(Exercise.findOneAndDelete).toHaveBeenCalledWith({ _id: exerciseId });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
    });
  });

  test("TC7: Cập nhật bài tập không tồn tại", async () => {
    const mockExercise = {
      _id: "nonexistentId",
      bodyPart: "Ngực",
      equipment: "barbell",
      name: "Bench Press",
    };

    req.body = mockExercise;

    Exercise.findByIdAndUpdate.mockResolvedValue(null);

    await updateExercise(req, res);

    expect(Exercise.findByIdAndUpdate).toHaveBeenCalledWith(
      mockExercise._id,
      mockExercise
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cập nhật bài tập thành công!",
      data: null,
    });
  });
});
