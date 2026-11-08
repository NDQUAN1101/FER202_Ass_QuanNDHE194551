import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Utensils, CalendarDays, Search, ShoppingBag, ShieldCheck, LogOut, LogIn, Menu as MenuIcon, X } from 'lucide-react';

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
                boxShadow: '0 4px 12px rgba(226, 135, 34, 0.4)',
              }}
            >
              <Utensils size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.5px', color: '#ffffff', lineHeight: 1.1 }}>
                Dine<span style={{ color: 'var(--primary-color)' }}>Hub</span>
              </div>
              <small style={{ fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Luxury Dining & Reservation
              </small>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-lg-flex align-items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-decoration-none fw-medium transition-all ${
                  isActive ? 'text-warning' : 'text-light text-opacity-75'
                }`
              }
            >
              Trang Chủ
            </NavLink>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `text-decoration-none fw-medium transition-all ${
                  isActive ? 'text-warning' : 'text-light text-opacity-75'
                }`
              }
            >
              Thực Đơn
            </NavLink>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                `text-decoration-none fw-medium transition-all ${
                  isActive ? 'text-warning' : 'text-light text-opacity-75'
                }`
              }
            >
              Đặt Bàn Ngay
            </NavLink>
            <NavLink
              to="/booking-lookup"
              className={({ isActive }) =>
                `text-decoration-none fw-medium transition-all ${
                  isActive ? 'text-warning' : 'text-light text-opacity-75'
                }`
              }
            >
              Tra Cứu Đặt Bàn
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-decoration-none fw-medium transition-all ${
                  isActive ? 'text-warning' : 'text-light text-opacity-75'
                }`
              }
            >
              Giới Thiệu
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-decoration-none fw-medium transition-all ${
                  isActive ? 'text-warning' : 'text-light text-opacity-75'
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
              className="position-relative btn btn-dark d-flex align-items-center justify-content-center"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#182232',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
              }}
              title="Món đã chọn trước"
            >
              <ShoppingBag size={19} />
              {totalCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.7rem' }}
                >
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Profile or Login */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-dark d-flex align-items-center gap-2 px-2 py-1"
                  style={{
                    backgroundColor: '#182232',
                    border: '1px solid var(--border-color)',
                    borderRadius: '25px',
                  }}
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span className="d-none d-md-inline text-light fw-medium" style={{ fontSize: '0.85rem' }}>
                    {user.fullName}
                  </span>
                  {isAdmin && (
                    <span className="badge bg-warning text-dark" style={{ fontSize: '0.65rem' }}>
                      ADMIN
                    </span>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark mt-2 shadow" style={{ backgroundColor: '#182232', borderColor: 'var(--border-color)' }}>
                  <li className="px-3 py-2 border-bottom border-secondary">
                    <div className="fw-semibold text-white">{user.fullName}</div>
                    <small className="text-muted">{user.email}</small>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2 text-warning" to="/admin">
                        <ShieldCheck size={16} /> Trang Quản Trị (Admin)
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/booking-lookup">
                      <CalendarDays size={16} /> Đơn đặt bàn của tôi
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger"
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn-outline-custom text-decoration-none">
                <LogIn size={16} />
                <span>Đăng nhập</span>
              </Link>
            )}

            {/* Mobile menu trigger */}
            <button
              className="btn btn-dark d-lg-none p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ backgroundColor: '#182232', border: '1px solid var(--border-color)' }}
            >
              {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="d-lg-none px-4 pt-3 pb-4 border-top border-secondary mt-3 animate-fade-in" style={{ backgroundColor: '#111827' }}>
            <div className="d-flex flex-column gap-3">
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="text-light text-decoration-none py-1">
                Trang Chủ
              </NavLink>
              <NavLink to="/menu" onClick={() => setMobileMenuOpen(false)} className="text-light text-decoration-none py-1">
                Thực Đơn
              </NavLink>
              <NavLink to="/booking" onClick={() => setMobileMenuOpen(false)} className="text-light text-decoration-none py-1">
                Đặt Bàn Ngay
              </NavLink>
              <NavLink to="/booking-lookup" onClick={() => setMobileMenuOpen(false)} className="text-light text-decoration-none py-1">
                Tra Cứu Đặt Bàn
              </NavLink>
              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="text-light text-decoration-none py-1">
                Giới Thiệu
              </NavLink>
              <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-light text-decoration-none py-1">
                Liên Hệ
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-warning text-decoration-none py-1 fw-bold">
                  Quản Trị Viên (Admin)
                </NavLink>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Cart / Pre-order Drawer Modal */}
      {showCartDrawer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9998,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setShowCartDrawer(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              height: '100%',
              backgroundColor: '#131b26',
              borderLeft: '1px solid var(--border-color)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.6)',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between pb-3 border-bottom border-secondary mb-3">
              <div className="d-flex align-items-center gap-2">
                <ShoppingBag color="var(--primary-color)" size={22} />
                <h5 className="mb-0 text-white fw-bold">Món Đặt Trước ({totalCount})</h5>
              </div>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="btn btn-sm btn-outline-secondary text-light rounded-circle"
                style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="my-auto text-center py-5">
                <Utensils size={48} color="#64748b" className="mb-3 opacity-50" />
                <h6 className="text-light">Chưa có món ăn nào được chọn</h6>
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
                      className="d-flex gap-3 mb-3 p-2 rounded"
                      style={{ backgroundColor: '#1c2636', border: '1px solid var(--border-color)' }}
                    >
                      <img
                        src={item.food.image}
                        alt={item.food.name}
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-white small mb-1">{item.food.name}</div>
                        <div className="text-warning small fw-bold mb-2">{formatVND(item.food.price)}</div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-secondary py-0 px-2"
                            onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="small text-white fw-bold">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-secondary py-0 px-2"
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

                <div className="pt-3 border-top border-secondary mt-3">
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
