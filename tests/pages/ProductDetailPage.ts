import { type Page, type Locator } from "@playwright/test";

export class ProductDetailPage {
  readonly page: Page;
  readonly breadcrumb: Locator;
  readonly productGallery: Locator;
  readonly mainImage: Locator;
  readonly productInfo: Locator;
  readonly productRating: Locator;
  readonly productPrice: Locator;
  readonly sizeSelector: Locator;
  readonly colorSelector: Locator;
  readonly quantitySelector: Locator;
  readonly quantityValue: Locator;
  readonly addToCartBtn: Locator;
  readonly wishlistBtn: Locator;
  readonly trustBadges: Locator;
  readonly productTabs: Locator;
  readonly relatedProducts: Locator;
  readonly productNotFound: Locator;
  readonly productBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.breadcrumb = page.getByTestId("breadcrumb");
    this.productGallery = page.getByTestId("product-gallery");
    this.mainImage = page.getByTestId("product-main-image");
    this.productInfo = page.getByTestId("product-info");
    this.productRating = page.getByTestId("product-rating");
    this.productPrice = page.getByTestId("product-price");
    this.sizeSelector = page.getByTestId("size-selector");
    this.colorSelector = page.getByTestId("color-selector");
    this.quantitySelector = page.getByTestId("quantity-selector");
    this.quantityValue = page.getByTestId("quantity-value");
    this.addToCartBtn = page.getByTestId("add-to-cart-btn");
    this.wishlistBtn = page.getByTestId("wishlist-btn");
    this.trustBadges = page.getByTestId("trust-badges");
    this.productTabs = page.getByTestId("product-tabs");
    this.relatedProducts = page.getByTestId("related-products");
    this.productNotFound = page.getByTestId("product-not-found");
    this.productBadge = page.getByTestId("product-badge");
  }

  async goto(productId: string) {
    await this.page.goto(`/products/${productId}`);
  }

  async selectSize(size: string) {
    const slug = size.replace(/\s+/g, "-").toLowerCase();
    await this.page.getByTestId(`size-${slug}`).click();
  }

  async selectColor(colorName: string) {
    const slug = colorName.replace(/\s+/g, "-").toLowerCase();
    await this.page.getByTestId(`color-${slug}`).click();
  }

  async increaseQuantity() {
    await this.page.locator('[aria-label="Increase quantity"]').click();
  }

  async decreaseQuantity() {
    await this.page.locator('[aria-label="Decrease quantity"]').click();
  }

  async getQuantity(): Promise<number> {
    const text = await this.quantityValue.textContent();
    return parseInt(text?.trim() || "1");
  }

  async addToCart() {
    await this.addToCartBtn.click();
  }

  async toggleWishlist() {
    await this.wishlistBtn.click();
  }

  async switchTab(tab: "description" | "specs" | "reviews") {
    await this.page.getByTestId(`tab-${tab}`).click();
  }

  async clickThumbnail(index: number) {
    await this.page.getByTestId(`thumbnail-${index}`).click();
  }

  async getPrice(): Promise<string> {
    const text = await this.productPrice.locator(".font-bold").first().textContent();
    return text?.trim() || "";
  }
}
