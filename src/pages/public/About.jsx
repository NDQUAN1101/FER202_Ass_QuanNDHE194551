import React from 'react';
import { Award, HeartHandshake, ShieldCheck, Sparkles, Utensils } from 'lucide-react';

const About = () => {
  return (
    <div className="py-5 animate-fade-in">
      <div className="container">
        {/* Hero Banner */}
        <div className="row align-items-center g-5 mb-5 pb-lg-5">
          <div className="col-lg-6">
            <span className="badge-gold mb-3 d-inline-block">Câu Chuyện Của Ngon</span>
            <h1 className="text-white fw-bold display-5 mb-4" style={{ lineHeight: 1.2 }}>
              Nghệ Thuật Ẩm Thực Thăng Hoa & Không Gian <span style={{ color: 'var(--primary-color)' }}>Thượng Hạng</span>
            </h1>
            <p className="text-muted lead mb-4" style={{ fontSize: '1.1rem' }}>
              Thành lập với khát vọng mang đến những trải nghiệm ẩm thực tinh hoa bậc nhất, Ngon không chỉ là nơi thưởng thức những đĩa thức ăn tuyệt mỹ mà còn là điểm hẹn của cảm xúc, sự gắn kết và những khoảnh khắc đáng nhớ.
            </p>
            <p className="text-muted">
              Từng miếng thịt bò Wagyu A5 nướng đá nóng, từng lát cá hồi Na-uy áp chảo hay ly vang đỏ Bordeaux hảo hạng đều được chọn lọc khắt khe và chế biến tỉ mỉ bằng cả trái tim của người đầu bếp.
            </p>
          </div>
          <div className="col-lg-6">
            <div
              className="rounded-4 overflow-hidden shadow-lg position-relative"
              style={{ border: '1px solid var(--border-color)', minHeight: '380px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80"
                alt="Ngon Restaurant Interior"
                className="w-100 h-100 object-fit-cover"
                style={{ minHeight: '380px' }}
              />
            </div>
          </div>
        </div>

        {/* 3 Core Values */}
        <div className="row g-4 mb-5 text-center">
          <div className="col-md-4">
            <div className="glass-panel p-4 h-100">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', background: 'var(--primary-light)', color: 'var(--primary-color)' }}
              >
                <Award size={30} />
              </div>
              <h4 className="text-white fw-bold mb-2">Tiêu Chuẩn 5 Sao</h4>
              <p className="text-muted small mb-0">
                Mọi công đoạn từ nhập khẩu nguyên liệu, sơ chế, chế biến đến cách bài trí đều tuân theo các quy chuẩn nhà hàng sang trọng hàng đầu thế giới.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-panel p-4 h-100">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
              >
                <Sparkles size={30} />
              </div>
              <h4 className="text-white fw-bold mb-2">Tươi Ngon Mỗi Ngày</h4>
              <p className="text-muted small mb-0">
                100% rau củ hữu cơ chuẩn VietGAP và hải sản tươi sống được cung cấp và chế biến trong ngày, không chất bảo quản.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-panel p-4 h-100">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}
              >
                <HeartHandshake size={30} />
              </div>
              <h4 className="text-white fw-bold mb-2">Phục Vụ Tận Tâm</h4>
              <p className="text-muted small mb-0">
                Đội ngũ nhân viên và quản gia tận tình, chu đáo, thấu hiểu từng sở thích và yêu cầu ăn uống riêng biệt của từng thực khách.
              </p>
            </div>
          </div>
        </div>

        {/* Master Chefs */}
        <div className="text-center pt-4 mb-4">
          <span className="badge-gold mb-2 d-inline-block">Đội Ngũ Đầu Bếp</span>
          <h2 className="text-white fw-bold display-6 mb-2">Những Nghệ Nhân Ẩm Thực</h2>
          <p className="text-muted">Các Bếp Trưởng với hơn 15 năm kinh nghiệm tại các khách sạn 5 sao quốc tế.</p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-md-4 col-sm-6">
            <div className="glass-panel p-3 text-center">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&auto=format&fit=crop&q=80"
                alt="Chef Jean-Pierre"
                className="rounded-4 mb-3 w-100 object-fit-cover"
                style={{ height: '280px' }}
              />
              <h5 className="text-white fw-bold mb-1">Chef Jean-Pierre Laurent</h5>
              <div className="text-warning small fw-semibold mb-2">Executive Head Chef</div>
              <p className="text-muted small mb-0">
                Chuyên gia ẩm thực Pháp & Địa Trung Hải với nhiều giải thưởng danh giá tại Paris.
              </p>
            </div>
          </div>

          <div className="col-md-4 col-sm-6">
            <div className="glass-panel p-3 text-center">
              <img
                src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=500&auto=format&fit=crop&q=80"
                alt="Chef Kenji Tanaka"
                className="rounded-4 mb-3 w-100 object-fit-cover"
                style={{ height: '280px' }}
              />
              <h5 className="text-white fw-bold mb-1">Chef Kenji Tanaka</h5>
              <div className="text-warning small fw-semibold mb-2">Master of Grill & Wagyu</div>
              <p className="text-muted small mb-0">
                Bậc thầy về thịt bò Wagyu và kỹ thuật nướng than hoa Binchotan trứ danh từ Tokyo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

