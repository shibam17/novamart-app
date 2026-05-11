import { test, expect } from "@playwright/test";
import { addProductToCart, clearCart, SHIPPING_DATA, PAYMENT_DATA } from "../helpers/test-utils";
import { PRODUCTS } from "../fixtures/test-data";

test.describe("Smoke Tests - Critical Paths", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearCart(page);
  });

  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/NovaMart/);
    await expect(page.getByTestId("hero-section")).toBeVisible();
  });

  test("products page loads with items", async ({ page }) => {
    await page.goto("/products");
    const cards = page.locator('[data-testid^="product-card-"]');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("product detail page loads correctly", async ({ page }) => {
    await page.goto(`/products/${PRODUCTS.HEADPHONES}`);
    await expect(page.getByTestId("product-info")).toBeVisible();
    await expect(page.getByTestId("add-to-cart-btn")).toBeVisible();
  });

  test("add to cart flow works", async ({ page }) => {
    await addProductToCart(page, PRODUCTS.HEADPHONES);
    await page.goto("/cart");
    const cartItems = page.getByTestId("cart-items");
    await expect(cartItems).toBeVisible();
  });

  test("checkout shipping form loads", async ({ page }) => {
    await addProductToCart(page, PRODUCTS.HEADPHONES);
    await page.goto("/checkout/shipping");
    await expect(page.getByTestId("shipping-form")).toBeVisible();
  });

  test("login flow works with demo credentials", async ({ page }) => {
    await page.goto("/auth/login");
    await page.locator("#email").fill("demo@novamart.com");
    await page.locator("#password").fill("demo123");
    await page.getByTestId("login-submit").click();
    await expect(page).toHaveURL(/\/account/);
  });

  test("search returns results", async ({ page }) => {
    await page.goto("/search?q=Sony");
    await expect(page.getByTestId("search-results")).toBeVisible();
  });

  test("contact form loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByTestId("contact-form")).toBeVisible();
  });

  test("full purchase flow - end to end", async ({ page }) => {
    await addProductToCart(page, PRODUCTS.HEADPHONES);

    await page.goto("/cart");
    await expect(page.getByTestId("cart-items")).toBeVisible();
    await page.getByTestId("checkout-btn").click();

    await page.waitForURL(/\/checkout\/shipping/);
    await page.locator("#firstName").fill(SHIPPING_DATA.firstName);
    await page.locator("#lastName").fill(SHIPPING_DATA.lastName);
    await page.locator("#email").fill(SHIPPING_DATA.email);
    await page.locator("#address").fill(SHIPPING_DATA.address);
    await page.locator("#city").fill(SHIPPING_DATA.city);
    await page.locator("#state").selectOption(SHIPPING_DATA.state);
    await page.locator("#zip").fill(SHIPPING_DATA.zip);
    await page.getByTestId("continue-to-payment").click();

    await page.waitForURL(/\/checkout\/payment/);
    await page.locator("#cardNumber").fill(PAYMENT_DATA.cardNumber);
    await page.locator("#cardName").fill(PAYMENT_DATA.cardName);
    await page.locator("#expiry").fill(PAYMENT_DATA.expiry);
    await page.locator("#cvv").fill(PAYMENT_DATA.cvv);
    await page.getByTestId("continue-to-confirm").click();

    await page.waitForURL(/\/checkout\/confirm/);
    await page.getByTestId("place-order-btn").click();

    await expect(page.getByTestId("order-success")).toBeVisible({ timeout: 5000 });
  });
});
