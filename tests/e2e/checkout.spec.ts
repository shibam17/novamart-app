import { test, expect } from "@playwright/test";
import { CheckoutPage } from "../pages/CheckoutPage";
import { addProductToCart, clearCart, SHIPPING_DATA, PAYMENT_DATA } from "../helpers/test-utils";
import { PRODUCTS } from "../fixtures/test-data";

test.describe("Checkout Flow", () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);
    await page.goto("/");
    await clearCart(page);
    await addProductToCart(page, PRODUCTS.HEADPHONES);
  });

  test.describe("Shipping Step", () => {
    test("should display checkout progress steps", async () => {
      await checkoutPage.gotoShipping();
      await expect(checkoutPage.checkoutSteps).toBeVisible();
    });

    test("should display shipping form", async () => {
      await checkoutPage.gotoShipping();
      await expect(checkoutPage.shippingForm).toBeVisible();
    });

    test("should validate required fields", async ({ page }) => {
      await checkoutPage.gotoShipping();
      await checkoutPage.submitShipping();
      const errors = await checkoutPage.getValidationErrors();
      expect(errors.length).toBeGreaterThan(0);
    });

    test("should validate email format", async ({ page }) => {
      await checkoutPage.gotoShipping();
      await checkoutPage.fillShippingForm({
        ...SHIPPING_DATA,
        email: "invalid-email",
      });
      await checkoutPage.submitShipping();
      const errors = await checkoutPage.getValidationErrors();
      expect(errors.some((e) => e.includes("valid email"))).toBeTruthy();
    });

    test("should validate ZIP code format", async ({ page }) => {
      await checkoutPage.gotoShipping();
      await checkoutPage.fillShippingForm({
        ...SHIPPING_DATA,
        zip: "abc",
      });
      await checkoutPage.submitShipping();
      const errors = await checkoutPage.getValidationErrors();
      expect(errors.some((e) => e.includes("valid ZIP"))).toBeTruthy();
    });

    test("should proceed to payment with valid data", async ({ page }) => {
      await checkoutPage.gotoShipping();
      await checkoutPage.fillShippingForm(SHIPPING_DATA);
      await checkoutPage.submitShipping();
      await expect(page).toHaveURL(/\/checkout\/payment/);
    });

    // REGRESSION: International address format validation changed
    test("should accept international postal codes", async ({ page }) => {
      await checkoutPage.gotoShipping();
      await checkoutPage.fillShippingForm({
        ...SHIPPING_DATA,
        zip: "SW1A 1AA",
      });
      await checkoutPage.submitShipping();
      await expect(page).toHaveURL(/\/checkout\/payment/);
    });
  });

  test.describe("Payment Step", () => {
    test.beforeEach(async ({ page }) => {
      await checkoutPage.gotoShipping();
      await checkoutPage.fillShippingForm(SHIPPING_DATA);
      await checkoutPage.submitShipping();
      await page.waitForURL(/\/checkout\/payment/);
    });

    test("should display payment form", async ({ page }) => {
      await expect(page.locator("#cardNumber")).toBeVisible();
      await expect(page.locator("#cardName")).toBeVisible();
      await expect(page.locator("#expiry")).toBeVisible();
      await expect(page.locator("#cvv")).toBeVisible();
    });

    test("should proceed to confirmation with valid payment", async ({ page }) => {
      await checkoutPage.fillPaymentForm(PAYMENT_DATA);
      await checkoutPage.submitPayment();
      await expect(page).toHaveURL(/\/checkout\/confirm/);
    });

    test("should display payment method options", async ({ page }) => {
      await expect(page.getByTestId("payment-methods")).toBeVisible();
      await expect(page.getByTestId("method-card")).toBeVisible();
      await expect(page.getByTestId("method-paypal")).toBeVisible();
    });

    test("should switch to PayPal payment method", async ({ page }) => {
      await page.getByTestId("method-paypal").click();
      await expect(page.getByTestId("paypal-section")).toBeVisible();
    });
  });

  test.describe("Order Confirmation", () => {
    test("should complete full checkout flow", async ({ page }) => {
      await checkoutPage.gotoShipping();
      await checkoutPage.fillShippingForm(SHIPPING_DATA);
      await checkoutPage.submitShipping();
      await page.waitForURL(/\/checkout\/payment/);

      await checkoutPage.fillPaymentForm(PAYMENT_DATA);
      await checkoutPage.submitPayment();
      await page.waitForURL(/\/checkout\/confirm/);

      await checkoutPage.placeOrder();

      await expect(page.getByTestId("order-success")).toBeVisible({ timeout: 5000 });
    });

    test("should generate a unique order ID", async ({ page }) => {
      await checkoutPage.gotoShipping();
      await checkoutPage.fillShippingForm(SHIPPING_DATA);
      await checkoutPage.submitShipping();
      await page.waitForURL(/\/checkout\/payment/);

      await checkoutPage.fillPaymentForm(PAYMENT_DATA);
      await checkoutPage.submitPayment();
      await page.waitForURL(/\/checkout\/confirm/);

      await checkoutPage.placeOrder();
      const orderId = page.getByTestId("order-id");
      await expect(orderId).toBeVisible();
      const text = await orderId.textContent();
      expect(text).toMatch(/^NVM-/);
    });

    // Skip: Order confirmation email not testable in isolated environment
    test.skip("should send confirmation email after order", async ({ page }) => {
      // Would need email service mock
    });
  });
});
