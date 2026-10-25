import { useState, useEffect } from 'react';
import { CartContext } from './cartContextStore';

const STORAGE_KEY = 'cart_items';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, qty = 1) {
    console.log('product recived',product);
    console.log('product id:',product.id);
    console.log('product _id:',product._id);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.qty + qty, product.stock);
        return prev.map((i) => (i.id === product.id ? { ...i, qty: newQty } : i));
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          mrp: product.mrp,
          unit: product.unit,
          imageUrl: product.imageUrl,
          stock: product.stock,
          qty: Math.min(qty, product.stock),
        },
      ];
    });
  }

  function updateQty(id, qty) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalMrp = items.reduce((sum, i) => sum + (i.mrp || i.price) * i.qty, 0);
  const totalSavings = Math.max(0, totalMrp - subtotal);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clearCart, itemCount, subtotal, totalMrp, totalSavings }}
    >
      {children}
    </CartContext.Provider>
  );
}
