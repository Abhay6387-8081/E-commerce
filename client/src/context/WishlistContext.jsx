import { useState, useEffect } from 'react';
import { WishlistContext } from './wishlistContextStore';

const STORAGE_KEY = 'wishlist_items';

function loadWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function toggleItem(product) {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === product.id);
      if (exists) return prev.filter((i) => i.id !== product.id);
      return [...prev, product];
    });
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function isWishlisted(id) {
    return items.some((i) => i.id === id);
  }

  return (
    <WishlistContext.Provider value={{ items, toggleItem, removeItem, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}