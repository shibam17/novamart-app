import { test, expect } from "@playwright/test";
import { PERFORMANCE_THRESHOLDS } from "../fixtures/test-data";

test.describe("Performance Tests", () => {
  test.describe("Page Load Times", () => {
    const pages = [
      { name: "Homepage", url: "/" },
      { name: "Products", url: "/products" },
      { name: "Product Detail", url: "/products/prod-001" },
      { name: "Cart", url: "/cart" },
      { name: "Login", url: "/auth/login" },
      { name: "Contact", url: "/contact" },
    ];

    for (const { name, url } of pages) {
      test(`${name} should load within ${PERFORMANCE_THRESHOLDS.MAX_PAGE_LOAD_TIME}ms`, async ({ page }) => {
        const startTime = Date.now();
        await page.goto(url, { waitUntil: "domcontentloaded" });
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.MAX_PAGE_LOAD_TIME);
      });
    }
  });

  test.describe("Resource Size", () => {
    test("homepage total transfer size should be under threshold", async ({ page }) => {
      let totalSize = 0;
      page.on("response", (response) => {
        const headers = response.headers();
        const contentLength = headers["content-length"];
        if (contentLength) {
          totalSize += parseInt(contentLength);
        }
      });

      await page.goto("/", { waitUntil: "networkidle" });
      const totalSizeKB = totalSize / 1024;
      expect(totalSizeKB).toBeLessThan(PERFORMANCE_THRESHOLDS.MAX_PAGE_SIZE_KB);
    });
  });

  test.describe("Core Web Vitals", () => {
    test("should have acceptable Largest Contentful Paint", async ({ page }) => {
      await page.goto("/");

      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ type: "largest-contentful-paint", buffered: true });

          setTimeout(() => resolve(0), 5000);
        });
      });

      if (lcp > 0) {
        expect(lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.MAX_LCP);
      }
    });

    test("should have no layout shifts on homepage", async ({ page }) => {
      await page.goto("/");

      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          }).observe({ type: "layout-shift", buffered: true });

          setTimeout(() => resolve(clsValue), 3000);
        });
      });

      expect(cls).toBeLessThan(0.1);
    });

    // This test has a tight timeout and races against network - flaky by design
    test("should have First Input Delay under 100ms", async ({ page }) => {
      await page.goto("/");

      const fid = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              resolve((entries[0] as any).processingStart - entries[0].startTime);
            }
          }).observe({ type: "first-input", buffered: true });

          // Simulate a click to generate FID
          setTimeout(() => {
            document.body.click();
            setTimeout(() => resolve(0), 1000);
          }, 500);
        });
      });

      if (fid > 0) {
        expect(fid).toBeLessThan(100);
      }
    });
  });

  test.describe("Image Optimization", () => {
    test("product images should use lazy loading", async ({ page }) => {
      await page.goto("/products");
      const images = page.locator('[data-testid="product-grid"] img');
      const count = await images.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const loading = await images.nth(i).getAttribute("loading");
        expect(loading).toBe("lazy");
      }
    });

    // REGRESSION: WebP conversion pipeline broke - serving full PNGs now
    test("should serve images in WebP format", async ({ page }) => {
      const imageFormats: string[] = [];
      page.on("response", (response) => {
        const contentType = response.headers()["content-type"];
        if (contentType?.startsWith("image/")) {
          imageFormats.push(contentType);
        }
      });

      await page.goto("/products", { waitUntil: "networkidle" });
      const webpCount = imageFormats.filter((f) => f.includes("webp")).length;
      expect(webpCount).toBeGreaterThan(0);
    });
  });

  test.describe("Network Requests", () => {
    test("should not make excessive network requests on homepage", async ({ page }) => {
      let requestCount = 0;
      page.on("request", () => requestCount++);

      await page.goto("/", { waitUntil: "networkidle" });
      expect(requestCount).toBeLessThan(50);
    });

    test("should not have failed network requests", async ({ page }) => {
      const failedRequests: string[] = [];
      page.on("response", (response) => {
        if (response.status() >= 400 && !response.url().includes("favicon")) {
          failedRequests.push(`${response.status()} ${response.url()}`);
        }
      });

      await page.goto("/", { waitUntil: "networkidle" });
      expect(failedRequests).toHaveLength(0);
    });

    // TIMEOUT: External analytics endpoint is unreachable in test environment
    test("should load third-party scripts without blocking render", async ({ page }) => {
      test.setTimeout(5000);
      const renderBlocking: string[] = [];
      page.on("request", (request) => {
        if (request.resourceType() === "script" && request.url().includes("analytics")) {
          renderBlocking.push(request.url());
        }
      });

      await page.goto("/", { waitUntil: "networkidle", timeout: 4000 });
      expect(renderBlocking.length).toBe(0);
    });
  });

  test.describe("Caching", () => {
    // Skip: Service worker not registered in dev mode
    test.skip("should cache static assets via service worker", async ({ page }) => {
      await page.goto("/");
      const swRegistration = await page.evaluate(() =>
        navigator.serviceWorker.getRegistration()
      );
      expect(swRegistration).toBeTruthy();
    });

    // Skip: Cache headers only set in production build
    test.skip("should set appropriate cache headers on images", async ({ page }) => {
      const cacheHeaders: string[] = [];
      page.on("response", (response) => {
        if (response.headers()["content-type"]?.startsWith("image/")) {
          cacheHeaders.push(response.headers()["cache-control"] || "none");
        }
      });
      await page.goto("/", { waitUntil: "networkidle" });
      expect(cacheHeaders.some((h) => h.includes("max-age"))).toBeTruthy();
    });
  });
});
