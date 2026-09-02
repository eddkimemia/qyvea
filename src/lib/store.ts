"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = { productId: string; slug: string; name: string; price: number; qty: number; withInstall?: boolean };
type WishlistItem = { productId: string; slug: string; name: string; price: number };

interface Store {
  cart: CartItem[];
  wishlist: string[]; // slugs
  compare: string[]; // max 3
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  toggleCompare: (slug: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      compare: [],
      addToCart: (item) => {
        const existing = get().cart.find((c) => c.productId === item.productId && c.withInstall === item.withInstall);
        if (existing) {
          set({ cart: get().cart.map((c) => (c.productId === item.productId ? { ...c, qty: c.qty + item.qty } : c)) });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },
      removeFromCart: (productId) => set({ cart: get().cart.filter((c) => c.productId !== productId) }),
      updateQty: (productId, qty) => set({ cart: get().cart.map((c) => c.productId === productId ? { ...c, qty: Math.max(1, qty) } : c) }),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (slug) => {
        const cur = get().wishlist;
        set({ wishlist: cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug] });
      },
      toggleCompare: (slug) => {
        const cur = get().compare;
        if (cur.includes(slug)) set({ compare: cur.filter((s) => s !== slug) });
        else if (cur.length < 3) set({ compare: [...cur, slug] });
      },
    }),
    { name: "syntech-store" }
  )
);
