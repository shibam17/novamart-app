import { type Page, type Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heroSection: Locator;
  readonly heroCTAPrimary: Locator;
  readonly heroCTASecondary: Locator;
  readonly trustBar: Locator;
  readonly categoriesSection: Locator;
  readonly bestSellersSection: Locator;
  readonly newArrivalsSection: Locator;
  readonly saleSection: Locator;
  readonly newsletterForm: Locator;
  readonly newsletterEmail: Locator;
  readonly newsletterSubmit: Locator;
  readonly promoSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroSection = page.getByTestId("hero-section");
    this.heroCTAPrimary = page.getByTestId("hero-cta-primary");
    this.heroCTASecondary = page.getByTestId("hero-cta-secondary");
    this.trustBar = page.getByTestId("trust-bar");
    this.categoriesSection = page.getByTestId("categories-section");
    this.bestSellersSection = page.getByTestId("bestsellers-section");
    this.newArrivalsSection = page.getByTestId("new-arrivals-section");
    this.saleSection = page.getByTestId("sale-section");
    this.newsletterForm = page.getByTestId("newsletter-form");
    this.newsletterEmail = page.locator('[aria-label="Email address for newsletter"]');
    this.newsletterSubmit = page.getByTestId("newsletter-form").locator('button[type="submit"]');
    this.promoSection = page.getByTestId("promo-section");
  }

  async goto() {
    await this.page.goto("/");
  }

  async getProductCards() {
    return this.page.locator('[data-testid^="product-card-"]');
  }

  async getCategoryLinks() {
    return this.page.locator('[data-testid^="category-"]');
  }

  async clickCategory(name: string) {
    const slug = name.toLowerCase().replace(/[&\s]+/g, "-");
    await this.page.getByTestId(`category-${slug}`).click();
  }

  async subscribeNewsletter(email: string) {
    await this.newsletterEmail.fill(email);
    await this.newsletterSubmit.click();
  }
}
