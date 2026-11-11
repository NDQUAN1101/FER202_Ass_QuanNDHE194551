import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="pt-5 pb-4 mt-5 border-top footer-custom">
      <div className="container">
        <div className="row g-4 pb-4 border-bottom footer-border">
          {/* Brand Info */}
          <div className="col-lg-5 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Utensils size={20} color="#ffffff" />
              </div>
              <span className="fw-bold fs-4 text-brand">
                Dine<span style={{ color: 'var(--primary-color)' }}>Hub</span>
              </span>
            </div>
            <p className="text-muted small pe-lg-4 mb-0">
              DineHub là nền tảng đặt bàn và trải nghiệm ẩm thực trực tuyến chất lượng cao. Chúng tôi cam kết mang lại không gian thoải mái, dịch vụ tận tâm và những món ăn tươi ngon chuẩn vị.
            </p>
          </div>

          {/* Contact Details */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-3 text-uppercase text-heading" style={{ letterSpacing: '0.8px' }}>
              Thông Tin Liên Hệ
            </h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-start gap-2">
                <MapPin size={18} className="text-warning flex-shrink-0 mt-1" />
                <span>Khu Đô Thị Mới, Cầu Giấy, TP. Hà Nội</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-warning flex-shrink-0" />
                <span>Hotline: 0987 654 321 - 1900 6868</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-warning flex-shrink-0" />
                <span>contact@dinehub.vn</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Clock size={16} className="text-warning flex-shrink-0" />
                <span>Mở cửa: 10:00 - 23:00 (Hàng ngày)</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="col-lg-3 col-md-12">
            <h6 className="fw-bold mb-3 text-uppercase text-heading" style={{ letterSpacing: '0.8px' }}>
              Khám Phá
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
              <li>
                <Link to="/menu" className="text-muted text-decoration-none hover-warning">
                  Thực đơn món ngon
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-muted text-decoration-none hover-warning">
                  Đặt bàn trước
                </Link>
              </li>
              <li>
                <Link to="/booking-lookup" className="text-muted text-decoration-none hover-warning">
                  Tra cứu lịch đặt bàn
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted text-decoration-none hover-warning">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-warning text-decoration-none fw-semibold">
                  Cổng Quản Trị (Admin)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 d-flex flex-column flex-md-row align-items-center justify-content-between small text-muted">
          <div>
            &copy; {new Date().getFullYear()} DineHub Restaurant. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1 mt-2 mt-md-0">
            <span>Đồng hành cùng trải nghiệm ẩm thực của bạn</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
