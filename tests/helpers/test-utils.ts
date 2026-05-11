import { type Page } from "@playwright/test";

export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || "demo@novamart.com",
  password: process.env.TEST_USER_PASSWORD || "demo123",
  name: "Demo User",
};

export const SHIPPING_DATA = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  phone: "555-123-4567",
  address: "123 Main Street",
  address2: "Apt 4B",
  city: "San Francisco",
  state: "CA",
  zip: "94105",
};

export const PAYMENT_DATA = {
  cardNumber: "4111111111111111",
  cardName: "John Smith",
  expiry: "12/28",
  cvv: "123",
};

export async function loginUser(page: Page) {
  await page.goto("/auth/login");
  await page.locator("#email").fill(TEST_USER.email);
  await page.locator("#password").fill(TEST_USER.password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/account");
}

export async function addProductToCart(page: Page, productId = "prod-001") {
  await page.goto(`/products/${productId}`);

  const sizeSelector = page.getByTestId("size-selector");
  if (await sizeSelector.isVisible()) {
    const firstSize = sizeSelector.locator("button").first();
    await firstSize.click();
  }

  const colorSelector = page.getByTestId("color-selector");
  if (await colorSelector.isVisible()) {
    const firstColor = colorSelector.locator("button").first();
    await firstColor.click();
  }

  await page.getByTestId("add-to-cart-btn").click();
  await page.waitForTimeout(500);
}

export async function clearCart(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem("novamart-cart");
    window.dispatchEvent(new Event("cart-updated"));
  });
}

export async function clearAuth(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem("novamart-user");
    window.dispatchEvent(new Event("auth-changed"));
  });
}

export async function setupAuthenticatedUser(page: Page) {
  await page.evaluate((user) => {
    localStorage.setItem("novamart-user", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-changed"));
  }, { email: TEST_USER.email, name: TEST_USER.name });
}

export async function getLocalStorageItem(page: Page, key: string) {
  return page.evaluate((k) => localStorage.getItem(k), key);
}
