import { test, expect } from "@playwright/test";

test.describe("Accessibility Tests", () => {
  test.describe("Keyboard Navigation", () => {
    test("should tab through homepage interactive elements", async ({ page }) => {
      await page.goto("/");
      await page.keyboard.press("Tab");
      const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
      expect(firstFocused).toBeTruthy();
    });

    test("should tab through login form fields", async ({ page }) => {
      await page.goto("/auth/login");
      await page.locator("#email").focus();
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => document.activeElement?.id);
      expect(focused).toBe("password");
    });

    test("should submit login form with Enter key", async ({ page }) => {
      await page.goto("/auth/login");
      await page.locator("#email").fill("demo@novamart.com");
      await page.locator("#password").fill("demo123");
      await page.locator("#password").press("Enter");
      await expect(page).toHaveURL(/\/account/);
    });

    // Skip: Skip-to-content link not implemented
    test.skip("should have skip-to-content link", async ({ page }) => {
      await page.goto("/");
      await page.keyboard.press("Tab");
      const skipLink = page.locator('[data-testid="skip-to-content"]');
      await expect(skipLink).toBeFocused();
    });
  });

  test.describe("ARIA Labels and Roles", () => {
    test("should have aria-label on search input", async ({ page }) => {
      await page.goto("/");
      const searchInput = page.locator('[aria-label="Search products"]');
      await expect(searchInput).toBeVisible();
    });

    test("should have aria-label on sort select", async ({ page }) => {
      await page.goto("/products");
      const sortSelect = page.getByTestId("sort-select");
      const ariaLabel = await sortSelect.getAttribute("aria-label");
      expect(ariaLabel).toBe("Sort products");
    });

    test("should have aria-invalid on invalid form fields", async ({ page }) => {
      await page.goto("/auth/login");
      await page.getByTestId("login-submit").click();
      const emailField = page.locator("#email");
      const ariaInvalid = await emailField.getAttribute("aria-invalid");
      expect(ariaInvalid).toBe("true");
    });

    test("should have role=alert on error messages", async ({ page }) => {
      await page.goto("/auth/login");
      await page.getByTestId("login-submit").click();
      const alerts = page.locator('[role="alert"]');
      const count = await alerts.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should have breadcrumb navigation with aria-label", async ({ page }) => {
      await page.goto("/products/prod-001");
      const breadcrumb = page.getByTestId("breadcrumb");
      const ariaLabel = await breadcrumb.getAttribute("aria-label");
      expect(ariaLabel).toBe("Breadcrumb");
    });
  });

  test.describe("Image Alt Text", () => {
    test("should have alt text on product images", async ({ page }) => {
      await page.goto("/products");
      const images = page.locator('[data-testid="product-grid"] img');
      const count = await images.count();
      for (let i = 0; i < Math.min(count, 5); i++) {
        const alt = await images.nth(i).getAttribute("alt");
        expect(alt).toBeTruthy();
        expect(alt!.length).toBeGreaterThan(0);
      }
    });

    test("should have alt text on product detail main image", async ({ page }) => {
      await page.goto("/products/prod-001");
      const mainImage = page.getByTestId("product-main-image");
      const alt = await mainImage.getAttribute("alt");
      expect(alt).toBeTruthy();
    });
  });

  test.describe("Form Labels", () => {
    test("should have labels for all login form inputs", async ({ page }) => {
      await page.goto("/auth/login");
      const emailLabel = page.locator('label[for="email"]');
      const passwordLabel = page.locator('label[for="password"]');
      await expect(emailLabel).toBeVisible();
      await expect(passwordLabel).toBeVisible();
    });

    test("should have labels for shipping form inputs", async ({ page }) => {
      await page.goto("/checkout/shipping");
      const requiredLabels = ["firstName", "lastName", "email", "address", "city", "state", "zip"];
      for (const field of requiredLabels) {
        const label = page.locator(`label[for="${field}"]`);
        await expect(label).toBeVisible();
      }
    });

    test("should have labels for contact form inputs", async ({ page }) => {
      await page.goto("/contact");
      const labels = ["name", "email", "subject", "message"];
      for (const field of labels) {
        const label = page.locator(`label[for="${field}"]`);
        await expect(label).toBeVisible();
      }
    });
  });

  test.describe("Color and Contrast", () => {
    test("should have visible focus indicators on buttons", async ({ page }) => {
      await page.goto("/auth/login");
      await page.locator("#email").focus();
      const outline = await page.locator("#email").evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outlineStyle || styles.boxShadow;
      });
      expect(outline).toBeTruthy();
    });

    // REGRESSION: Error text color changed to gray-500 in last theme update - contrast fail
    test("should have sufficient contrast ratio on error messages", async ({ page }) => {
      await page.goto("/auth/login");
      await page.getByTestId("login-submit").click();
      const errorEl = page.locator('[role="alert"]').first();
      const color = await errorEl.evaluate((el) => window.getComputedStyle(el).color);
      // Should be red (high contrast) not gray
      expect(color).toContain("239");
    });
  });

  test.describe("Semantic HTML", () => {
    test("should have exactly one h1 per page", async ({ page }) => {
      const pages = ["/", "/products", "/contact", "/auth/login"];
      for (const url of pages) {
        await page.goto(url);
        const h1Count = await page.locator("h1").count();
        expect(h1Count).toBe(1);
      }
    });

    test("should have nav element in header", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("header nav");
      const count = await nav.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test("should have footer element", async ({ page }) => {
      await page.goto("/");
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
    });
  });
});
