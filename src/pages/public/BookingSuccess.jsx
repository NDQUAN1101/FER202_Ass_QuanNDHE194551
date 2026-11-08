import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Copy, Calendar, Clock, MapPin, Printer, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const BookingSuccess = () => {
  const location = useLocation();
  const { addToast } = useToast();
  const reservation = location.state?.reservation;
  const table = location.state?.table;

  if (!reservation) {
    return <Navigate to="/booking" replace />;
  }

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(reservation.id);
    addToast('Đã sao chép mã đặt bàn: ' + reservation.id, 'success');
  };

  return (
    <div className="py-5 animate-fade-in">
      <div className="container" style={{ maxWidth: '780px' }}>
        <div
          className="glass-panel p-4 p-md-5 text-center position-relative overflow-hidden"
          style={{ border: '1px solid rgba(16, 185, 129, 0.4)' }}
        >
          {/* Animated Success Badge */}
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
            }}
          >
            <CheckCircle2 size={44} color="#ffffff" />
          </div>

          <h2 className="text-white fw-bold display-6 mb-2">Đặt Bàn Thành Công!</h2>
          <p className="text-muted mb-4">
            Cảm ơn quý khách <strong>{reservation.customerName}</strong> đã lựa chọn DineHub. Nhân viên chăm sóc khách hàng sẽ liên hệ xác nhận bàn trong vòng 10 phút.
          </p>

          {/* Reservation Code Box */}
          <div
            className="p-3 rounded-4 d-inline-flex align-items-center gap-3 mb-4"
            style={{ backgroundColor: '#131b26', border: '1px dashed var(--primary-color)' }}
          >
            <div>
              <div className="small text-muted">Mã Đặt Bàn Của Quý Khách:</div>
              <div className="fs-4 text-warning fw-bold letter-spacing-1">{reservation.id}</div>
            </div>
            <button
              onClick={handleCopyCode}
              className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1 rounded-3"
            >
              <Copy size={15} />
              <span>Sao chép</span>
            </button>
          </div>

          {/* Details breakdown card */}
          <div
            className="text-start p-4 rounded-3 mb-4"
            style={{ backgroundColor: '#182232', border: '1px solid var(--border-color)' }}
          >
            <h5 className="text-white fw-bold mb-3 pb-2 border-bottom border-secondary border-opacity-25">
              Tóm Tắt Lịch Hẹn
            </h5>

            <div className="row g-3">
              <div className="col-sm-6">
                <div className="small text-muted">Thời gian đến:</div>
                <div className="text-white fw-medium">
                  {reservation.timeSlot} - Ngày {reservation.date}
                </div>
              </div>

              <div className="col-sm-6">
                <div className="small text-muted">Bàn & Khu vực:</div>
                <div className="text-warning fw-medium">
                  {table?.code || 'Bàn tiêu chuẩn'} ({table?.area || 'Nhà hàng'})
                </div>
              </div>

              <div className="col-sm-6">
                <div className="small text-muted">Số lượng khách:</div>
                <div className="text-white fw-medium">{reservation.guestsCount} người</div>
              </div>

              <div className="col-sm-6">
                <div className="small text-muted">Trạng thái:</div>
                <div>
                  <span className="badge bg-warning text-dark fw-bold">Chờ xác nhận (Pending)</span>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="small text-muted">Số điện thoại liên hệ:</div>
                <div className="text-white fw-medium">{reservation.phone}</div>
              </div>

              <div className="col-sm-6">
                <div className="small text-muted">Email xác nhận:</div>
                <div className="text-white fw-medium">{reservation.email}</div>
              </div>

              {reservation.specialRequest && (
                <div className="col-12">
                  <div className="small text-muted">Yêu cầu đặc biệt:</div>
                  <div className="text-light fst-italic">"{reservation.specialRequest}"</div>
                </div>
              )}
            </div>

            {/* Pre-ordered items if any */}
            {reservation.orderItems && reservation.orderItems.length > 0 && (
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                <h6 className="text-white fw-bold mb-2">Món Ăn Chuẩn Bị Sẵn:</h6>
                <div className="d-flex flex-column gap-2 mb-2">
                  {reservation.orderItems.map((item, idx) => (
                    <div key={idx} className="d-flex justify-content-between text-light small">
                      <span>{item.foodName} &times; {item.quantity}</span>
                      <span className="text-warning fw-bold">{formatVND(item.total)}</span>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between text-white fw-bold pt-2 border-top border-secondary border-opacity-25">
                  <span>Tổng tiền món:</span>
                  <span className="text-warning fs-6">{formatVND(reservation.totalAmount)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button
              onClick={() => window.print()}
              className="btn-outline-custom d-flex align-items-center gap-2"
            >
              <Printer size={16} />
              <span>In Phiếu Đặt Bàn</span>
            </button>

            <Link
              to="/booking-lookup"
              className="btn btn-dark text-light border border-secondary d-flex align-items-center gap-2 px-3 py-2 rounded-3"
            >
              <span>Tra Cứu Tiến Độ Đơn</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/" className="btn-primary-custom text-decoration-none">
              <span>Về Trang Chủ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
