import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, UtensilsCrossed, CalendarCheck, Grid, PlusCircle, ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Top Admin Header */}
      <header
        className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between bg-white"
        style={{ borderColor: 'var(--border-color)', zIndex: 100 }}
      >
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} color="#ffffff" />
            </div>
            <div>
              <span className="fw-bold text-dark fs-5">Ngon</span>
              <span className="badge bg-warning text-dark ms-2 small">ADMIN PORTAL</span>
            </div>
          </Link>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="btn btn-sm btn-outline-secondary text-dark d-flex align-items-center gap-1 rounded-3">
            <ArrowLeft size={15} />
            <span className="d-none d-sm-inline">Về Trang Chủ</span>
          </Link>

          <div className="d-flex align-items-center gap-2 ps-3 border-start">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.fullName}
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div className="d-none d-md-block text-start">
              <div className="text-dark small fw-bold leading-tight">{user?.fullName}</div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>Quản Trị Viên Cấp Cao</small>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-sm text-danger p-1 ms-2"
              title="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <aside className="admin-sidebar p-3 d-none d-md-block bg-white" style={{ width: '260px', flexShrink: 0 }}>
          <div className="small text-muted text-uppercase fw-bold mb-3 px-3" style={{ letterSpacing: '0.8px', fontSize: '0.72rem' }}>
            Menu Quản Trị
          </div>

          <nav className="d-flex flex-column gap-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `admin-nav-item text-decoration-none ${isActive ? 'active' : ''}`
              }
            >
              <LayoutDashboard size={18} />
              <span>Bảng Tổng Quan</span>
            </NavLink>

            <NavLink
              to="/admin/foods"
              className={({ isActive }) =>
                `admin-nav-item text-decoration-none ${isActive ? 'active' : ''}`
              }
            >
              <UtensilsCrossed size={18} />
              <span>Quản Lý Thực Đơn</span>
            </NavLink>

            <NavLink
              to="/admin/foods/create"
              className={({ isActive }) =>
                `admin-nav-item text-decoration-none ${isActive ? 'active' : ''}`
              }
            >
              <PlusCircle size={18} />
              <span>Thêm Món Ăn Mới</span>
            </NavLink>

            <NavLink
              to="/admin/bookings"
              className={({ isActive }) =>
                `admin-nav-item text-decoration-none ${isActive ? 'active' : ''}`
              }
            >
              <CalendarCheck size={18} />
              <span>Quản Lý Đặt Bàn</span>
            </NavLink>

            <NavLink
              to="/admin/tables"
              className={({ isActive }) =>
                `admin-nav-item text-decoration-none ${isActive ? 'active' : ''}`
              }
            >
              <Grid size={18} />
              <span>Sơ Đồ Bàn Ăn</span>
            </NavLink>
          </nav>
        </aside>

        {/* Content Outlet */}
        <main className="flex-grow-1 p-3 p-md-4 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


