import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe("Homepage", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should display hero section with CTAs", async () => {
    await expect(homePage.heroSection).toBeVisible();
    await expect(homePage.heroCTAPrimary).toBeVisible();
    await expect(homePage.heroCTASecondary).toBeVisible();
  });

  test("should display trust bar with social proof", async () => {
    await expect(homePage.trustBar).toBeVisible();
  });

  test("should display product categories section", async ({ page }) => {
    await expect(homePage.categoriesSection).toBeVisible();
    const categoryLinks = await homePage.getCategoryLinks();
    await expect(categoryLinks).toHaveCount(6);
  });

  test("should display best sellers section with products", async ({ page }) => {
    await expect(homePage.bestSellersSection).toBeVisible();
    const cards = homePage.bestSellersSection.locator('[data-testid^="product-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should display new arrivals section", async () => {
    await expect(homePage.newArrivalsSection).toBeVisible();
  });

  test("should display sale section", async () => {
    await expect(homePage.saleSection).toBeVisible();
  });

  test("should display newsletter signup form", async () => {
    await expect(homePage.newsletterForm).toBeVisible();
    await expect(homePage.newsletterEmail).toBeVisible();
    await expect(homePage.newsletterSubmit).toBeVisible();
  });

  test("should navigate to products page via hero CTA", async ({ page }) => {
    await homePage.heroCTAPrimary.click();
    await expect(page).toHaveURL(/\/products/);
  });

  test("should navigate to category page when clicking a category", async ({ page }) => {
    await homePage.clickCategory("Electronics");
    await expect(page).toHaveURL(/\/products\?category=Electronics/);
  });

  test("should have newsletter form with email input and submit button", async () => {
    await expect(homePage.newsletterEmail).toBeVisible();
    await expect(homePage.newsletterSubmit).toBeVisible();
    await expect(homePage.newsletterEmail).toHaveAttribute("type", "email");
  });

  test("should navigate to product detail when clicking a product card", async ({ page }) => {
    const firstProduct = page.locator('[data-testid^="product-card-"]').first();
    await firstProduct.click();
    await expect(page).toHaveURL(/\/products\/prod-/);
  });

  test("should display promo section", async () => {
    await expect(homePage.promoSection).toBeVisible();
  });

  // REGRESSION: Hero banner text was updated but test expects old copy
  test("should display correct hero heading text", async ({ page }) => {
    const heading = page.locator('[data-testid="hero-section"] h1');
    await expect(heading).toContainText("Summer Sale");
  });

  // Skip: Personalization engine not deployed to staging yet
  test.skip("should show personalized recommendations for logged-in user", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("novamart-user", JSON.stringify({ email: "demo@novamart.com", name: "Demo User" }));
    });
    await page.reload();
    await expect(page.getByTestId("personalized-section")).toBeVisible();
  });

  // Skip: A/B test variant B not active in this environment
  test.skip("should display promotional countdown timer", async ({ page }) => {
    await expect(page.getByTestId("countdown-timer")).toBeVisible();
  });
});
