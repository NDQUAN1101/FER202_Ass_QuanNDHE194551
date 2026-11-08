import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="pt-5 pb-4 mt-5 border-top" style={{ backgroundColor: '#090d14', borderColor: 'var(--border-color)' }}>
      <div className="container">
        <div className="row g-4 pb-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
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
              <span className="fw-bold fs-4 text-white">
                Dine<span style={{ color: 'var(--primary-color)' }}>Hub</span>
              </span>
            </div>
            <p className="text-muted small pe-lg-4">
              DineHub là nền tảng đặt bàn và trải nghiệm ẩm thực trực tuyến cao cấp. Chúng tôi cam kết mang lại không gian sang trọng, dịch vụ tận tâm và những phong vị ẩm thực Á - Âu thăng hoa.
            </p>
            <div className="badge-gold d-inline-flex align-items-center gap-2 py-2 px-3 mt-2">
              <ShieldCheck size={16} /> Đồ án môn FER202 - Front-End Web Development with React
            </div>
          </div>

          {/* Contact Details */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.8px' }}>
              Thông Tin Liên Hệ
            </h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-start gap-2">
                <MapPin size={18} className="text-warning flex-shrink-0 mt-1" />
                <span>Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, TP. Hà Nội (FPT University)</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-warning flex-shrink-0" />
                <span>Hotline: 0987 654 321 - 1900 6868</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-warning flex-shrink-0" />
                <span>contact@dinehub.restaurant.vn</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Clock size={16} className="text-warning flex-shrink-0" />
                <span>Mở cửa: 10:00 - 23:00 (Hàng ngày)</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.8px' }}>
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
                  Tra cứu lịch đặt
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted text-decoration-none hover-warning">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-warning text-decoration-none">
                  Cổng Quản Trị (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Student & Project Metadata */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.8px' }}>
              Thông Tin Sinh Viên
            </h6>
            <div className="p-3 rounded" style={{ backgroundColor: '#131b26', border: '1px solid var(--border-color)' }}>
              <div className="small text-muted mb-1">Sinh viên thực hiện:</div>
              <div className="fw-bold text-white fs-6">Nguyễn Đình Quân</div>
              <div className="text-warning small fw-semibold">Mã SV: HE194551</div>
              <div className="small text-muted mt-2">Lớp: <span className="text-light">SE2059</span></div>
              <div className="small text-muted">Học kỳ: <span className="text-light">Summer / Fall 2026</span></div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 d-flex flex-column flex-md-row align-items-center justify-content-between small text-muted">
          <div>
            &copy; {new Date().getFullYear()} DineHub Restaurant. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1 mt-2 mt-md-0">
            <span>Built with React 19 & Vite for FER202 Assignment with</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
