import { type Page, type Locator } from "@playwright/test";

export class ProductsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly filtersSidebar: Locator;
  readonly productGrid: Locator;
  readonly productList: Locator;
  readonly productCount: Locator;
  readonly sortSelect: Locator;
  readonly viewToggle: Locator;
  readonly clearFilters: Locator;
  readonly brandFilter: Locator;
  readonly priceFilter: Locator;
  readonly availabilityFilter: Locator;
  readonly activeFilters: Locator;
  readonly noProducts: Locator;
  readonly minPriceInput: Locator;
  readonly maxPriceInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator("h1");
    this.filtersSidebar = page.getByTestId("filters-sidebar");
    this.productGrid = page.getByTestId("product-grid");
    this.productList = page.getByTestId("product-list");
    this.productCount = page.getByTestId("product-count");
    this.sortSelect = page.getByTestId("sort-select");
    this.viewToggle = page.getByTestId("view-toggle");
    this.clearFilters = page.getByTestId("clear-filters");
    this.brandFilter = page.getByTestId("brand-filter");
    this.priceFilter = page.getByTestId("price-filter");
    this.availabilityFilter = page.getByTestId("availability-filter");
    this.activeFilters = page.getByTestId("active-filters");
    this.noProducts = page.getByTestId("no-products");
    this.minPriceInput = page.locator('[aria-label="Minimum price"]');
    this.maxPriceInput = page.locator('[aria-label="Maximum price"]');
  }

  async goto(category?: string) {
    const url = category
      ? `/products?category=${encodeURIComponent(category)}`
      : "/products";
    await this.page.goto(url);
  }

  async getProductCards() {
    return this.page.locator('[data-testid^="product-card-"]');
  }

  async sortBy(option: string) {
    await this.sortSelect.selectOption(option);
  }

  async filterByBrand(brand: string) {
    await this.brandFilter.getByLabel(brand).check();
  }

  async setPriceRange(min: number, max: number) {
    await this.minPriceInput.fill(String(min));
    await this.maxPriceInput.fill(String(max));
  }

  async toggleInStockOnly() {
    await this.availabilityFilter.getByLabel("In Stock Only").check();
  }

  async switchToListView() {
    await this.page.locator('[aria-label="List view"]').click();
  }

  async switchToGridView() {
    await this.page.locator('[aria-label="Grid view"]').click();
  }

  async getProductCount(): Promise<number> {
    const text = await this.productCount.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async clickProduct(productId: string) {
    await this.page.getByTestId(`product-card-${productId}`).click();
  }

  async filterByCategory(category: string) {
    const slug = category.toLowerCase().replace(/[&\s]+/g, "-");
    await this.page.getByTestId(`filter-${slug}`).click();
  }
}
