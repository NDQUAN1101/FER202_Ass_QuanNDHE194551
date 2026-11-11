import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LogIn, UserPlus, ShieldCheck, Utensils, Lock, Mail, User } from 'lucide-react';

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const fromAdmin = location.state?.fromAdmin;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setError('Vui lòng điền đầy đủ họ tên, email và mật khẩu!');
        return;
      }
      if (password.length < 6) {
        setError('Mật khẩu phải chứa ít nhất 6 ký tự!');
        return;
      }
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không trùng khớp!');
        return;
      }

      const res = register(fullName, email, password);
      if (res.success) {
        addToast(`Tạo tài khoản thành công! Chào mừng ${res.user.fullName}`, 'success');
        navigate('/');
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError('Vui lòng nhập đầy đủ Email và Mật khẩu!');
        return;
      }

      const res = login(email.trim(), password.trim());
      if (res.success) {
        addToast(`Đăng nhập thành công! Xin chào ${res.user.fullName}`, 'success');
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    }
  };

  return (
    <div className="py-5 animate-fade-in d-flex align-items-center" style={{ minHeight: '75vh' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
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
            <h3 className="fw-bold mb-1 text-heading">
              {isRegisterMode ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập DineHub'}
            </h3>
            <p className="text-muted small">
              {isRegisterMode
                ? 'Tạo tài khoản mới để đặt bàn và nhận ưu đãi từ DineHub'
                : 'Truy cập để đặt bàn và quản lý thực đơn nhà hàng'}
            </p>
          </div>

          {/* Tab Switcher: Đăng Nhập / Đăng Ký */}
          <div className="d-flex rounded-3 p-1 mb-4" style={{ backgroundColor: '#f1f5f9' }}>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(false); setError(''); }}
              className={`btn flex-fill py-2 fw-semibold rounded-2 transition-all small ${
                !isRegisterMode ? 'bg-white shadow-sm text-dark' : 'text-muted border-0 bg-transparent'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setError(''); }}
              className={`btn flex-fill py-2 fw-semibold rounded-2 transition-all small ${
                isRegisterMode ? 'bg-white shadow-sm text-dark' : 'text-muted border-0 bg-transparent'
              }`}
            >
              Đăng Ký
            </button>
          </div>

          {fromAdmin && !isRegisterMode && (
            <div className="alert alert-warning py-2 small d-flex align-items-center gap-2 mb-3">
              <ShieldCheck size={18} className="flex-shrink-0" />
              <span>Vui lòng đăng nhập với tài khoản Quản Trị Viên để tiếp tục!</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger py-2 small mb-3">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {isRegisterMode && (
              <div>
                <label className="form-label small fw-semibold text-secondary">Họ và tên</label>
                <div className="position-relative">
                  <User size={18} className="position-absolute text-muted" style={{ top: '50%', left: '14px', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-control form-control-custom ps-5"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="form-label small fw-semibold text-secondary">Địa chỉ Email</label>
              <div className="position-relative">
                <Mail size={18} className="position-absolute text-muted" style={{ top: '50%', left: '14px', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-control form-control-custom ps-5"
                  placeholder="name@example.com"
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

            {isRegisterMode && (
              <div>
                <label className="form-label small fw-semibold text-secondary">Xác nhận mật khẩu</label>
                <div className="position-relative">
                  <Lock size={18} className="position-absolute text-muted" style={{ top: '50%', left: '14px', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    className="form-control form-control-custom ps-5"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary-custom w-100 justify-content-center py-2 mt-2">
              {isRegisterMode ? (
                <>
                  <UserPlus size={18} />
                  <span>Đăng Ký Tài Khoản</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Đăng Nhập</span>
                </>
              )}
            </button>
          </form>

          {/* Footer toggle text */}
          <div className="text-center mt-4 pt-3 border-top text-muted small">
            {isRegisterMode ? (
              <span>
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(false); setError(''); }}
                  className="btn btn-link p-0 text-decoration-none fw-semibold text-warning"
                  style={{ fontSize: 'inherit' }}
                >
                  Đăng nhập ngay
                </button>
              </span>
            ) : (
              <span>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(true); setError(''); }}
                  className="btn btn-link p-0 text-decoration-none fw-semibold text-warning"
                  style={{ fontSize: 'inherit' }}
                >
                  Đăng ký tài khoản mới
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
