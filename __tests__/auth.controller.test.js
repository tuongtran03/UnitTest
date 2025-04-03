import { jest } from "@jest/globals";

process.env.JWT_SECRET_KEY = "test_secret_key";

const User = {
  find: jest.fn(),
};

const bcrypt = {
  compare: jest.fn(),
};

const jwt = {
  sign: jest.fn(),
};

const userSockets = {};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await User.find({ email });
    if (!user) {
      return res.status(400).json({ message: "Email chưa được đăng ký" });
    }
    if (userSockets[user._id]) {
      return res.status(400).json({
        message:
          "Đã có thiết bị đăng nhập. Vui lòng đăng xuất trên thiết bị khác!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ data: user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

describe("Kiểm thử chức năng Đăng nhập (Black Box)", () => {
  let req;
  let res;

  beforeEach(() => {
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

  test("TC1: Đăng nhập với email hợp lệ và mật khẩu đúng", async () => {
    // Arrange
    const mockUser = {
      _id: "user123",
      email: "test@example.com",
      password: "hashedPassword",
      role: "USER",
    };

    req.body = {
      email: "test@example.com",
      password: "password123",
    };

    User.find.mockResolvedValue([mockUser]);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("validToken");

    await login(req, res);

    
    expect(User.find).toHaveBeenCalledWith({ email: req.body.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      req.body.password,
      mockUser.password
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { _id: mockUser._id, role: mockUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: mockUser,
      token: "validToken",
    });
  });

  test("TC2: Đăng nhập với email không hợp lệ", async () => {
    req.body = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    User.find.mockResolvedValue([]);

    await login(req, res);

    expect(User.find).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email chưa được đăng ký",
    });
  });

  test("TC3: Đăng nhập với mật khẩu sai", async () => {
    // Arrange
    const mockUser = {
      _id: "user123",
      email: "test@example.com",
      password: "hashedPassword",
    };

    req.body = {
      email: "test@example.com",
      password: "wrongPassword",
    };

    User.find.mockResolvedValue([mockUser]);
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(User.find).toHaveBeenCalledWith({ email: req.body.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      req.body.password,
      mockUser.password
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Sai mật khẩu!",
    });
  });

  test("TC4: Đăng nhập với email rỗng", async () => {
    // Arrange
    req.body = {
      email: "",
      password: "password123",
    };

    User.find.mockResolvedValue([]);

    await login(req, res);

    expect(User.find).toHaveBeenCalledWith({ email: "" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email chưa được đăng ký",
    });
  });

  test("TC5: Đăng nhập với mật khẩu rỗng", async () => {
    // Arrange
    const mockUser = {
      _id: "user123",
      email: "test@example.com",
      password: "hashedPassword",
    };

    req.body = {
      email: "test@example.com",
      password: "",
    };

    User.find.mockResolvedValue([mockUser]);
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(User.find).toHaveBeenCalledWith({ email: req.body.email });
    expect(bcrypt.compare).toHaveBeenCalledWith("", mockUser.password);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Sai mật khẩu!",
    });
  });

  test("TC6: Đăng nhập với tài khoản bị khóa", async () => {
    // Arrange
    const mockUser = {
      _id: "user123",
      email: "test@example.com",
      password: "hashedPassword",
    };

    req.body = {
      email: "test@example.com",
      password: "password123",
    };

    User.find.mockResolvedValue([mockUser]);
    userSockets[mockUser._id] = "someSocketId"; // Đã đăng nhập ở thiết bị khác

    await login(req, res);

    expect(User.find).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Đã có thiết bị đăng nhập. Vui lòng đăng xuất trên thiết bị khác!",
    });
  });

  test("TC7: Đăng nhập khi server không phản hồi", async () => {
    req.body = {
      email: "test@example.com",
      password: "password123",
    };

    const errorMessage = "Lỗi kết nối đến server";
    User.find.mockRejectedValue(new Error(errorMessage));

    await login(req, res);

    expect(User.find).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: errorMessage,
    });
  });
});
