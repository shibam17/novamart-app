export const PRODUCTS = {
  HEADPHONES: "prod-001",
  IPHONE: "prod-002",
  RUNNING_SHOES: "prod-003",
  COFFEE_MAKER: "prod-005",
  YOGA_MAT: "prod-008",
  DENIM_JACKET: "prod-004",
};

export const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Sports & Outdoors",
  "Beauty & Personal Care",
  "Books & Stationery",
];

export const SORT_OPTIONS = {
  FEATURED: "featured",
  NEWEST: "newest",
  PRICE_ASC: "price-asc",
  PRICE_DESC: "price-desc",
  RATING: "rating",
  REVIEWS: "reviews",
  NAME: "name",
};

export const CONTACT_SUBJECTS = [
  { value: "order", label: "Order Issue" },
  { value: "shipping", label: "Shipping & Delivery" },
  { value: "returns", label: "Returns & Exchanges" },
  { value: "product", label: "Product Question" },
  { value: "feedback", label: "General Feedback" },
  { value: "other", label: "Other" },
];

export const INVALID_EMAILS = [
  "invalid",
  "missing-at.com",
  "@no-local-part.com",
  "spaces in@email.com",
];

export const PERFORMANCE_THRESHOLDS = {
  MAX_PAGE_LOAD_TIME: parseInt(process.env.MAX_PAGE_LOAD_TIME || "3000"),
  MAX_LCP: parseInt(process.env.MAX_LCP || "2500"),
  MAX_PAGE_SIZE_KB: parseInt(process.env.MAX_PAGE_SIZE_KB || "3000"),
};
