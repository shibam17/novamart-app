import { createClient } from "@supabase/supabase-js";
import { products } from "../src/data/products";

const supabaseUrl = "https://ajjbybpajartkozyutxi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqamJ5YnBhamFydGtvenl1dHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODU5NjYsImV4cCI6MjA5NDA2MTk2Nn0.eErMqdOlAPS9pcHZv8fm89r3W8n6-FvkQx8yjH0rOaU";

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding products...");

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    original_price: p.originalPrice || null,
    description: p.description,
    features: p.features,
    specifications: p.specifications,
    category: p.category,
    subcategory: p.subcategory,
    image: p.image,
    images: p.images,
    sizes: p.sizes,
    colors: p.colors,
    rating: p.rating,
    reviews: p.reviews,
    in_stock: p.inStock,
    stock_count: p.stockCount,
    tags: p.tags,
    badge: p.badge || null,
    sku: p.sku,
  }));

  const { data, error } = await supabase
    .from("products")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${rows.length} products successfully.`);
}

seed();
