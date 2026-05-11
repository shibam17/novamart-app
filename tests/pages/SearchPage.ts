import { type Page, type Locator } from "@playwright/test";

export class SearchPage {
  readonly page: Page;
  readonly searchQuery: Locator;
  readonly searchResults: Locator;
  readonly noResults: Locator;
  readonly noQuery: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchQuery = page.getByTestId("search-query");
    this.searchResults = page.getByTestId("search-results");
    this.noResults = page.getByTestId("no-results");
    this.noQuery = page.getByTestId("no-query");
  }

  async goto(query?: string) {
    const url = query ? `/search?q=${encodeURIComponent(query)}` : "/search";
    await this.page.goto(url);
  }

  async getResultCount(): Promise<number> {
    const results = this.page.locator('[data-testid^="search-result-"]');
    return results.count();
  }

  async clickResult(productId: string) {
    await this.page.getByTestId(`search-result-${productId}`).click();
  }

  async searchFromHeader(query: string) {
    const searchInput = this.page.locator('[data-testid="search-input"]');
    await searchInput.fill(query);
    await searchInput.press("Enter");
  }
}
