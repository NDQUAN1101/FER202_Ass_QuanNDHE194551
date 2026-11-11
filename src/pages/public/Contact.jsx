import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Tư vấn tiệc / sự kiện',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      addToast('Vui lòng điền đầy đủ các trường bắt buộc!', 'warning');
      return;
    }
    setSubmitted(true);
    addToast('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.', 'success');
  };

  return (
    <div className="py-5 animate-fade-in">
      <div className="container">
        {/* Title */}
        <div className="text-center mb-5">
          <span className="badge-gold mb-2 d-inline-block">Kết Nối Với Chúng Tôi</span>
          <h1 className="text-heading fw-bold display-5 mb-2">Liên Hệ & Hỗ Trợ Đặt Tiệc</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Quý khách có thắc mắc hoặc cần tư vấn tổ chức sự kiện đặc biệt, đừng ngần ngại gửi lời nhắn cho Ngon.
          </p>
        </div>

        <div className="row g-5">
          {/* Contact Information & Map */}
          <div className="col-lg-5">
            <div className="glass-panel p-4 h-100">
              <h4 className="text-heading fw-bold mb-4">Thông Tin Nhà Hàng</h4>

              <div className="d-flex flex-column gap-4 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-3 p-2 d-flex align-items-center justify-content-center text-warning"
                    style={{ backgroundColor: 'rgba(226, 135, 34, 0.15)', width: '42px', height: '42px', flexShrink: 0 }}
                  >
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h6 className="text-heading fw-bold mb-1">Địa Chỉ Nhà Hàng</h6>
                    <p className="text-muted small mb-0">
                      Khu Công Nghệ Cao Hòa Lạc, Huyện Thạch Thất, TP. Hà Nội (FPT University Hà Nội)
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-3 p-2 d-flex align-items-center justify-content-center text-warning"
                    style={{ backgroundColor: 'rgba(226, 135, 34, 0.15)', width: '42px', height: '42px', flexShrink: 0 }}
                  >
                    <Phone size={22} />
                  </div>
                  <div>
                    <h6 className="text-heading fw-bold mb-1">Hotline Đặt Bàn</h6>
                    <p className="text-muted small mb-0">0987 654 321 - 1900 6868</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-3 p-2 d-flex align-items-center justify-content-center text-warning"
                    style={{ backgroundColor: 'rgba(226, 135, 34, 0.15)', width: '42px', height: '42px', flexShrink: 0 }}
                  >
                    <Mail size={22} />
                  </div>
                  <div>
                    <h6 className="text-heading fw-bold mb-1">Hòm Thư Điện Tử</h6>
                    <p className="text-muted small mb-0">contact@ngon.vn</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-3 p-2 d-flex align-items-center justify-content-center text-warning"
                    style={{ backgroundColor: 'rgba(226, 135, 34, 0.15)', width: '42px', height: '42px', flexShrink: 0 }}
                  >
                    <Clock size={22} />
                  </div>
                  <div>
                    <h6 className="text-heading fw-bold mb-1">Thời Gian Hoạt Động</h6>
                    <p className="text-muted small mb-0">
                      Thứ Hai - Chủ Nhật: 10:00 - 23:00 (Kể cả ngày lễ)
                    </p>
                  </div>
                </div>
              </div>

              {/* Map embed simulation */}
              <div
                className="rounded-3 overflow-hidden position-relative mt-2"
                style={{ height: '180px', border: '1px solid var(--border-color)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80"
                  alt="Restaurant Location Map"
                  className="w-100 h-100 object-fit-cover"
                />
                <div
                  className="position-absolute inset-0 d-flex align-items-center justify-content-center text-center p-3"
                  style={{ top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
                >
                  <div className="text-heading small fw-semibold">
                    📍 Vị trí đắc địa - Có bãi đỗ xe ô tô và xe máy rộng rãi miễn phí
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="col-lg-7">
            <div className="glass-panel p-4 p-md-5">
              <h4 className="text-heading fw-bold mb-3">Gửi Thắc Mắc & Góp Ý</h4>
              <p className="text-muted small mb-4">
                Đội ngũ lễ tân và quản lý Ngon sẽ phản hồi lại bạn qua số điện thoại hoặc email trong vòng 30 phút.
              </p>

              {submitted ? (
                <div className="text-center py-5">
                  <CheckCircle size={56} className="text-success mb-3" />
                  <h4 className="text-heading fw-bold mb-2">Đã Gửi Tin Nhắn Thành Công!</h4>
                  <p className="text-muted small mb-4">
                    Cảm ơn bạn đã liên hệ với Ngon. Chúng tôi sẽ liên lạc với bạn trong thời gian sớm nhất.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', email: '', subject: 'Tư vấn tiệc / sự kiện', message: '' });
                    }}
                    className="btn-outline-custom"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-medium">
                      Họ và tên <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      placeholder="VD: Nguyễn Văn A"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-medium">
                      Số điện thoại <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control form-control-custom"
                      placeholder="VD: 0987654321"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-medium">Địa chỉ Email</label>
                    <input
                      type="email"
                      className="form-control form-control-custom"
                      placeholder="VD: example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-medium">Chủ đề cần tư vấn</label>
                    <select
                      className="form-select form-select-custom"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="Tư vấn tiệc / sự kiện">Tư vấn tiệc sinh nhật / sự kiện</option>
                      <option value="Đặt phòng VIP">Đặt phòng VIP riêng tư</option>
                      <option value="Góp ý chất lượng">Góp ý chất lượng món ăn & phục vụ</option>
                      <option value="Hợp tác kinh doanh">Hợp tác kinh doanh & nhà cung cấp</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label text-secondary small fw-medium">
                      Nội dung tin nhắn <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="form-control form-control-custom"
                      placeholder="Nhập nội dung bạn cần hỗ trợ chi tiết..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn-primary-custom w-100 justify-content-center py-3 fs-6">
                      <Send size={18} />
                      <span>Gửi Lời Nhắn Ngay</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


