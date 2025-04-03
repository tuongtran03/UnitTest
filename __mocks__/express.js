const mockRouter = {
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
};

export default {
  Router: jest.fn(() => mockRouter),
};
