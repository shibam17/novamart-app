import { test, expect } from "@playwright/test";
import { ContactPage } from "../pages/ContactPage";

test.describe("Contact Page", () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.goto();
  });

  test.describe("Page Layout", () => {
    test("should display contact form", async () => {
      await expect(contactPage.contactForm).toBeVisible();
    });

    test("should display contact info cards", async ({ page }) => {
      await expect(page.getByTestId("contact-email")).toBeVisible();
      await expect(page.getByTestId("contact-phone")).toBeVisible();
      await expect(page.getByTestId("contact-hours")).toBeVisible();
    });

    test("should display all form fields", async () => {
      await expect(contactPage.nameInput).toBeVisible();
      await expect(contactPage.emailInput).toBeVisible();
      await expect(contactPage.subjectSelect).toBeVisible();
      await expect(contactPage.messageInput).toBeVisible();
      await expect(contactPage.contactSubmit).toBeVisible();
    });
  });

  test.describe("Form Validation", () => {
    test("should validate empty name", async () => {
      await contactPage.submitForm();
      const errors = await contactPage.getValidationErrors();
      expect(errors.some((e) => e.includes("Name is required"))).toBeTruthy();
    });

    test("should validate empty email", async () => {
      await contactPage.submitForm();
      const errors = await contactPage.getValidationErrors();
      expect(errors.some((e) => e.includes("Email is required"))).toBeTruthy();
    });

    test("should validate invalid email format", async () => {
      await contactPage.fillForm({
        name: "John",
        email: "not-an-email",
        subject: "order",
        message: "Test message",
      });
      await contactPage.submitForm();
      const errors = await contactPage.getValidationErrors();
      expect(errors.some((e) => e.includes("valid email"))).toBeTruthy();
    });

    test("should validate empty subject", async () => {
      await contactPage.submitForm();
      const errors = await contactPage.getValidationErrors();
      expect(errors.some((e) => e.includes("Subject is required"))).toBeTruthy();
    });

    test("should validate empty message", async () => {
      await contactPage.submitForm();
      const errors = await contactPage.getValidationErrors();
      expect(errors.some((e) => e.includes("Message is required"))).toBeTruthy();
    });
  });

  test.describe("Form Submission", () => {
    test("should submit form with valid data", async () => {
      await contactPage.fillForm({
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "product",
        message: "I have a question about the Sony headphones. Can you tell me about the warranty?",
      });
      await contactPage.submitForm();
      await expect(contactPage.contactSuccess).toBeVisible();
    });

    test("should display success message after submission", async () => {
      await contactPage.fillForm({
        name: "Test User",
        email: "test@example.com",
        subject: "feedback",
        message: "Great website, love the product range!",
      });
      await contactPage.submitForm();
      await expect(contactPage.contactSuccess).toContainText("Message Sent");
    });

    // Skip: File attachment feature not implemented yet
    test.skip("should allow attaching files to contact form", async ({ page }) => {
      await expect(page.getByTestId("file-upload")).toBeVisible();
    });
  });
});
