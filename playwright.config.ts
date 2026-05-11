import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: parseInt(process.env.TEST_RETRIES || "1"),
  workers: process.env.CI ? 2 : parseInt(process.env.MAX_WORKERS || "4"),
  timeout: parseInt(process.env.TEST_TIMEOUT || "30000"),

  expect: {
    timeout: parseInt(process.env.EXPECT_TIMEOUT || "5000"),
  },

  reporter: [
    ["list"],
    ["junit", { outputFile: "test-results/results.xml" }],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || "15000"),
    headless: process.env.HEADLESS !== "false",
    launchOptions: {
      slowMo: parseInt(process.env.SLOW_MO || "0"),
    },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
