import { test, expect } from "@playwright/test";
import { AuthPage } from "../pages/AuthPage";
import { TEST_USER, clearAuth } from "../helpers/test-utils";

test.describe("Authentication", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await page.goto("/");
    await clearAuth(page);
  });

  test.describe("Login", () => {
    test("should display login form", async () => {
      await authPage.gotoLogin();
      await expect(authPage.loginForm).toBeVisible();
      await expect(authPage.emailInput).toBeVisible();
      await expect(authPage.passwordInput).toBeVisible();
      await expect(authPage.loginSubmit).toBeVisible();
    });

    test("should display demo credentials", async () => {
      await authPage.gotoLogin();
      await expect(authPage.demoCredentials).toBeVisible();
      await expect(authPage.demoCredentials).toContainText("demo@novamart.com");
    });

    test("should validate empty email", async () => {
      await authPage.gotoLogin();
      await authPage.login("", "demo123");
      const errors = await authPage.getValidationErrors();
      expect(errors.some((e) => e.includes("Email is required"))).toBeTruthy();
    });

    test("should validate invalid email format", async () => {
      await authPage.gotoLogin();
      await authPage.login("invalid-email", "demo123");
      const errors = await authPage.getValidationErrors();
      expect(errors.some((e) => e.includes("valid email"))).toBeTruthy();
    });

    test("should validate empty password", async () => {
      await authPage.gotoLogin();
      await authPage.login("demo@novamart.com", "");
      const errors = await authPage.getValidationErrors();
      expect(errors.some((e) => e.includes("Password is required"))).toBeTruthy();
    });

    test("should validate short password", async () => {
      await authPage.gotoLogin();
      await authPage.login("demo@novamart.com", "abc");
      const errors = await authPage.getValidationErrors();
      expect(errors.some((e) => e.includes("at least 6"))).toBeTruthy();
    });

    test("should show error for invalid credentials", async () => {
      await authPage.gotoLogin();
      await authPage.login("wrong@email.com", "wrongpass");
      await expect(authPage.loginError).toBeVisible();
      await expect(authPage.loginError).toContainText("Invalid email or password");
    });

    test("should login with demo credentials", async ({ page }) => {
      await authPage.gotoLogin();
      await authPage.loginWithDemoCredentials();
      await expect(page).toHaveURL(/\/account/);
    });

    test("should store user session in localStorage", async ({ page }) => {
      await authPage.gotoLogin();
      await authPage.loginWithDemoCredentials();
      await page.waitForURL(/\/account/);
      const isLoggedIn = await authPage.isLoggedIn();
      expect(isLoggedIn).toBeTruthy();
    });

    test("should redirect to account page after login", async ({ page }) => {
      await authPage.gotoLogin();
      await authPage.loginWithDemoCredentials();
      await expect(page).toHaveURL(/\/account/);
    });

    // REGRESSION: "Remember me" checkbox was supposed to extend session to 30 days
    test("should persist login when remember me is checked", async ({ page }) => {
      await authPage.gotoLogin();
      await page.locator('input[name="remember"]').check();
      await authPage.loginWithDemoCredentials();
      await page.waitForURL(/\/account/);
      const sessionExpiry = await page.evaluate(() =>
        localStorage.getItem("novamart-session-expiry")
      );
      expect(sessionExpiry).not.toBeNull();
    });
  });

  test.describe("Registration", () => {
    test("should display registration form", async ({ page }) => {
      await authPage.gotoRegister();
      await expect(page.locator("#name")).toBeVisible();
      await expect(page.locator("#email")).toBeVisible();
      await expect(page.locator("#password")).toBeVisible();
      await expect(page.locator("#confirmPassword")).toBeVisible();
    });

    test("should have link to login page", async ({ page }) => {
      await authPage.gotoRegister();
      const loginLink = page.locator('a[href="/auth/login"]');
      await expect(loginLink.first()).toBeVisible();
    });

    // Skip: Social login buttons not implemented (OAuth integration pending)
    test.skip("should display Google sign-in button", async ({ page }) => {
      await authPage.gotoRegister();
      await expect(page.getByTestId("google-signin")).toBeVisible();
    });

    // Skip: Social login
    test.skip("should display Apple sign-in button", async ({ page }) => {
      await authPage.gotoRegister();
      await expect(page.getByTestId("apple-signin")).toBeVisible();
    });
  });

  test.describe("Logout", () => {
    test("should clear user session on logout", async ({ page }) => {
      await authPage.gotoLogin();
      await authPage.loginWithDemoCredentials();
      await page.waitForURL(/\/account/);
      await authPage.logout();
      const isLoggedIn = await authPage.isLoggedIn();
      expect(isLoggedIn).toBeFalsy();
    });
  });

  test.describe("Protected Routes", () => {
    // Skip: Route protection not implemented - relies on localStorage check only
    test.skip("should redirect to login when accessing account page unauthenticated", async ({ page }) => {
      await page.goto("/account");
      await expect(page).toHaveURL(/\/auth\/login/);
    });
  });
});
