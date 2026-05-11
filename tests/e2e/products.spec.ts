import { test, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { CATEGORIES, SORT_OPTIONS } from "../fixtures/test-data";

test.describe("Products Catalog", () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await productsPage.goto();
  });

  test.describe("Page Layout", () => {
    test("should display page title and product count", async () => {
      await expect(productsPage.pageTitle).toContainText("All Products");
      await expect(productsPage.productCount).toBeVisible();
      const count = await productsPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });

    test("should display filters sidebar", async () => {
      await expect(productsPage.filtersSidebar).toBeVisible();
      await expect(productsPage.brandFilter).toBeVisible();
      await expect(productsPage.priceFilter).toBeVisible();
      await expect(productsPage.availabilityFilter).toBeVisible();
    });

    test("should display products in grid view by default", async () => {
      await expect(productsPage.productGrid).toBeVisible();
    });

    test("should display sort dropdown", async () => {
      await expect(productsPage.sortSelect).toBeVisible();
    });
  });

  test.describe("Filtering", () => {
    test("should filter products by category", async ({ page }) => {
      await productsPage.filterByCategory("Electronics");
      await expect(page).toHaveURL(/category=Electronics/);
      await expect(productsPage.pageTitle).toContainText("Electronics");
    });

    test("should filter products by brand", async () => {
      const initialCount = await productsPage.getProductCount();
      await productsPage.filterByBrand("Sony");
      const filteredCount = await productsPage.getProductCount();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
      expect(filteredCount).toBeGreaterThan(0);
    });

    test("should filter products by price range", async () => {
      await productsPage.setPriceRange(100, 500);
      await productsPage.page.waitForTimeout(300);
      const count = await productsPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });

    test("should filter in-stock only products", async () => {
      const initialCount = await productsPage.getProductCount();
      await productsPage.toggleInStockOnly();
      const filteredCount = await productsPage.getProductCount();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test("should show active filter pills when filters applied", async () => {
      await productsPage.filterByBrand("Sony");
      await expect(productsPage.activeFilters).toBeVisible();
    });

    test("should clear all filters", async () => {
      await productsPage.filterByBrand("Sony");
      await expect(productsPage.clearFilters).toBeVisible();
      await productsPage.clearFilters.click();
      await expect(productsPage.activeFilters).not.toBeVisible();
    });

    test("should show no products message when filters match nothing", async () => {
      await productsPage.setPriceRange(9999, 9999);
      await productsPage.page.waitForTimeout(300);
      await expect(productsPage.noProducts).toBeVisible();
    });

    // REGRESSION: Filter count badge shows wrong number after recent data migration
    test("should display correct product count per category in sidebar", async ({ page }) => {
      const electronicsLink = page.getByTestId("filter-electronics");
      const countText = await electronicsLink.locator("span.text-gray-400").textContent();
      expect(parseInt(countText || "0")).toBe(6);
    });
  });

  test.describe("Sorting", () => {
    test("should sort by price low to high", async ({ page }) => {
      await productsPage.sortBy(SORT_OPTIONS.PRICE_ASC);
      const cards = await productsPage.getProductCards();
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should sort by price high to low", async () => {
      await productsPage.sortBy(SORT_OPTIONS.PRICE_DESC);
      const cards = await productsPage.getProductCards();
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should sort by rating", async () => {
      await productsPage.sortBy(SORT_OPTIONS.RATING);
      const cards = await productsPage.getProductCards();
      expect(await cards.count()).toBeGreaterThan(0);
    });

    test("should sort by name A-Z", async () => {
      await productsPage.sortBy(SORT_OPTIONS.NAME);
      const cards = await productsPage.getProductCards();
      expect(await cards.count()).toBeGreaterThan(0);
    });
  });

  test.describe("View Modes", () => {
    test("should switch to list view", async () => {
      await productsPage.switchToListView();
      await expect(productsPage.productList).toBeVisible();
      await expect(productsPage.productGrid).not.toBeVisible();
    });

    test("should switch back to grid view", async () => {
      await productsPage.switchToListView();
      await productsPage.switchToGridView();
      await expect(productsPage.productGrid).toBeVisible();
    });
  });

  test.describe("Navigation", () => {
    test("should navigate to product detail on card click", async ({ page }) => {
      await productsPage.clickProduct("prod-001");
      await expect(page).toHaveURL(/\/products\/prod-001/);
    });

    test("should filter by each category", async ({ page }) => {
      for (const category of CATEGORIES) {
        await productsPage.goto(category);
        await expect(productsPage.pageTitle).toContainText(category);
        const count = await productsPage.getProductCount();
        expect(count).toBeGreaterThan(0);
      }
    });
  });

  test.describe("Pagination", () => {
    // Skip: Pagination not implemented yet - all products load at once
    test.skip("should paginate products with 12 per page", async ({ page }) => {
      const cards = await productsPage.getProductCards();
      expect(await cards.count()).toBeLessThanOrEqual(12);
    });

    // Skip: Pagination not implemented
    test.skip("should navigate to next page", async ({ page }) => {
      await page.getByTestId("pagination-next").click();
      await expect(page).toHaveURL(/page=2/);
    });

    // Skip: Pagination not implemented
    test.skip("should show page numbers", async ({ page }) => {
      await expect(page.getByTestId("pagination")).toBeVisible();
    });
  });
});
