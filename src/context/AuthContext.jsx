import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check both ngon_user and legacy dinehub_user
    const saved = localStorage.getItem('ngon_user') || localStorage.getItem('dinehub_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If it's admin email, ensure role is admin
        if (parsed.email === 'admin@ngon.vn' || parsed.email === 'admin@dinehub.com' || parsed.email?.startsWith('admin')) {
          parsed.role = 'admin';
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ngon_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ngon_user');
      localStorage.removeItem('dinehub_user');
    }
  }, [user]);

  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Support both admin@ngon.vn and admin@dinehub.com or any admin prefix
    if (cleanEmail === 'admin@ngon.vn' || cleanEmail === 'admin@dinehub.com' || cleanEmail.startsWith('admin')) {
      const adminUser = {
        id: 'usr-admin',
        fullName: 'Quản Trị Viên (Admin)',
        email: cleanEmail,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    // Registered or normal customers
    const regularUser = {
      id: 'usr-' + Date.now(),
      fullName: email.split('@')[0],
      email: email.trim(),
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };
    setUser(regularUser);
    return { success: true, user: regularUser };
  };

  const register = (fullName, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const role = cleanEmail.startsWith('admin') ? 'admin' : 'user';

    const newUser = {
      id: 'usr-' + Date.now(),
      fullName: fullName.trim(),
      email: cleanEmail,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.email === 'admin@ngon.vn' || user?.email === 'admin@dinehub.com' || user?.email?.startsWith('admin');

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
