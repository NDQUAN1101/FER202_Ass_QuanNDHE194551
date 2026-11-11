import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="py-5 text-center d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <div className="glass-panel p-5" style={{ maxWidth: '520px' }}>
        <div className="display-1 fw-bold text-warning mb-3">404</div>
        <h3 className="text-white fw-bold mb-2">Trang Không Tồn Tại</h3>
        <p className="text-muted small mb-4">
          Địa chỉ trang bạn vừa truy cập không tìm thấy trên hệ thống của Ngon hoặc đã được chuyển dời.
        </p>
        <Link to="/" className="btn-primary-custom text-decoration-none">
          <Home size={18} />
          <span>Về Trang Chủ Ngon</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

