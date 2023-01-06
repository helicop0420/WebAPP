require("dotenv").config({ path: ".env.test.local", override: true });
const nextJest = require("next/jest");

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http://localhost:")
) {
  throw new Error(
    "env variable NEXT_PUBLIC_SUPABASE_URL must be set and should point to a local instance"
  );
}

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleDirectories: ["node_modules", __dirname],
  testEnvironment: "jest-environment-jsdom",
};
module.exports = createJestConfig(customJestConfig);
