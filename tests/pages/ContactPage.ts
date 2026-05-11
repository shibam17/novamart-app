import { type Page, type Locator } from "@playwright/test";

export class ContactPage {
  readonly page: Page;
  readonly contactForm: Locator;
  readonly contactSubmit: Locator;
  readonly contactSuccess: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectSelect: Locator;
  readonly messageInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contactForm = page.getByTestId("contact-form");
    this.contactSubmit = page.getByTestId("contact-submit");
    this.contactSuccess = page.getByTestId("contact-success");
    this.nameInput = page.locator("#name");
    this.emailInput = page.locator("#email");
    this.subjectSelect = page.locator("#subject");
    this.messageInput = page.locator("#message");
  }

  async goto() {
    await this.page.goto("/contact");
  }

  async fillForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.subjectSelect.selectOption(data.subject);
    await this.messageInput.fill(data.message);
  }

  async submitForm() {
    await this.contactSubmit.click();
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
}
