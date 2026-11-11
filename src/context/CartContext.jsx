import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const getStorageKey = () => {
    return user ? `ngon_cart_${user.email}` : 'ngon_cart_guest';
  };

  const [cartItems, setCartItems] = useState(() => {
    const key = user ? `ngon_cart_${user.email}` : 'ngon_cart_guest';
    const saved = localStorage.getItem(key) || localStorage.getItem('ngon_cart') || localStorage.getItem('dinehub_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Khi chuyển tài khoản hoặc đăng xuất, nạp đúng giỏ hàng của tài khoản đó
  useEffect(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    setCartItems(saved ? JSON.parse(saved) : []);
  }, [user]);

  // Tự động lưu giỏ hàng
  useEffect(() => {
    const key = getStorageKey();
    if (cartItems.length > 0) {
      localStorage.setItem(key, JSON.stringify(cartItems));
    } else {
      localStorage.removeItem(key);
      localStorage.removeItem('ngon_cart');
      localStorage.removeItem('dinehub_cart');
    }
  }, [cartItems, user]);

  const addToCart = (food, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.food.id === food.id);
      if (existing) {
        return prev.map(item =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { food, quantity }];
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems(prev => prev.filter(item => item.food.id !== foodId));
  };

  const updateQuantity = (foodId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.food.id === foodId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    const key = getStorageKey();
    localStorage.removeItem(key);
    localStorage.removeItem('ngon_cart');
    localStorage.removeItem('dinehub_cart');
    localStorage.removeItem('ngon_cart_guest');
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
