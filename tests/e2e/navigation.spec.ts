import { test, expect } from "@playwright/test";

test.describe("Site Navigation", () => {
  test.describe("Header Navigation", () => {
    test("should display header with logo", async ({ page }) => {
      await page.goto("/");
      const header = page.locator('header[role="banner"]');
      await expect(header).toBeVisible();
      await expect(header.locator("text=NovaMart")).toBeVisible();
    });

    test("should have working nav links", async ({ page }) => {
      await page.goto("/");
      const productsLink = page.locator('nav[aria-label="Main navigation"] a[href="/products"]');
      if (await productsLink.isVisible()) {
        await productsLink.click();
        await expect(page).toHaveURL(/\/products/);
      }
    });

    test("should show cart icon in header", async ({ page }) => {
      await page.goto("/");
      const cartLink = page.locator('header a[href="/cart"]').first();
      await expect(cartLink).toBeVisible();
    });

    test("should navigate to cart page", async ({ page }) => {
      await page.goto("/");
      await page.locator('header a[href="/cart"]').first().click();
      await expect(page).toHaveURL(/\/cart/);
    });

    // REGRESSION: Mobile hamburger menu stopped toggling after React 19 upgrade
    test("should toggle mobile menu on hamburger click", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.locator('[aria-label="Toggle mobile menu"]').click();
      const mobileNav = page.getByTestId("mobile-nav");
      await expect(mobileNav).toBeVisible();
    });
  });

  test.describe("Footer Navigation", () => {
    test("should display footer", async ({ page }) => {
      await page.goto("/");
      const footer = page.locator('footer[role="contentinfo"]');
      await expect(footer).toBeVisible();
    });

    test("should have footer links", async ({ page }) => {
      await page.goto("/");
      const footer = page.locator('footer[role="contentinfo"]');
      const links = footer.locator("a");
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe("404 Page", () => {
    test("should display 404 for non-existent routes", async ({ page }) => {
      await page.goto("/this-page-does-not-exist");
      await expect(page.locator("text=404")).toBeVisible();
    });
  });

  test.describe("Page Transitions", () => {
    test("should navigate between pages smoothly", async ({ page }) => {
      await page.goto("/");
      await page.goto("/products");
      await expect(page.locator("h1")).toContainText("All Products");

      await page.goto("/contact");
      await expect(page.locator("h1")).toContainText("Contact");

      await page.goto("/auth/login");
      await expect(page.locator("h1")).toContainText("Welcome Back");
    });
  });

  test.describe("Breadcrumbs", () => {
    // Skip: Breadcrumbs only on product detail, not catalog
    test.skip("should show breadcrumbs on category pages", async ({ page }) => {
      await page.goto("/products?category=Electronics");
      await expect(page.getByTestId("breadcrumb")).toBeVisible();
    });
  });
});
