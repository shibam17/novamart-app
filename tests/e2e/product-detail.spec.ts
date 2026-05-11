import { test, expect } from "@playwright/test";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { PRODUCTS } from "../fixtures/test-data";

test.describe("Product Detail Page", () => {
  let detailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    detailPage = new ProductDetailPage(page);
  });

  test.describe("Page Layout", () => {
    test("should display product info for valid product", async () => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await expect(detailPage.productInfo).toBeVisible();
      await expect(detailPage.productGallery).toBeVisible();
      await expect(detailPage.productPrice).toBeVisible();
      await expect(detailPage.productRating).toBeVisible();
    });

    test("should display breadcrumb navigation", async () => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await expect(detailPage.breadcrumb).toBeVisible();
      await expect(detailPage.breadcrumb).toContainText("Home");
      await expect(detailPage.breadcrumb).toContainText("Products");
    });

    test("should display 404 for non-existent product", async () => {
      await detailPage.goto("prod-nonexistent");
      await expect(detailPage.productNotFound).toBeVisible();
    });

    test("should display trust badges", async () => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await expect(detailPage.trustBadges).toBeVisible();
    });

    test("should display related products", async () => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await expect(detailPage.relatedProducts).toBeVisible();
    });
  });

  test.describe("Image Gallery", () => {
    test("should display main product image", async () => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await expect(detailPage.mainImage).toBeVisible();
    });

    test("should switch images on thumbnail click", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      const initialSrc = await detailPage.mainImage.getAttribute("src");
      await detailPage.clickThumbnail(1);
      const newSrc = await detailPage.mainImage.getAttribute("src");
      expect(newSrc).not.toEqual(initialSrc);
    });

    // Skip: Image zoom feature not yet implemented
    test.skip("should zoom image on hover", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await detailPage.mainImage.hover();
      await expect(page.getByTestId("zoom-overlay")).toBeVisible();
    });
  });

  test.describe("Size and Color Selection", () => {
    test("should display size selector for products with multiple sizes", async () => {
      await detailPage.goto(PRODUCTS.RUNNING_SHOES);
      await expect(detailPage.sizeSelector).toBeVisible();
    });

    test("should highlight selected size", async ({ page }) => {
      await detailPage.goto(PRODUCTS.RUNNING_SHOES);
      const sizeBtn = page.getByTestId("size-us-9");
      await sizeBtn.click();
      await expect(sizeBtn).toHaveAttribute("aria-pressed", "true");
    });

    test("should display color selector for products with colors", async () => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await expect(detailPage.colorSelector).toBeVisible();
    });

    test("should highlight selected color", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      const colorBtns = page.getByTestId("color-selector").locator("button");
      const firstColor = colorBtns.first();
      await firstColor.click();
      await expect(firstColor).toHaveAttribute("aria-pressed", "true");
    });

    // Skip: Size guide modal not implemented
    test.skip("should open size guide modal", async ({ page }) => {
      await detailPage.goto(PRODUCTS.RUNNING_SHOES);
      await page.locator("text=Size Guide").click();
      await expect(page.getByTestId("size-guide-modal")).toBeVisible();
    });
  });

  test.describe("Quantity Selector", () => {
    test("should start at quantity 1", async () => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      const qty = await detailPage.getQuantity();
      expect(qty).toBe(1);
    });

    test("should increase quantity", async () => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await detailPage.increaseQuantity();
      const qty = await detailPage.getQuantity();
      expect(qty).toBe(2);
    });

    test("should decrease quantity", async () => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await detailPage.increaseQuantity();
      await detailPage.decreaseQuantity();
      const qty = await detailPage.getQuantity();
      expect(qty).toBe(1);
    });

    test("should not decrease below 1", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      const decreaseBtn = page.locator('[aria-label="Decrease quantity"]');
      await expect(decreaseBtn).toBeDisabled();
    });
  });

  test.describe("Add to Cart", () => {
    test("should add product to cart", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      const colorBtns = page.getByTestId("color-selector").locator("button");
      await colorBtns.first().click();
      await detailPage.addToCart();
      await expect(detailPage.addToCartBtn).toContainText("Added to Cart");
    });

    test("should update cart badge in header after adding", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      const colorBtns = page.getByTestId("color-selector").locator("button");
      await colorBtns.first().click();
      await detailPage.addToCart();
      const cartBadge = page.getByTestId("cart-count");
      await expect(cartBadge).toBeVisible();
    });

    // REGRESSION: "Add to Cart" button text changed after i18n update
    test("should show correct add to cart button text with price", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await expect(detailPage.addToCartBtn).toContainText("Add to Bag");
    });
  });

  test.describe("Wishlist", () => {
    test("should toggle wishlist state", async () => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await detailPage.toggleWishlist();
      await expect(detailPage.wishlistBtn).toHaveAttribute(
        "aria-label",
        "Remove from wishlist"
      );
    });

    // Skip: Wishlist persistence requires auth - not implemented
    test.skip("should persist wishlist items across sessions", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await detailPage.toggleWishlist();
      await page.reload();
      await expect(detailPage.wishlistBtn).toHaveAttribute("aria-label", "Remove from wishlist");
    });
  });

  test.describe("Product Tabs", () => {
    test("should switch to specifications tab", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await detailPage.switchTab("specs");
      const specsContent = page.getByTestId("tab-content-specs");
      await expect(specsContent).toBeVisible();
    });

    test("should switch to reviews tab", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await detailPage.switchTab("reviews");
      const reviewsContent = page.getByTestId("tab-content-reviews");
      await expect(reviewsContent).toBeVisible();
    });

    test("should display reviews list", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      await detailPage.switchTab("reviews");
      const reviewList = page.getByTestId("review-list");
      await expect(reviewList).toBeVisible();
      const reviews = page.locator('[data-testid^="review-"]');
      expect(await reviews.count()).toBeGreaterThan(0);
    });
  });

  test.describe("Stock Status", () => {
    // REGRESSION: Low stock warning threshold changed from 10 to 5 on backend
    test("should show low stock warning for limited items", async ({ page }) => {
      await detailPage.goto(PRODUCTS.HEADPHONES);
      const stockWarning = page.locator("text=Only 3 left");
      await expect(stockWarning).toBeVisible();
    });
  });
});
