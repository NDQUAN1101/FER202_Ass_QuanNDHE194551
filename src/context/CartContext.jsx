import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // Tạo storage key riêng biệt theo từng tài khoản: 'ngon_cart_user@example.com' hoặc 'ngon_cart_guest'
  const getStorageKey = () => {
    return user ? `ngon_cart_${user.email}` : 'ngon_cart_guest';
  };

  const [cartItems, setCartItems] = useState([]);

  // Khi tài khoản đăng nhập thay đổi (hoặc đăng xuất), tự động tải lại giỏ món của tài khoản đó
  useEffect(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    setCartItems(saved ? JSON.parse(saved) : []);
  }, [user]);

  // Lưu giỏ món ăn đúng vào tài khoản hiện tại
  useEffect(() => {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(cartItems));
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
    localStorage.removeItem(getStorageKey());
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
