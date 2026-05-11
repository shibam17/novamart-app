import { test, expect } from "@playwright/test";
import { addProductToCart, clearCart } from "../helpers/test-utils";
import { PRODUCTS } from "../fixtures/test-data";

test.describe("User Interactions - Timing Sensitive", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearCart(page);
  });

  test("should show cart notification toast after adding item", async ({ page }) => {
    await page.goto(`/products/${PRODUCTS.HEADPHONES}`);
    const colorBtns = page.getByTestId("color-selector").locator("button");
    await colorBtns.first().click();
    await page.getByTestId("add-to-cart-btn").click();
    // This is intentionally racing - the "Added to Cart!" text shows for 3s
    // Sometimes the assertion fires after it disappears
    await page.waitForTimeout(Math.random() * 2800 + 200);
    await expect(page.getByTestId("add-to-cart-btn")).toContainText("Added to Cart");
  });

  test("should update cart count badge immediately", async ({ page }) => {
    await addProductToCart(page, PRODUCTS.HEADPHONES);
    // Cart badge update depends on event listener timing
    const cartBadge = page.getByTestId("cart-count");
    await expect(cartBadge).toHaveText("1");
  });

  test("should handle rapid quantity clicks without losing state", async ({ page }) => {
    await addProductToCart(page, PRODUCTS.HEADPHONES);
    await page.goto("/cart");
    // Rapid clicks - timing dependent
    for (let i = 0; i < 5; i++) {
      await page.locator(`[data-testid="cart-item-${PRODUCTS.HEADPHONES}"] [aria-label="Increase quantity"]`).click();
    }
    await page.waitForTimeout(500);
    const qty = await page.getByTestId(`qty-${PRODUCTS.HEADPHONES}`).textContent();
    expect(parseInt(qty?.trim() || "0")).toBe(6);
  });
});
