import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodApi, categoryApi } from '../../services/api';
import FoodCard from '../../components/common/FoodCard';
import { Utensils, CalendarDays, Award, Clock, Users, ArrowRight, ShieldCheck, Flame, Sparkles } from 'lucide-react';

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
          background: 'radial-gradient(circle at 80% 20%, rgba(226, 135, 34, 0.15) 0%, rgba(11, 15, 23, 1) 70%)',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container py-lg-4 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="badge-gold d-inline-flex align-items-center gap-2 mb-3 py-2 px-3">
                <Sparkles size={16} /> Nhà Hàng Ẩm Thực Đẳng Cấp 5 Sao
              </div>
              <h1 className="display-4 fw-bold text-white mb-4" style={{ lineHeight: 1.15 }}>
                Đỉnh Cao Phong Vị & Đặt Bàn <span style={{ color: 'var(--primary-color)' }}>Tiện Lợi</span> Trực Tuyến
              </h1>
              <p className="lead text-muted mb-4" style={{ fontSize: '1.15rem' }}>
                Khám phá bản giao hưởng ẩm thực Á - Âu tinh tế được chế biến bởi các bếp trưởng danh tiếng. Đặt trước bàn ăn lý tưởng và chọn sẵn thực đơn chỉ trong 60 giây.
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
              <div className="row g-3 pt-3 border-top border-secondary border-opacity-50">
                <div className="col-4">
                  <div className="fw-bold fs-3 text-warning">50+</div>
                  <small className="text-muted">Món Ăn Thượng Hạng</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-3 text-warning">100%</div>
                  <small className="text-muted">Nguyên Liệu Tươi Sống</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-3 text-warning">4.9/5</div>
                  <small className="text-muted">Đánh Giá Hài Lòng</small>
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
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(226, 135, 34, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80"
                    alt="DineHub Signature Wagyu"
                    className="w-100 h-100 object-fit-cover"
                    style={{ minHeight: '420px', maxHeight: '520px' }}
                  />
                </div>

                {/* Floating Highlight Card */}
                <div
                  className="glass-panel position-absolute p-3 d-none d-sm-flex align-items-center gap-3 animate-fade-in"
                  style={{
                    bottom: '-25px',
                    left: '-25px',
                    maxWidth: '300px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(226, 135, 34, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-color)',
                      flexShrink: 0,
                    }}
                  >
                    <Flame size={24} />
                  </div>
                  <div>
                    <div className="fw-bold text-white small">Món Đặc Sắc Bán Chạy</div>
                    <small className="text-warning">Bò Wagyu A5 Nướng Đá Nóng</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Chef Specials Section */}
      <section className="py-5" style={{ backgroundColor: '#0d131d' }}>
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
            <div>
              <span className="badge-gold mb-2 d-inline-block">Tuyệt Phẩm Ẩm Thực</span>
              <h2 className="text-white fw-bold display-6 mb-2">Món Ăn Nổi Bật Của Bếp Trưởng</h2>
              <p className="text-muted mb-0">Tuyển tập những món ăn được thực khách yêu thích và đặt nhiều nhất tại DineHub.</p>
            </div>
            <Link to="/menu" className="btn-outline-custom text-decoration-none mt-3 mt-md-0">
              <span>Xem Tất Cả Menu</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
              <div className="text-muted mt-2">Đang tải món ăn...</div>
            </div>
          ) : (
            <div className="row g-4">
              {specialFoods.map((food) => (
                <div key={food.id} className="col-lg-3 col-md-6">
                  <FoodCard food={food} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Restaurant Dining Spaces Showcase */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="badge-gold mb-2 d-inline-block">Không Gian Đa Dạng</span>
            <h2 className="text-white fw-bold display-6 mb-3">Trải Nghiệm Không Gian Ẩm Thực Đỉnh Cao</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
              DineHub thiết kế 3 khu vực riêng biệt để đáp ứng hoàn hảo mọi nhu cầu: từ bữa tối hẹn hò lãng mạn, tiệc họp mặt gia đình đến các buổi chiêu đãi đối tác quan trọng.
            </p>
          </div>

          <div className="row g-4">
            {/* Area 1 */}
            <div className="col-lg-4 col-md-6">
              <div
                className="h-100 rounded-4 overflow-hidden position-relative"
                style={{
                  background: '#182232',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ height: '230px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
                    alt="Sân Vườn Nhiệt Đới"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="p-4">
                  <span className="badge-green mb-2 d-inline-block">Tầng 1</span>
                  <h4 className="text-white fw-bold mb-2">Sân Vườn Thoáng Đãng</h4>
                  <p className="text-muted small mb-3">
                    Không gian mở với cây xanh nhiệt đới mát rượi, ánh đèn lung linh, lý tưởng cho các buổi tiệc nướng BBQ và trà chiều thư giãn.
                  </p>
                  <div className="d-flex align-items-center justify-content-between text-muted small pt-3 border-top border-secondary border-opacity-25">
                    <span>Sức chứa: 2 - 6 khách/bàn</span>
                    <Link to="/booking" className="text-warning fw-semibold text-decoration-none">
                      Đặt bàn này &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Area 2 */}
            <div className="col-lg-4 col-md-6">
              <div
                className="h-100 rounded-4 overflow-hidden position-relative"
                style={{
                  background: '#182232',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ height: '230px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80"
                    alt="Đại Sảnh Hoàng Gia"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="p-4">
                  <span className="badge-gold mb-2 d-inline-block">Tầng 2</span>
                  <h4 className="text-white fw-bold mb-2">Đại Sảnh Máy Lạnh Ấm Cúng</h4>
                  <p className="text-muted small mb-3">
                    Được bài trí theo phong cách tân cổ điển châu Âu, âm nhạc du dương nhẹ nhàng, phù hợp cho tiệc sinh nhật và gặp mặt bạn bè.
                  </p>
                  <div className="d-flex align-items-center justify-content-between text-muted small pt-3 border-top border-secondary border-opacity-25">
                    <span>Sức chứa: 4 - 8 khách/bàn</span>
                    <Link to="/booking" className="text-warning fw-semibold text-decoration-none">
                      Đặt bàn này &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Area 3 */}
            <div className="col-lg-4 col-md-6">
              <div
                className="h-100 rounded-4 overflow-hidden position-relative"
                style={{
                  background: '#182232',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ height: '230px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80"
                    alt="Phòng VIP Riêng Tư"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="p-4">
                  <span className="badge bg-danger mb-2 d-inline-block">Tầng 3 - VIP</span>
                  <h4 className="text-white fw-bold mb-2">Phòng VIP Panorama Hoàng Gia</h4>
                  <p className="text-muted small mb-3">
                    Không gian riêng tư tuyệt đối có quản gia phục vụ riêng, cách âm cao cấp, sở hữu view panorama ngắm trọn thành phố về đêm.
                  </p>
                  <div className="d-flex align-items-center justify-content-between text-muted small pt-3 border-top border-secondary border-opacity-25">
                    <span>Sức chứa: 10 - 15 khách</span>
                    <Link to="/booking" className="text-warning fw-semibold text-decoration-none">
                      Đặt bàn này &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps Reservation Workflow */}
      <section className="py-5" style={{ backgroundColor: '#0d131d' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge-gold mb-2 d-inline-block">Dịch Vụ Nhanh Chóng</span>
            <h2 className="text-white fw-bold display-6 mb-3">Quy Trình Đặt Bàn Chỉ Với 3 Bước</h2>
            <p className="text-muted">Đơn giản, chuẩn xác và giữ chỗ ngay tức thì.</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="glass-panel p-4 h-100 d-flex flex-column align-items-center">
                <div
                  className="mb-4 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-4"
                  style={{ width: '60px', height: '60px', background: 'var(--primary-gradient)' }}
                >
                  1
                </div>
                <h5 className="text-white fw-bold mb-2">Chọn Thời Gian & Khu Vực</h5>
                <p className="text-muted small mb-0">
                  Lựa chọn ngày giờ dự tiệc, số lượng khách đi cùng và vị trí bàn mong muốn tại nhà hàng.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-panel p-4 h-100 d-flex flex-column align-items-center">
                <div
                  className="mb-4 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-4"
                  style={{ width: '60px', height: '60px', background: 'var(--primary-gradient)' }}
                >
                  2
                </div>
                <h5 className="text-white fw-bold mb-2">Chọn Món Ăn Trước (Tùy Chọn)</h5>
                <p className="text-muted small mb-0">
                  Lên trước thực đơn yêu thích để đầu bếp chuẩn bị sẵn, không cần phải chờ đợi khi đến nơi.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-panel p-4 h-100 d-flex flex-column align-items-center">
                <div
                  className="mb-4 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-4"
                  style={{ width: '60px', height: '60px', background: 'var(--primary-gradient)' }}
                >
                  3
                </div>
                <h5 className="text-white fw-bold mb-2">Xác Nhận & Nhận Mã Đặt Chỗ</h5>
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
      <section className="py-5">
        <div className="container py-2">
          <div
            className="p-5 rounded-4 position-relative overflow-hidden text-center text-md-start"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(226, 135, 34, 0.3)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div className="row align-items-center">
              <div className="col-md-8">
                <h3 className="text-white fw-bold display-6 mb-2">Bạn Muốn Tổ Chức Tiệc Hoặc Sự Kiện?</h3>
                <p className="text-muted mb-md-0">
                  Hãy liên hệ ngay với quản lý DineHub để nhận bảng giá set menu ưu đãi và dịch vụ trang trí tiệc theo yêu cầu.
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
