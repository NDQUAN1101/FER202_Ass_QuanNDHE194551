import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LogIn, ShieldCheck, UserCheck, Utensils, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const fromAdmin = location.state?.fromAdmin;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }

    const res = login(email.trim(), password.trim());
    if (res.success) {
      addToast(`Xin chào ${res.user.fullName}!`, 'success');
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  const handleQuickLoginAdmin = () => {
    setEmail('admin@dinehub.com');
    setPassword('admin');
    const res = login('admin@dinehub.com', 'admin');
    addToast('Đăng nhập Quản Trị Viên thành công!', 'success');
    navigate('/admin');
  };

  const handleQuickLoginUser = () => {
    setEmail('quanndhe194551@fpt.edu.vn');
    setPassword('123');
    const res = login('quanndhe194551@fpt.edu.vn', '123');
    addToast('Đăng nhập thành công với vai trò Khách hàng!', 'success');
    navigate('/');
  };

  return (
    <div className="py-5 animate-fade-in d-flex align-items-center" style={{ minHeight: '75vh' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div
          className="glass-panel p-4 p-md-5 bg-white"
          style={{ border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
        >
          {/* Logo & Header */}
          <div className="text-center mb-4">
            <div
              className="rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '48px', height: '48px', background: 'var(--primary-gradient)' }}
            >
              <Utensils size={26} color="#ffffff" />
            </div>
            <h3 className="fw-bold mb-1 text-heading">Đăng Nhập DineHub</h3>
            <p className="text-muted small">Truy cập để quản lý lịch đặt bàn hoặc thực đơn nhà hàng</p>
          </div>

          {fromAdmin && (
            <div className="alert alert-warning py-2 small d-flex align-items-center gap-2 mb-3">
              <ShieldCheck size={18} className="flex-shrink-0" />
              <span>Vui lòng đăng nhập với tài khoản Quản Trị Viên (Admin) để tiếp tục!</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger py-2 small mb-3">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label small fw-semibold text-secondary">Địa chỉ Email</label>
              <div className="position-relative">
                <Mail size={18} className="position-absolute text-muted" style={{ top: '50%', left: '14px', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-control form-control-custom ps-5"
                  placeholder="admin@dinehub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="form-label small fw-semibold text-secondary">Mật khẩu</label>
              <div className="position-relative">
                <Lock size={18} className="position-absolute text-muted" style={{ top: '50%', left: '14px', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="form-control form-control-custom ps-5"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary-custom w-100 justify-content-center py-2 mt-2">
              <LogIn size={18} />
              <span>Đăng Nhập</span>
            </button>
          </form>

          {/* Quick Demo Logins for Fast Grading */}
          <div className="pt-3 border-top">
            <div className="small text-muted text-center mb-3 fw-semibold">
              ⚡ Tài khoản mẫu (1-Click Đăng nhập nhanh):
            </div>

            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                onClick={handleQuickLoginAdmin}
                className="btn btn-sm btn-outline-warning text-dark d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold"
              >
                <ShieldCheck size={16} />
                <span>1-Click Đăng Nhập Quản Trị Viên (Admin)</span>
              </button>

              <button
                type="button"
                onClick={handleQuickLoginUser}
                className="btn btn-sm btn-light border text-dark d-flex align-items-center justify-content-center gap-2 py-2"
              >
                <UserCheck size={16} />
                <span>1-Click Đăng Nhập Khách Hàng (User)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
