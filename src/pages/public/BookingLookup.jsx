import React, { useState } from 'react';
import { reservationApi, tableApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Calendar, Clock, MapPin, Users, AlertCircle, XCircle } from 'lucide-react';

const BookingLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) {
      addToast('Vui lòng nhập Mã đặt bàn hoặc Số điện thoại để tra cứu!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await reservationApi.getByIdOrPhone(searchTerm);
      setResults(data);
    } catch (err) {
      console.error(err);
      addToast('Không thể kết nối đến máy chủ. Đang hiển thị dữ liệu mẫu.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (resId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn đặt bàn ' + resId + ' này không?')) {
      try {
        await reservationApi.updateStatus(resId, 'Cancelled');
        addToast('Đã hủy đơn đặt bàn thành công!', 'success');
        // Update state locally
        setResults(prev => prev.map(r => r.id === resId ? { ...r, status: 'Cancelled' } : r));
      } catch (err) {
        console.error(err);
        addToast('Lỗi khi hủy đơn!', 'danger');
      }
    }
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge-green">Đã Xác Nhận</span>;
      case 'Completed':
        return <span className="badge bg-primary">Đã Hoàn Thành</span>;
      case 'Cancelled':
        return <span className="badge bg-danger">Đã Hủy</span>;
      default:
        return <span className="badge-gold">Chờ Duyệt (Pending)</span>;
    }
  };

  return (
    <div className="py-5 animate-fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge-gold mb-2 d-inline-block">Tra Cứu Lịch Hẹn</span>
          <h1 className="text-white fw-bold display-5 mb-2">Kiểm Tra Đơn Đặt Bàn</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Nhập Mã đặt chỗ (ví dụ: <code>DH-20261016-01</code>) hoặc Số điện thoại dùng khi đăng ký để kiểm tra tình trạng bàn ăn của quý khách.
          </p>
        </div>

        {/* Search Bar Box */}
        <div
          className="p-4 rounded-4 mb-5"
          style={{ backgroundColor: '#131b26', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
        >
          <form onSubmit={handleSearch} className="row g-3">
            <div className="col-md-9">
              <div className="position-relative">
                <Search
                  size={20}
                  className="position-absolute text-muted"
                  style={{ top: '50%', left: '16px', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  className="form-control form-control-custom ps-5 py-3"
                  placeholder="Nhập Mã đặt bàn (DH-...) hoặc Số điện thoại của bạn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary-custom w-100 h-100 justify-content-center py-3 fs-6"
              >
                {loading ? <span className="spinner-border spinner-border-sm"></span> : <span>Tra Cứu Ngay</span>}
              </button>
            </div>
          </form>

          {/* Quick Test Demo Button */}
          <div className="mt-3 pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center gap-2 small text-muted">
            <span>Gợi ý tra cứu mẫu:</span>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('0987654321');
                reservationApi.getByIdOrPhone('0987654321').then(data => setResults(data));
              }}
              className="btn btn-sm btn-outline-warning py-0 px-2 rounded-pill"
            >
              Thử số 0987654321
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('DH-20261016-01');
                reservationApi.getByIdOrPhone('DH-20261016-01').then(data => setResults(data));
              }}
              className="btn btn-sm btn-outline-warning py-0 px-2 rounded-pill"
            >
              Thử mã DH-20261016-01
            </button>
          </div>
        </div>

        {/* Results Area */}
        {results !== null && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">
                Kết Quả Tìm Kiếm ({results.length})
              </h5>
            </div>

            {results.length === 0 ? (
              <div className="glass-panel p-5 text-center my-3">
                <AlertCircle size={44} className="text-warning mb-3 opacity-50" />
                <h5 className="text-white fw-bold">Không tìm thấy đơn đặt bàn nào</h5>
                <p className="text-muted small">
                  Quý khách vui lòng kiểm tra lại chính xác Mã đơn hoặc Số điện thoại đã đăng ký.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {results.map((res) => (
                  <div
                    key={res.id}
                    className="glass-panel p-4 position-relative"
                    style={{ border: '1px solid var(--border-color)' }}
                  >
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2 pb-3 mb-3 border-bottom border-secondary border-opacity-25">
                      <div>
                        <div className="small text-muted">Mã Đặt Bàn:</div>
                        <span className="fs-5 fw-bold text-warning">{res.id}</span>
                        <div className="text-white fw-medium mt-1">Khách hàng: {res.customerName}</div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {renderStatusBadge(res.status)}
                        {res.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelBooking(res.id)}
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                            title="Hủy đặt bàn"
                          >
                            <XCircle size={14} />
                            <span>Hủy bàn</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-4 col-sm-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <Calendar size={15} className="text-warning" />
                          <span>Thời gian dùng bữa:</span>
                        </div>
                        <div className="text-light fw-medium">
                          {res.timeSlot} - {res.date}
                        </div>
                      </div>

                      <div className="col-md-4 col-sm-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <Users size={15} className="text-warning" />
                          <span>Số lượng khách:</span>
                        </div>
                        <div className="text-light fw-medium">{res.guestsCount} người</div>
                      </div>

                      <div className="col-md-4 col-sm-6">
                        <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                          <MapPin size={15} className="text-warning" />
                          <span>Số điện thoại:</span>
                        </div>
                        <div className="text-light fw-medium">{res.phone}</div>
                      </div>
                    </div>

                    {/* Pre-ordered dishes if any */}
                    {res.orderItems && res.orderItems.length > 0 && (
                      <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
                        <div className="small text-muted mb-2">Món ăn chuẩn bị trước:</div>
                        <div className="d-flex flex-wrap gap-2">
                          {res.orderItems.map((item, idx) => (
                            <span
                              key={idx}
                              className="badge bg-dark border border-secondary px-3 py-2 text-light"
                            >
                              {item.foodName} &times; <strong>{item.quantity}</strong> ({formatVND(item.total)})
                            </span>
                          ))}
                        </div>
                        <div className="small text-warning fw-bold mt-2">
                          Tổng tiền: {formatVND(res.totalAmount)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingLookup;
