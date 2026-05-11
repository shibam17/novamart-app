import { type Page, type Locator } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutSteps: Locator;
  readonly shippingForm: Locator;
  readonly continueToPayment: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutSteps = page.getByTestId("checkout-steps");
    this.shippingForm = page.getByTestId("shipping-form");
    this.continueToPayment = page.getByTestId("continue-to-payment");
  }

  async gotoShipping() {
    await this.page.goto("/checkout/shipping");
  }

  async gotoPayment() {
    await this.page.goto("/checkout/payment");
  }

  async gotoConfirm() {
    await this.page.goto("/checkout/confirm");
  }

  async fillShippingForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
  }) {
    await this.page.locator("#firstName").fill(data.firstName);
    await this.page.locator("#lastName").fill(data.lastName);
    await this.page.locator("#email").fill(data.email);
    if (data.phone) {
      await this.page.locator("#phone").fill(data.phone);
    }
    await this.page.locator("#address").fill(data.address);
    if (data.address2) {
      await this.page.locator("#address2").fill(data.address2);
    }
    await this.page.locator("#city").fill(data.city);
    await this.page.locator("#state").selectOption(data.state);
    await this.page.locator("#zip").fill(data.zip);
  }

  async submitShipping() {
    await this.continueToPayment.click();
  }

  async fillPaymentForm(data: {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
  }) {
    await this.page.locator("#cardNumber").fill(data.cardNumber);
    await this.page.locator("#cardName").fill(data.cardName);
    await this.page.locator("#expiry").fill(data.expiry);
    await this.page.locator("#cvv").fill(data.cvv);
  }

  async submitPayment() {
    await this.page.getByTestId("continue-to-confirm").click();
  }

  async placeOrder() {
    await this.page.getByTestId("place-order-btn").click();
  }

  async getValidationErrors(): Promise<string[]> {
    const errors = this.page.locator('[role="alert"]');
    const count = await errors.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await errors.nth(i).textContent();
      if (text) texts.push(text);
    }
    return texts;
  }
}
