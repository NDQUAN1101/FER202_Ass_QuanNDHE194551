import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodApi } from '../../services/api';
import FoodCard from '../../components/common/FoodCard';
import { Utensils, CalendarDays, Award, Clock, Users, ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const [specialFoods, setSpecialFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foods = await foodApi.getAll();
        const specials = foods.filter(f => f.isSpecial).slice(0, 4);
        setSpecialFoods(specials);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section
        className="position-relative py-5 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #fffbeb 0%, #f8fafc 100%)',
          minHeight: '82vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container py-lg-4 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="badge-gold d-inline-flex align-items-center gap-2 mb-3 py-2 px-3 shadow-sm">
                <Sparkles size={16} /> Nhà Hàng Ẩm Thực Tươi Ngon & Hiện Đại
              </div>
              <h1 className="display-4 fw-bold mb-4 text-heading" style={{ lineHeight: 1.18 }}>
                Thưởng Thức Hương Vị & Đặt Bàn <span style={{ color: 'var(--primary-color)' }}>Dễ Dàng</span> Trực Tuyến
              </h1>
              <p className="lead text-muted mb-4" style={{ fontSize: '1.15rem' }}>
                Khám phá bản giao hưởng ẩm thực Á - Âu tinh tế được chế biến bởi các đầu bếp tài hoa. Đặt trước bàn ăn lý tưởng và chọn sẵn thực đơn chỉ trong 60 giây.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link to="/booking" className="btn-primary-custom text-decoration-none py-3 px-4 fs-6">
                  <CalendarDays size={20} />
                  <span>Đặt Bàn Giữ Chỗ Ngay</span>
                </Link>
                <Link to="/menu" className="btn-outline-custom text-decoration-none py-3 px-4 fs-6">
                  <Utensils size={18} />
                  <span>Khám Phá Thực Đơn</span>
                </Link>
              </div>

              {/* Stats Highlights */}
              <div className="row g-3 pt-3 border-top">
                <div className="col-4">
                  <div className="fw-bold fs-3" style={{ color: 'var(--primary-color)' }}>50+</div>
                  <small className="text-muted fw-medium">Món Ăn Hấp Dẫn</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-3" style={{ color: 'var(--primary-color)' }}>100%</div>
                  <small className="text-muted fw-medium">Nguyên Liệu Tươi Sống</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-3" style={{ color: 'var(--primary-color)' }}>1000+</div>
                  <small className="text-muted fw-medium">Khách Hàng Hài Lòng</small>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="col-lg-6">
              <div className="position-relative">
                <div
                  style={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.12)',
                    border: '4px solid #ffffff',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80"
                    alt="Ngon Signature Wagyu"
                    className="w-100 h-100 object-fit-cover"
                    style={{ minHeight: '420px', maxHeight: '520px' }}
                  />
                </div>

                {/* Floating Highlight Card */}
                <div
                  className="glass-panel position-absolute p-3 d-none d-sm-flex align-items-center gap-3 animate-fade-in shadow"
                  style={{
                    bottom: '-20px',
                    left: '20px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--primary-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Award size={24} color="#ffffff" />
                  </div>
                  <div>
                    <div className="fw-bold text-heading small">Đầu Bếp Hàng Đầu</div>
                    <small className="text-muted">Đảm bảo vệ sinh an toàn thực phẩm</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Highlights Section */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-5">
            <div>
              <span className="badge-gold mb-2 d-inline-block">Tuyển Chọn Tinh Hoa</span>
              <h2 className="fw-bold display-6 mb-2 text-heading">Món Ăn Đặc Sắc Được Yêu Thích</h2>
              <p className="text-muted mb-0">Những món ăn mang đậm phong vị đặc trưng tại Ngon</p>
            </div>
            <Link to="/menu" className="btn-outline-custom text-decoration-none mt-3 mt-md-0 d-inline-flex align-items-center gap-2">
              <span>Xem Tất Cả Món</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {specialFoods.map((food) => (
                <div key={food.id} className="col-12 col-sm-6 col-lg-3">
                  <FoodCard food={food} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reservation Workflow */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge-gold mb-2 d-inline-block">Dịch Vụ Nhanh Chóng</span>
            <h2 className="fw-bold display-6 mb-3 text-heading">Quy Trình Đặt Bàn Chỉ Với 3 Bước</h2>
            <p className="text-muted">Đơn giản, chuẩn xác và giữ chỗ ngay tức thì.</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="glass-panel p-4 h-100 d-flex flex-column align-items-center shadow-sm">
                <div
                  className="mb-4 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-4 shadow-sm"
                  style={{ width: '56px', height: '56px', background: 'var(--primary-gradient)' }}
                >
                  1
                </div>
                <h5 className="fw-bold mb-2 text-heading">Chọn Thời Gian & Khu Vực</h5>
                <p className="text-muted small mb-0">
                  Lựa chọn ngày giờ dự tiệc, số lượng khách đi cùng và vị trí bàn mong muốn tại nhà hàng.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-panel p-4 h-100 d-flex flex-column align-items-center shadow-sm">
                <div
                  className="mb-4 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-4 shadow-sm"
                  style={{ width: '56px', height: '56px', background: 'var(--primary-gradient)' }}
                >
                  2
                </div>
                <h5 className="fw-bold mb-2 text-heading">Chọn Món Ăn Trước (Tùy Chọn)</h5>
                <p className="text-muted small mb-0">
                  Lên trước thực đơn yêu thích để đầu bếp chuẩn bị sẵn, không cần phải chờ đợi khi đến nơi.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-panel p-4 h-100 d-flex flex-column align-items-center shadow-sm">
                <div
                  className="mb-4 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-4 shadow-sm"
                  style={{ width: '56px', height: '56px', background: 'var(--primary-gradient)' }}
                >
                  3
                </div>
                <h5 className="fw-bold mb-2 text-heading">Xác Nhận & Nhận Mã Đặt Chỗ</h5>
                <p className="text-muted small mb-0">
                  Nhận ngay mã đặt bàn qua hệ thống, kiểm tra và tra cứu trạng thái bàn ăn bất cứ lúc nào.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/booking" className="btn-primary-custom text-decoration-none py-3 px-5 fs-6">
              <CalendarDays size={20} />
              <span>Bắt Đầu Đặt Bàn Trải Nghiệm Ngay</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-5 bg-white border-top">
        <div className="container py-2">
          <div
            className="p-5 rounded-4 position-relative overflow-hidden text-center text-md-start"
            style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              border: '1px solid #fde68a',
              boxShadow: '0 10px 25px rgba(217, 119, 6, 0.08)',
            }}
          >
            <div className="row align-items-center">
              <div className="col-md-8">
                <h3 className="fw-bold display-6 mb-2 text-heading">Bạn Muốn Tổ Chức Tiệc Hoặc Sự Kiện?</h3>
                <p className="text-muted mb-md-0">
                  Hãy liên hệ ngay với ban quản lý Ngon để nhận tư vấn set menu ưu đãi và dịch vụ chu đáo theo yêu cầu.
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <Link to="/contact" className="btn-primary-custom text-decoration-none py-3 px-4">
                  <span>Liên Hệ Tư Vấn Tiệc</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

