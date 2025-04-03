import { jest } from "@jest/globals";

// Thêm mock cho routes/auth.route.js để tránh lỗi circular dependency
jest.mock("../../routes/auth.route.js", () => ({}), { virtual: true });

jest.mock("express");
