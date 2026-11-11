import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Utensils, CalendarDays, ShoppingBag, ShieldCheck, LogOut, LogIn, Menu as MenuIcon, X } from 'lucide-react';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartItems, totalCount, totalAmount, removeFromCart, updateQuantity } = useCart();
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <>
      <header className="navbar-custom py-3">
        <div className="container d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(226, 135, 34, 0.35)',
              }}
            >
              <Utensils size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.5px', color: '#0f172a', lineHeight: 1.1 }}>
                <span style={{ color: 'var(--primary-color)' }}>Ngon</span>
              </div>
              <small style={{ fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>
                Nhà Hàng & Đặt Bàn Trực Tuyến
              </small>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-lg-flex align-items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-decoration-none fw-semibold transition-all ${
                  isActive ? 'text-warning' : 'text-secondary'
                }`
              }
            >
              Trang Chủ
            </NavLink>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `text-decoration-none fw-semibold transition-all ${
                  isActive ? 'text-warning' : 'text-secondary'
                }`
              }
            >
              Thực Đơn
            </NavLink>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                `text-decoration-none fw-semibold transition-all ${
                  isActive ? 'text-warning' : 'text-secondary'
                }`
              }
            >
              Đặt Bàn Ngay
            </NavLink>
            <NavLink
              to="/booking-lookup"
              className={({ isActive }) =>
                `text-decoration-none fw-semibold transition-all ${
                  isActive ? 'text-warning' : 'text-secondary'
                }`
              }
            >
              Tra Cứu Đặt Bàn
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-decoration-none fw-semibold transition-all ${
                  isActive ? 'text-warning' : 'text-secondary'
                }`
              }
            >
              Giới Thiệu
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-decoration-none fw-semibold transition-all ${
                  isActive ? 'text-warning' : 'text-secondary'
                }`
              }
            >
              Liên Hệ
            </NavLink>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart / Pre-order Bag button */}
            <button
              onClick={() => setShowCartDrawer(true)}
              className="position-relative btn d-flex align-items-center justify-content-center"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                color: '#334155',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}
              title="Món đã chọn trước"
            >
              <ShoppingBag size={20} />
              {totalCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark fw-bold"
                  style={{ fontSize: '0.7rem' }}
                >
                  {totalCount}
                </span>
              )}
            </button>

            {/* Auth Dropdown or Login Button */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-custom d-flex align-items-center gap-2 py-1 px-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.fullName}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span className="d-none d-md-inline small fw-semibold text-dark">{user.fullName}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-2 mt-2" style={{ backgroundColor: '#ffffff', minWidth: '220px' }}>
                  <li className="px-3 py-2 border-bottom">
                    <div className="fw-bold small text-dark">{user.fullName}</div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{user.email}</div>
                  </li>

                  {isAdmin && (
                    <li>
                      <Link to="/admin" className="dropdown-item d-flex align-items-center gap-2 py-2 rounded text-dark">
                        <ShieldCheck size={16} color="var(--primary-color)" />
                        <span>Cổng Quản Trị (Admin)</span>
                      </Link>
                    </li>
                  )}

                  <li>
                    <button
                      onClick={logout}
                      className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger rounded mt-1"
                    >
                      <LogOut size={16} />
                      <span>Đăng Xuất</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn-primary-custom text-decoration-none py-2 px-3 small">
                <LogIn size={16} />
                <span className="d-none d-sm-inline">Đăng Nhập</span>
              </Link>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="d-lg-none btn btn-light border p-2"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="d-lg-none bg-white border-top px-4 py-3 mt-2 shadow-sm animate-fade-in">
            <div className="d-flex flex-column gap-3">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-decoration-none text-dark fw-semibold">
                Trang Chủ
              </Link>
              <Link to="/menu" onClick={() => setMobileMenuOpen(false)} className="text-decoration-none text-dark fw-semibold">
                Thực Đơn
              </Link>
              <Link to="/booking" onClick={() => setMobileMenuOpen(false)} className="text-decoration-none text-dark fw-semibold">
                Đặt Bàn Ngay
              </Link>
              <Link to="/booking-lookup" onClick={() => setMobileMenuOpen(false)} className="text-decoration-none text-dark fw-semibold">
                Tra Cứu Đặt Bàn
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-decoration-none text-dark fw-semibold">
                Giới Thiệu
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-decoration-none text-dark fw-semibold">
                Liên Hệ
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      {showCartDrawer && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1050, backdropFilter: 'blur(4px)' }}
          onClick={() => setShowCartDrawer(false)}
        >
          <div
            className="position-fixed top-0 end-0 h-100 bg-white"
            style={{
              width: '100%',
              maxWidth: '420px',
              borderLeft: '1px solid var(--border-color)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
              <div className="d-flex align-items-center gap-2">
                <ShoppingBag color="var(--primary-color)" size={22} />
                <h5 className="mb-0 text-dark fw-bold">Món Đặt Trước ({totalCount})</h5>
              </div>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="btn btn-sm btn-light border rounded-circle"
                style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="my-auto text-center py-5">
                <Utensils size={48} color="#94a3b8" className="mb-3 opacity-50" />
                <h6 className="text-dark">Chưa có món ăn nào được chọn</h6>
                <p className="text-muted small">Hãy khám phá thực đơn và chọn món bạn yêu thích để nhà hàng chuẩn bị sẵn trước nhé!</p>
                <Link
                  to="/menu"
                  onClick={() => setShowCartDrawer(false)}
                  className="btn-primary-custom mt-2 text-decoration-none"
                >
                  Xem Thực Đơn
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-grow-1 overflow-auto pe-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.food.id}
                      className="d-flex gap-3 mb-3 p-2 rounded bg-light border"
                    >
                      <img
                        src={item.food.image}
                        alt={item.food.name}
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-dark small mb-1">{item.food.name}</div>
                        <div className="text-warning small fw-bold mb-2">{formatVND(item.food.price)}</div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-white border py-0 px-2 shadow-sm"
                            onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="small text-dark fw-bold">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-white border py-0 px-2 shadow-sm"
                            onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                          >
                            +
                          </button>
                          <button
                            className="btn btn-sm text-danger ms-auto p-0"
                            onClick={() => removeFromCart(item.food.id)}
                            title="Xóa món"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-top mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">Tổng cộng tạm tính:</span>
                    <span className="h5 mb-0 text-warning fw-bold">{formatVND(totalAmount)}</span>
                  </div>
                  <Link
                    to="/booking"
                    onClick={() => setShowCartDrawer(false)}
                    className="btn-primary-custom w-100 justify-content-center text-decoration-none py-2"
                  >
                    <CalendarDays size={18} /> Tiến Hành Đặt Bàn Ngay
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

