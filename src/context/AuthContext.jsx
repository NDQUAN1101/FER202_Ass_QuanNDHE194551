import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ngon_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ngon_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ngon_user');
    }
  }, [user]);

  const login = (email, password) => {
    // Admin account
    if (email === 'admin@ngon.vn' && (password === 'admin' || password === 'admin123')) {
      const adminUser = {
        id: 'usr-1',
        fullName: 'Quản Trị Viên (Admin)',
        email: 'admin@ngon.vn',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    // Existing registered users or any other normal credentials
    const regularUser = {
      id: 'usr-' + Date.now(),
      fullName: email.split('@')[0],
      email: email,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };
    setUser(regularUser);
    return { success: true, user: regularUser };
  };

  const register = (fullName, email, password) => {
    const newUser = {
      id: 'usr-' + Date.now(),
      fullName: fullName.trim(),
      email: email.trim(),
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

