import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Menu from './pages/public/Menu';
import Booking from './pages/public/Booking';
import BookingSuccess from './pages/public/BookingSuccess';
import BookingLookup from './pages/public/BookingLookup';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFoods from './pages/admin/AdminFoods';
import AdminFoodForm from './pages/admin/AdminFoodForm';
import AdminBookings from './pages/admin/AdminBookings';
import AdminTables from './pages/admin/AdminTables';

import NotFound from './pages/NotFound';

// Public Layout Wrapper
const PublicLayout = ({ children }) => (
  <div className="d-flex flex-column min-vh-100">
    <Header />
    <main className="flex-grow-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Client Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/menu"
        element={
          <PublicLayout>
            <Menu />
          </PublicLayout>
        }
      />
      <Route
        path="/booking"
        element={
          <PublicLayout>
            <Booking />
          </PublicLayout>
        }
      />
      <Route
        path="/booking-success"
        element={
          <PublicLayout>
            <BookingSuccess />
          </PublicLayout>
        }
      />
      <Route
        path="/booking-lookup"
        element={
          <PublicLayout>
            <BookingLookup />
          </PublicLayout>
        }
      />
      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="foods" element={<AdminFoods />} />
        <Route path="foods/create" element={<AdminFoodForm />} />
        <Route path="foods/edit/:id" element={<AdminFoodForm />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="tables" element={<AdminTables />} />
      </Route>

      {/* 404 Catch All */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        }
      />
    </Routes>
  );
}

export default App;
