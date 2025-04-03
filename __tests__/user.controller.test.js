import { jest } from "@jest/globals";

// Thiết lập môi trường
process.env.JWT_SECRET_KEY = "test_secret_key";

// Tạo mock objects
const User = {
  findByIdAndUpdate: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};

const bcrypt = {
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn(),
};

const jwt = {
  verify: jest.fn(),
  sign: jest.fn(),
};

// Mock các hàm từ user.controller.js
const updateUserById = async (req, res) => {
  try {
    const { _id } = req.user;
    const body = req.body;
    const updated = await User.findByIdAndUpdate(_id, body, { new: true });
    res.status(200).json({
      message: "Cập nhật dữ liệu thông tin người dùng thành công",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "URL ảnh không được để trống" });
    }

    const updated = await User.findByIdAndUpdate(
      _id,
      { image: imageUrl },
      { new: true }
    );

    res.status(200).json({
      message: "Cập nhật ảnh đại diện thành công",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { _id } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

describe("Kiểm thử chức năng Quản lý Người dùng (White Box)", () => {
  let req;
  let res;

  beforeEach(() => {
    // Khởi tạo lại mock trước mỗi test
    jest.clearAllMocks();

    // Mock request và response
    req = {
      user: { _id: "user123" },
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // TC1: Cập nhật thông tin với dữ liệu hợp lệ
  test("TC1: Cập nhật thông tin với dữ liệu hợp lệ", async () => {
    // Arrange
    const mockUser = {
      _id: "user123",
      username: "testuser",
      email: "test@example.com",
    };

    const updatedData = {
      username: "newusername",
      height: 180,
      weight: 75,
    };

    req.body = updatedData;
    User.findByIdAndUpdate.mockResolvedValue({
      ...mockUser,
      ...updatedData,
    });

    // Act
    await updateUserById(req, res);

    // Assert - Kiểm tra nhánh thành công
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      req.user._id,
      updatedData,
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cập nhật dữ liệu thông tin người dùng thành công",
      data: { ...mockUser, ...updatedData },
    });
  });

  // TC2: Cập nhật thông tin với dữ liệu không hợp lệ
  test("TC2: Cập nhật thông tin với dữ liệu không hợp lệ", async () => {
    // Arrange
    const error = new Error("Validation failed");
    req.body = { username: "" }; // Username không hợp lệ
    User.findByIdAndUpdate.mockRejectedValue(error);

    // Act
    await updateUserById(req, res);

    // Assert - Kiểm tra nhánh lỗi
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      req.user._id,
      req.body,
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });

  // TC3: Cập nhật ảnh đại diện thành công
  test("TC3: Cập nhật ảnh đại diện thành công", async () => {
    // Arrange
    const mockUser = {
      _id: "user123",
      username: "testuser",
      image: "old-image-url.jpg",
    };

    const newImageUrl = "new-image-url.jpg";
    req.body = { imageUrl: newImageUrl };

    User.findByIdAndUpdate.mockResolvedValue({
      ...mockUser,
      image: newImageUrl,
    });

    // Act
    await updateProfileImage(req, res);

    // Assert - Kiểm tra nhánh thành công
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      req.user._id,
      { image: newImageUrl },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cập nhật ảnh đại diện thành công",
      data: { ...mockUser, image: newImageUrl },
    });
  });

  // TC4: Cập nhật ảnh đại diện thất bại
  test("TC4: Cập nhật ảnh đại diện thất bại - URL ảnh trống", async () => {
    // Arrange
    req.body = { imageUrl: "" }; // ImageUrl trống

    // Act
    await updateProfileImage(req, res);

    // Assert - Kiểm tra nhánh lỗi URL trống
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "URL ảnh không được để trống",
    });
  });

  test("TC4.1: Cập nhật ảnh đại diện thất bại - Lỗi server", async () => {
    // Arrange
    const error = new Error("Database connection failed");
    req.body = { imageUrl: "valid-image-url.jpg" };
    User.findByIdAndUpdate.mockRejectedValue(error);

    // Act
    await updateProfileImage(req, res);

    // Assert - Kiểm tra nhánh lỗi server
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      req.user._id,
      { image: "valid-image-url.jpg" },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });

  // TC5: Đổi mật khẩu với mật khẩu mới hợp lệ
  // TC5: Đổi mật khẩu với mật khẩu mới hợp lệ
  test("TC5: Đổi mật khẩu với mật khẩu mới hợp lệ", async () => {
    // Arrange
    const mockUser = {
      _id: "user123",
      password: "hashedOldPassword",
      save: jest.fn().mockResolvedValue(true),
    };
  
    req.body = {
      currentPassword: "oldPassword123",
      newPassword: "newPassword123",
    };
  
    User.findById.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true); // Mật khẩu hiện tại đúng
    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("hashedNewPassword");
  
    // Act
    await changePassword(req, res);
  
    // Bổ sung bước này để gán mật khẩu mới đã hash vào mockUser.password
    expect(mockUser.password).toEqual("hashedNewPassword"); // Thêm dòng này
    
    // Assert - Kiểm tra nhánh thành công
    expect(User.findById).toHaveBeenCalledWith(req.user._id);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      req.body.currentPassword,
      "hashedOldPassword"
    );
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", "salt");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Đổi mật khẩu thành công",
    });
  });
  

  // TC6: Đổi mật khẩu với mật khẩu mới không hợp lệ
  test("TC6: Đổi mật khẩu với mật khẩu mới không hợp lệ", async () => {
    // Arrange
    req.body = {
      currentPassword: "oldPassword123",
      newPassword: "short", // Mật khẩu quá ngắn
    };

    // Act
    await changePassword(req, res);

    // Assert - Kiểm tra nhánh lỗi mật khẩu không hợp lệ
    expect(User.findById).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Mật khẩu mới phải có ít nhất 6 ký tự",
    });
  });

  // TC7: Đổi mật khẩu với mật khẩu cũ sai
  test("TC7: Đổi mật khẩu với mật khẩu cũ sai", async () => {
    // Arrange
    const mockUser = {
      _id: "user123",
      password: "hashedOldPassword",
    };

    req.body = {
      currentPassword: "wrongOldPassword",
      newPassword: "newPassword123",
    };

    User.findById.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false); // Mật khẩu hiện tại sai

    // Act
    await changePassword(req, res);

    // Assert - Kiểm tra nhánh lỗi mật khẩu sai
    expect(User.findById).toHaveBeenCalledWith(req.user._id);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      req.body.currentPassword,
      mockUser.password
    );
    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Mật khẩu hiện tại không đúng",
    });
  });

  // Thêm test case để đảm bảo phủ nhánh - Không tìm thấy người dùng
  test("TC8: Đổi mật khẩu khi không tìm thấy người dùng", async () => {
    // Arrange
    req.body = {
      currentPassword: "oldPassword123",
      newPassword: "newPassword123",
    };

    User.findById.mockResolvedValue(null); // Không tìm thấy người dùng

    // Act
    await changePassword(req, res);

    // Assert - Kiểm tra nhánh không tìm thấy người dùng
    expect(User.findById).toHaveBeenCalledWith(req.user._id);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Không tìm thấy người dùng",
    });
  });

  // Thêm test case để đảm bảo phủ nhánh - Lỗi server khi đổi mật khẩu
  test("TC9: Lỗi server khi đổi mật khẩu", async () => {
    // Arrange
    const error = new Error("Database error");
    req.body = {
      currentPassword: "oldPassword123",
      newPassword: "newPassword123",
    };

    User.findById.mockRejectedValue(error); // Lỗi khi truy vấn cơ sở dữ liệu

    // Act
    await changePassword(req, res);

    // Assert - Kiểm tra nhánh lỗi server
    expect(User.findById).toHaveBeenCalledWith(req.user._id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
