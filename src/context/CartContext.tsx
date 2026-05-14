"use client";
import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  image_url: string;
  description: string;
  options?: any;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === newItem.productId && JSON.stringify(i.options) === JSON.stringify(newItem.options));
      if (existing) {
        return prev.map(i => i === existing ? { ...i, qty: i.qty + newItem.qty } : i);
      }
      return [...prev, { ...newItem, id: Math.random().toString(36).substr(2, 9) }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, i) => acc + (i.price * i.qty), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
