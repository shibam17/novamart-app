"use client";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

const CART_KEY = "novamart-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart();
  const existing = cart.find(
    (i) =>
      i.productId === item.productId &&
      i.size === item.size &&
      i.color === item.color
  );
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
  return cart;
}

export function updateCartItemQuantity(
  productId: string,
  size: string,
  color: string,
  quantity: number
): CartItem[] {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(
      (i) =>
        !(i.productId === productId && i.size === size && i.color === color)
    );
  } else {
    const item = cart.find(
      (i) =>
        i.productId === productId && i.size === size && i.color === color
    );
    if (item) item.quantity = quantity;
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
  return cart;
}

export function removeFromCart(
  productId: string,
  size: string,
  color: string
): CartItem[] {
  return updateCartItemQuantity(productId, size, color, 0);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
