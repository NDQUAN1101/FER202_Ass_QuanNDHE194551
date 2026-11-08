import React, { useState, useEffect } from 'react';
import { reservationApi, tableApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Calendar, Clock, Check, X, CheckCheck, Eye, Users } from 'lucide-react';

const AdminBookings = () => {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeReservation, setActiveReservation] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resData, tablesData] = await Promise.all([
        reservationApi.getAll(),
        tableApi.getAll(),
      ]);
      setReservations(resData);
      setTables(tablesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (resId, newStatus) => {
    try {
      await reservationApi.updateStatus(resId, newStatus);
      setReservations(prev =>
        prev.map(r => r.id === resId ? { ...r, status: newStatus } : r)
      );
      addToast(`Đã chuyển trạng thái đơn ${resId} sang "${newStatus}"!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Lỗi khi cập nhật trạng thái đơn!', 'danger');
    }
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filtered = reservations.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="animate-fade-in">
      {/* Title */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="text-white fw-bold mb-1">Quản Lý Lịch Đặt Bàn</h2>
          <p className="text-muted small mb-0">Duyệt yêu cầu đặt chỗ, theo dõi bàn ăn và món đặt trước của khách</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <div className="position-relative">
              <Search
                size={18}
                className="position-absolute text-muted"
                style={{ top: '50%', left: '14px', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-control form-control-custom ps-5"
                placeholder="Tìm theo Mã đơn, Tên khách hoặc SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-7 d-flex flex-wrap gap-2 justify-content-md-end">
            {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`btn btn-sm px-3 py-1 rounded-pill fw-semibold ${
                  filterStatus === st
                    ? 'btn-warning text-dark'
                    : 'btn-dark text-light border border-secondary border-opacity-50'
                }`}
              >
                {st === 'all'
                  ? 'Tất Cả'
                  : st === 'Pending'
                  ? 'Chờ Duyệt'
                  : st === 'Confirmed'
                  ? 'Đã Duyệt'
                  : st === 'Completed'
                  ? 'Hoàn Thành'
                  : 'Đã Hủy'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel p-3 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            Không có đơn đặt bàn nào theo tiêu chí tìm kiếm.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
              <thead>
                <tr className="border-secondary text-muted small">
                  <th>MÃ ĐƠN</th>
                  <th>KHÁCH HÀNG</th>
                  <th>SỐ ĐIỆN THOẠI</th>
                  <th>LỊCH HẸN</th>
                  <th>SỐ KHÁCH</th>
                  <th>MÓN ĐẶT</th>
                  <th>TRẠNG THÁI</th>
                  <th className="text-end">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(res => {
                  return (
                    <tr key={res.id} className="border-secondary border-opacity-25">
                      <td>
                        <span className="fw-bold text-warning">{res.id}</span>
                      </td>
                      <td>
                        <div className="text-white fw-medium">{res.customerName}</div>
                        <small className="text-muted">{res.email}</small>
                      </td>
                      <td className="text-light">{res.phone}</td>
                      <td>
                        <div className="text-white">{res.timeSlot}</div>
                        <small className="text-muted">{res.date}</small>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{res.guestsCount} khách</span>
                      </td>
                      <td>
                        {res.orderItems && res.orderItems.length > 0 ? (
                          <button
                            onClick={() => setActiveReservation(res)}
                            className="btn btn-sm btn-outline-warning py-0 px-2 rounded-pill small"
                          >
                            <Eye size={12} className="me-1" />
                            {res.orderItems.length} món ({formatVND(res.totalAmount)})
                          </button>
                        ) : (
                          <span className="text-muted small">Không chọn trước</span>
                        )}
                      </td>
                      <td>
                        {res.status === 'Confirmed' ? (
                          <span className="badge-green">Đã duyệt</span>
                        ) : res.status === 'Completed' ? (
                          <span className="badge bg-primary">Hoàn thành</span>
                        ) : res.status === 'Cancelled' ? (
                          <span className="badge bg-danger">Đã hủy</span>
                        ) : (
                          <span className="badge-gold">Chờ duyệt</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          {res.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'Confirmed')}
                              className="btn btn-sm btn-success py-1 px-2"
                              title="Duyệt đơn"
                            >
                              <Check size={14} /> Duyệt
                            </button>
                          )}
                          {res.status === 'Confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'Completed')}
                              className="btn btn-sm btn-primary py-1 px-2"
                              title="Hoàn thành tiệc"
                            >
                              <CheckCheck size={14} /> Hoàn Tất
                            </button>
                          )}
                          {res.status !== 'Cancelled' && res.status !== 'Completed' && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'Cancelled')}
                              className="btn btn-sm btn-outline-danger py-1 px-2"
                              title="Hủy đơn"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reservation Details Modal */}
      {activeReservation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setActiveReservation(null)}
        >
          <div
            className="p-4 rounded-4 animate-fade-in"
            style={{ maxWidth: '520px', width: '100%', backgroundColor: '#131b26', border: '1px solid var(--border-color)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
              <h5 className="text-white fw-bold mb-0">
                Chi Tiết Đơn Đặt Bàn {activeReservation.id}
              </h5>
              <button
                onClick={() => setActiveReservation(null)}
                className="btn btn-sm btn-outline-secondary rounded-circle"
              >
                &times;
              </button>
            </div>

            <div className="mb-3">
              <div className="text-white fw-bold">{activeReservation.customerName} - {activeReservation.phone}</div>
              <div className="text-muted small">
                Lịch: {activeReservation.timeSlot} ngày {activeReservation.date} ({activeReservation.guestsCount} khách)
              </div>
              {activeReservation.specialRequest && (
                <div className="text-warning small fst-italic mt-1">
                  Yêu cầu: "{activeReservation.specialRequest}"
                </div>
              )}
            </div>

            <h6 className="text-white fw-bold mb-2">Món ăn đặt chuẩn bị sẵn:</h6>
            <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {activeReservation.orderItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="d-flex justify-content-between p-2 rounded"
                  style={{ backgroundColor: '#1c2636' }}
                >
                  <span className="text-light small">
                    {item.foodName} &times; <strong>{item.quantity}</strong>
                  </span>
                  <span className="text-warning fw-bold small">
                    {formatVND(item.total)}
                  </span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
              <span className="text-muted small">Tổng tiền:</span>
              <span className="text-warning fw-bold fs-5">{formatVND(activeReservation.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
