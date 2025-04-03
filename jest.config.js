export default {
  transform: {},
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(module-that-needs-to-be-transformed)/)",
  ],
  // Sửa lại cách bỏ qua routes để nó hoạt động đúng
  modulePathIgnorePatterns: ["<rootDir>/routes"],
};
