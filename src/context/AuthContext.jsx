import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dinehub_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('dinehub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dinehub_user');
    }
  }, [user]);

  const login = (email, password) => {
    // Demo accounts
    if (email === 'admin@dinehub.com' && (password === 'admin' || password === 'admin123')) {
      const adminUser = {
        id: 'usr-1',
        fullName: 'Quản Trị Viên (Admin)',
        email: 'admin@dinehub.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    if (email === 'quanndhe194551@fpt.edu.vn' || email === 'user@dinehub.com') {
      const regularUser = {
        id: 'usr-2',
        fullName: 'Nguyễn Đình Quân (HE194551)',
        email: email,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
      };
      setUser(regularUser);
      return { success: true, user: regularUser };
    }

    // Default guest login for any input
    const guestUser = {
      id: 'usr-' + Date.now(),
      fullName: email.split('@')[0],
      email: email,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };
    setUser(guestUser);
    return { success: true, user: guestUser };
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
