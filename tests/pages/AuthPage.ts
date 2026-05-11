import { type Page, type Locator } from "@playwright/test";

export class AuthPage {
  readonly page: Page;
  readonly loginForm: Locator;
  readonly loginSubmit: Locator;
  readonly loginError: Locator;
  readonly demoCredentials: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginForm = page.getByTestId("login-form");
    this.loginSubmit = page.getByTestId("login-submit");
    this.loginError = page.getByTestId("login-error");
    this.demoCredentials = page.getByTestId("demo-credentials");
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
  }

  async gotoLogin() {
    await this.page.goto("/auth/login");
  }

  async gotoRegister() {
    await this.page.goto("/auth/register");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
  }

  async loginWithDemoCredentials() {
    await this.login("demo@novamart.com", "demo123");
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.page.locator("#name").fill(data.name);
    await this.page.locator("#email").fill(data.email);
    await this.page.locator("#password").fill(data.password);
    await this.page.locator("#confirmPassword").fill(data.confirmPassword);
    await this.page.locator('[data-testid="terms-checkbox"]').check();
    await this.page.locator('[data-testid="register-submit"]').click();
  }

  async getValidationErrors(): Promise<string[]> {
    const errors = this.page.locator('[role="alert"]');
    const count = await errors.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await errors.nth(i).textContent();
      if (text) texts.push(text);
    }
    return texts;
  }

  async isLoggedIn(): Promise<boolean> {
    const user = await this.page.evaluate(() =>
      localStorage.getItem("novamart-user")
    );
    return user !== null;
  }

  async logout() {
    await this.page.evaluate(() => {
      localStorage.removeItem("novamart-user");
      window.dispatchEvent(new Event("auth-changed"));
    });
  }
}
