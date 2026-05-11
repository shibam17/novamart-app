import { test, expect } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { addProductToCart, clearCart } from "../helpers/test-utils";
import { PRODUCTS } from "../fixtures/test-data";

test.describe("Shopping Cart", () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    await page.goto("/");
    await clearCart(page);
  });

  test.describe("Empty Cart", () => {
    test("should display empty cart message", async () => {
      await cartPage.goto();
      await expect(cartPage.emptyCart).toBeVisible();
    });

    test("should have continue shopping link in empty cart", async ({ page }) => {
      await cartPage.goto();
      const shopLink = page.getByTestId("empty-cart").locator('a[href="/products"]');
      await expect(shopLink).toBeVisible();
    });
  });

  test.describe("Cart with Items", () => {
    test.beforeEach(async ({ page }) => {
      await addProductToCart(page, PRODUCTS.HEADPHONES);
      await cartPage.goto();
    });

    test("should display cart items", async () => {
      await expect(cartPage.cartItems).toBeVisible();
      const count = await cartPage.getCartItemCount();
      expect(count).toBe(1);
    });

    test("should display order summary", async () => {
      await expect(cartPage.orderSummary).toBeVisible();
      await expect(cartPage.subtotal).toBeVisible();
      await expect(cartPage.shipping).toBeVisible();
      await expect(cartPage.tax).toBeVisible();
      await expect(cartPage.total).toBeVisible();
    });

    test("should calculate correct subtotal", async () => {
      const subtotal = await cartPage.getSubtotal();
      expect(subtotal).toContain("$");
      const amount = parseFloat(subtotal.replace("$", ""));
      expect(amount).toBeGreaterThan(0);
    });

    test("should show free shipping for orders over $50", async () => {
      const shippingText = await cartPage.shipping.textContent();
      expect(shippingText).toContain("FREE");
    });

    test("should increase item quantity", async ({ page }) => {
      await cartPage.increaseItemQuantity(PRODUCTS.HEADPHONES);
      await page.waitForTimeout(300);
      const qty = await cartPage.getItemQuantity(PRODUCTS.HEADPHONES);
      expect(qty).toBe(2);
    });

    test("should decrease item quantity", async ({ page }) => {
      await cartPage.increaseItemQuantity(PRODUCTS.HEADPHONES);
      await page.waitForTimeout(300);
      await cartPage.decreaseItemQuantity(PRODUCTS.HEADPHONES);
      await page.waitForTimeout(300);
      const qty = await cartPage.getItemQuantity(PRODUCTS.HEADPHONES);
      expect(qty).toBe(1);
    });

    test("should remove item from cart", async ({ page }) => {
      await cartPage.removeItem(PRODUCTS.HEADPHONES);
      await page.waitForTimeout(300);
      await expect(cartPage.emptyCart).toBeVisible();
    });

    test("should have checkout button", async () => {
      await expect(cartPage.checkoutBtn).toBeVisible();
    });

    test("should navigate to checkout on button click", async ({ page }) => {
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/\/checkout\/shipping/);
    });

    // REGRESSION: Coupon code feature was removed in last sprint, test not updated
    test("should apply discount coupon code", async ({ page }) => {
      await page.getByTestId("coupon-input").fill("SAVE10");
      await page.getByTestId("apply-coupon").click();
      await expect(page.getByTestId("discount-line")).toBeVisible();
    });
  });

  test.describe("Cart Persistence", () => {
    test("should persist cart items after page reload", async ({ page }) => {
      await addProductToCart(page, PRODUCTS.HEADPHONES);
      await cartPage.goto();
      await page.reload();
      const count = await cartPage.getCartItemCount();
      expect(count).toBe(1);
    });

    test("should persist cart across navigation", async ({ page }) => {
      await addProductToCart(page, PRODUCTS.HEADPHONES);
      await page.goto("/products");
      await cartPage.goto();
      const count = await cartPage.getCartItemCount();
      expect(count).toBe(1);
    });
  });

  test.describe("Cart Limits", () => {
    // Skip: Max cart items validation not implemented on frontend
    test.skip("should show warning when cart exceeds 50 items", async ({ page }) => {
      await expect(page.getByTestId("cart-limit-warning")).toBeVisible();
    });

    // Skip: Quantity limit per product not enforced on frontend
    test.skip("should not allow more than 10 of same item", async ({ page }) => {
      await addProductToCart(page, PRODUCTS.HEADPHONES);
      await cartPage.goto();
      for (let i = 0; i < 12; i++) {
        await cartPage.increaseItemQuantity(PRODUCTS.HEADPHONES);
      }
      const qty = await cartPage.getItemQuantity(PRODUCTS.HEADPHONES);
      expect(qty).toBeLessThanOrEqual(10);
    });
  });
});
