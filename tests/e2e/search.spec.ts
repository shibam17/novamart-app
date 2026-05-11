import { test, expect } from "@playwright/test";
import { SearchPage } from "../pages/SearchPage";

test.describe("Search Functionality", () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
  });

  test("should display no-query state when no search term", async () => {
    await searchPage.goto();
    await expect(searchPage.noQuery).toBeVisible();
  });

  test("should display search results for valid query", async () => {
    await searchPage.goto("Sony");
    await expect(searchPage.searchResults).toBeVisible();
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test("should display query text in results", async () => {
    await searchPage.goto("headphones");
    await expect(searchPage.searchQuery).toContainText("headphones");
  });

  test("should show no-results state for non-matching query", async () => {
    await searchPage.goto("xyznonexistent123");
    await expect(searchPage.noResults).toBeVisible();
  });

  test("should navigate to product detail on result click", async ({ page }) => {
    await searchPage.goto("Sony");
    await page.locator('[data-testid^="search-result-"]').first().click();
    await expect(page).toHaveURL(/\/products\/prod-/);
  });

  test("should search from header input", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator('[aria-label="Search products"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill("Nike");
      await searchInput.press("Enter");
      await expect(page).toHaveURL(/\/search\?q=Nike/);
    }
  });

  test("should find products by brand name", async () => {
    await searchPage.goto("Apple");
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test("should find products by category keyword", async () => {
    await searchPage.goto("electronics");
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  // REGRESSION: Search autocomplete dropdown was removed during header redesign
  test("should show search suggestions as user types", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator('[aria-label="Search products"]');
    await searchInput.fill("So");
    await expect(page.getByTestId("search-suggestions")).toBeVisible();
  });

  // Skip: Search history feature deferred to v2
  test.skip("should show recent searches for returning users", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator('[aria-label="Search products"]');
    await searchInput.focus();
    await expect(page.getByTestId("recent-searches")).toBeVisible();
  });
});
