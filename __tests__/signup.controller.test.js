import { jest } from "@jest/globals";

// Thiết lập môi trường
process.env.JWT_SECRET_KEY = "test_secret_key";

// Tạo mock objects
const User = {
  findOne: jest.fn(),
  create: jest.fn(),
};

// Hàm signup từ auth.controller.js
const signup = async (req, res) => {
  try {
    const { email, password, username, clerkId } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại!" });
    }
    const user = await User.create(req.body);

    res.status(201).json({ user, message: "Đăng ký tài khoản thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

describe("Kiểm thử chức năng Đăng ký (White Box - Phủ đường)", () => {
  let req;
  let res;

  beforeEach(() => {
    // Khởi tạo lại mock trước mỗi test
    jest.clearAllMocks();

    // Mock request và response
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // TC1: Đăng ký thành công với thông tin hợp lệ
  test("TC1: Đăng ký thành công với thông tin hợp lệ", async () => {
    // Arrange
    const mockUser = {
      _id: "user123",
      email: "newuser@example.com",
      username: "newuser",
      password: "hashedPassword",
      clerkId: "clerk123",
    };

    req.body = {
      email: mockUser.email,
      username: mockUser.username,
      password: "password123",
      clerkId: mockUser.clerkId,
    };

    // Mock userExist = null (không tìm thấy user)
    User.findOne.mockResolvedValue(null);
    // Mock user được tạo thành công
    User.create.mockResolvedValue(mockUser);

    // Act
    await signup(req, res);

    // Assert - Đường thành công
    expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      user: mockUser,
      message: "Đăng ký tài khoản thành công!",
    });
  });

  // TC2: Đăng ký thất bại với email đã tồn tại
  test("TC2: Đăng ký thất bại với email đã tồn tại", async () => {
    // Arrange
    const existingUser = {
      _id: "user123",
      email: "existing@example.com",
      username: "existinguser",
    };

    req.body = {
      email: existingUser.email,
      username: "newusername",
      password: "password123",
      clerkId: "clerk123",
    };

    // Mock tìm thấy user với email đã tồn tại
    User.findOne.mockResolvedValue(existingUser);

    // Act
    await signup(req, res);

    // Assert - Đường email đã tồn tại
    expect(User.findOne).toHaveBeenCalledWith({ email: existingUser.email });
    expect(User.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tài khoản đã tồn tại!",
    });
  });

  // TC3: Đăng ký thất bại với username đã tồn tại
  test("TC3: Đăng ký thất bại với username đã tồn tại", async () => {
    // Arrange
    const validationError = new Error("Username already exists");
    validationError.name = "ValidationError";

    req.body = {
      email: "new@example.com",
      username: "existingusername", // username đã tồn tại
      password: "password123",
      clerkId: "clerk123",
    };

    // Mock không tìm thấy user với email
    User.findOne.mockResolvedValue(null);
    // Mock lỗi validation khi tạo user
    User.create.mockRejectedValue(validationError);

    // Act
    await signup(req, res);

    // Assert - Đường lỗi validation
    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: validationError.message,
    });
  });

  // TC4: Đăng ký thất bại với mật khẩu không đủ mạnh
  test("TC4: Đăng ký thất bại với mật khẩu không đủ mạnh", async () => {
    // Arrange
    const passwordError = new Error("Mật khẩu tối thiểu 6 kí tự!");
    passwordError.name = "ValidationError";

    req.body = {
      email: "new@example.com",
      username: "newuser",
      password: "123", // Mật khẩu quá ngắn
      clerkId: "clerk123",
    };

    // Mock không tìm thấy user với email
    User.findOne.mockResolvedValue(null);
    // Mock lỗi validation khi tạo user
    User.create.mockRejectedValue(passwordError);

    // Act
    await signup(req, res);

    // Assert - Đường lỗi validation mật khẩu
    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: passwordError.message,
    });
  });

  // TC5: Đăng ký thất bại với email không hợp lệ
  test("TC5: Đăng ký thất bại với email không hợp lệ", async () => {
    // Arrange
    const emailError = new Error("Email is invalid");
    emailError.name = "ValidationError";

    req.body = {
      email: "invalid-email", // Email không hợp lệ
      username: "newuser",
      password: "password123",
      clerkId: "clerk123",
    };

    // Mock không tìm thấy user với email
    User.findOne.mockResolvedValue(null);
    // Mock lỗi validation khi tạo user
    User.create.mockRejectedValue(emailError);

    // Act
    await signup(req, res);

    // Assert - Đường lỗi validation email
    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: emailError.message,
    });
  });

  // TC6: Đăng ký thất bại khi thiếu thông tin
  test("TC6: Đăng ký thất bại khi thiếu thông tin", async () => {
    // Arrange
    const missingFieldError = new Error("Email là bắt buộc");
    missingFieldError.name = "ValidationError";

    req.body = {
      // Thiếu email
      username: "newuser",
      password: "password123",
      clerkId: "clerk123",
    };

    // Mock không tìm thấy user (vì email không được cung cấp)
    User.findOne.mockResolvedValue(null);
    // Mock lỗi validation khi tạo user
    User.create.mockRejectedValue(missingFieldError);

    // Act
    await signup(req, res);

    // Assert - Đường lỗi thiếu thông tin
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: missingFieldError.message,
    });
  });

  // TC7: Đăng ký thất bại khi server không phản hồi
  test("TC7: Đăng ký thất bại khi server không phản hồi", async () => {
    // Arrange
    const serverError = new Error("Database connection error");

    req.body = {
      email: "new@example.com",
      username: "newuser",
      password: "password123",
      clerkId: "clerk123",
    };

    // Mock không tìm thấy user với email
    User.findOne.mockRejectedValue(serverError);

    // Act
    await signup(req, res);

    // Assert - Đường lỗi server
    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(User.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: serverError.message,
    });
  });

  // TC8: Đăng ký thất bại khi DB không thể tạo tài khoản
  test("TC8: Đăng ký thất bại khi DB không thể tạo tài khoản", async () => {
    // Arrange
    const dbError = new Error("Cannot create user in database");

    req.body = {
      email: "new@example.com",
      username: "newuser",
      password: "password123",
      clerkId: "clerk123",
    };

    // Mock không tìm thấy user với email
    User.findOne.mockResolvedValue(null);
    // Mock lỗi database khi tạo user
    User.create.mockRejectedValue(dbError);

    // Act
    await signup(req, res);

    // Assert - Đường lỗi database khi tạo
    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: dbError.message,
    });
  });
});
