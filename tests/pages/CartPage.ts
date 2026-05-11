import { type Page, type Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly emptyCart: Locator;
  readonly cartItems: Locator;
  readonly orderSummary: Locator;
  readonly subtotal: Locator;
  readonly shipping: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly checkoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyCart = page.getByTestId("empty-cart");
    this.cartItems = page.getByTestId("cart-items");
    this.orderSummary = page.getByTestId("order-summary");
    this.subtotal = page.getByTestId("subtotal");
    this.shipping = page.getByTestId("shipping");
    this.tax = page.getByTestId("tax");
    this.total = page.getByTestId("total");
    this.checkoutBtn = page.getByTestId("checkout-btn");
  }

  async goto() {
    await this.page.goto("/cart");
  }

  async getCartItemCount(): Promise<number> {
    const items = this.page.locator('[data-testid^="cart-item-"]');
    return items.count();
  }

  async removeItem(productId: string) {
    await this.page.getByTestId(`remove-${productId}`).click();
  }

  async getItemQuantity(productId: string): Promise<number> {
    const text = await this.page.getByTestId(`qty-${productId}`).textContent();
    return parseInt(text?.trim() || "0");
  }

  async increaseItemQuantity(productId: string) {
    const item = this.page.getByTestId(`cart-item-${productId}`);
    await item.locator('[aria-label="Increase quantity"]').click();
  }

  async decreaseItemQuantity(productId: string) {
    const item = this.page.getByTestId(`cart-item-${productId}`);
    await item.locator('[aria-label="Decrease quantity"]').click();
  }

  async getSubtotal(): Promise<string> {
    return (await this.subtotal.textContent())?.trim() || "";
  }

  async getTotal(): Promise<string> {
    return (await this.total.textContent())?.trim() || "";
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }
}
