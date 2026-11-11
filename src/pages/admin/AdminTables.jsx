import React, { useState, useEffect } from 'react';
import { tableApi, reservationApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Users, RefreshCw, CheckCircle, Ban, Calendar, Clock, Phone, UserCheck, X } from 'lucide-react';

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tablesData, resData] = await Promise.all([
        tableApi.getAll(),
        reservationApi.getAll(),
      ]);
      setTables(tablesData);
      setReservations(resData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (table) => {
    const nextStatus = table.status === 'Available' ? 'Reserved' : 'Available';
    try {
      await tableApi.updateStatus(table.id, nextStatus);
      setTables(prev =>
        prev.map(t => t.id === table.id ? { ...t, status: nextStatus } : t)
      );
      addToast(`Đã chuyển ${table.code} sang trạng thái "${nextStatus === 'Available' ? 'Bàn trống' : 'Đã có khách đặt'}"!`, 'info');
    } catch (err) {
      console.error(err);
      addToast('Lỗi khi cập nhật trạng thái bàn!', 'danger');
    }
  };

  // Tìm đơn đặt bàn tương ứng với từng bàn (lọc đơn chưa hủy)
  const getTableBooking = (tableId) => {
    return reservations.find(r => r.tableId === tableId && r.status !== 'Cancelled');
  };

  const availableCount = tables.filter(t => t.status === 'Available').length;
  const reservedCount = tables.filter(t => t.status === 'Reserved').length;

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="animate-fade-in">
      {/* Title */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="text-heading fw-bold mb-1">Sơ Đồ Quản Lý Bàn Ăn</h2>
          <p className="text-muted small mb-0">Theo dõi trực quan thời gian đặt, khách hàng và trạng thái từng bàn ăn</p>
        </div>
        <button onClick={loadData} className="btn-outline-custom d-flex align-items-center gap-1 small py-2">
          <RefreshCw size={15} /> Làm Mới Dữ Liệu
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="glass-panel p-3 text-center bg-white shadow-sm">
            <span className="text-muted small">Tổng Số Bàn:</span>
            <div className="fs-3 fw-bold text-heading mt-1">{tables.length} Bàn</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-panel p-3 text-center bg-white shadow-sm">
            <span className="text-muted small">Bàn Đang Trống (Available):</span>
            <div className="fs-3 fw-bold text-success mt-1">{availableCount} Bàn</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-panel p-3 text-center bg-white shadow-sm">
            <span className="text-muted small">Bàn Đã Đặt / Có Khách (Reserved):</span>
            <div className="fs-3 fw-bold text-warning mt-1">{reservedCount} Bàn</div>
          </div>
        </div>
      </div>

      {/* Tables Grid Grouped */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          <div className="glass-panel p-4 bg-white shadow-sm">
            <h5 className="text-heading fw-bold mb-3 pb-2 border-bottom">
              Danh Sách Bàn Ăn Nhà Hàng
            </h5>
            <div className="row g-3">
              {tables.map(table => {
                const booking = getTableBooking(table.id);
                // Bàn có khách đặt hoặc admin bấm chuyển sang Reserved
                const isAvail = table.status === 'Available' && !booking;

                return (
                  <div key={table.id} className="col-xl-3 col-lg-4 col-sm-6">
                    <div
                      className="p-3 rounded-4 h-100 position-relative transition-all shadow-sm d-flex flex-column justify-content-between"
                      style={{
                        backgroundColor: isAvail ? '#f0fdf4' : '#fffbeb',
                        border: isAvail ? '1.5px solid #86efac' : '1.5px solid #fde047',
                      }}
                    >
                      <div>
                        {/* Top: Mã bàn & Huy hiệu trạng thái */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold fs-5 text-heading">{table.code}</span>
                          <span className={isAvail ? 'badge-green' : 'badge-gold'}>
                            {isAvail ? 'Đang trống' : 'Đã có khách'}
                          </span>
                        </div>

                        <div className="text-muted small mb-2">{table.area}</div>

                        <div className="d-flex align-items-center gap-1 text-secondary small mb-2">
                          <Users size={14} className="text-warning" />
                          <span className="fw-semibold">Sức chứa: {table.capacity} khách</span>
                        </div>

                        {/* HIỂN THỊ THỜI GIAN & KHÁCH ĐẶT */}
                        {booking ? (
                          <div
                            className="p-2 rounded-3 mb-3 bg-white border border-warning border-opacity-50"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedBookingDetail({ table, booking })}
                            title="Bấm để xem chi tiết đơn đặt"
                          >
                            <div className="d-flex align-items-center gap-1 text-warning fw-bold small mb-1">
                              <Clock size={14} />
                              <span>{booking.timeSlot}</span>
                              <span className="text-muted fw-normal">({booking.date})</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between text-dark small">
                              <span className="fw-semibold text-truncate" style={{ maxWidth: '140px' }}>
                                👤 {booking.customerName}
                              </span>
                              <span className="badge bg-warning bg-opacity-25 text-dark" style={{ fontSize: '0.7rem' }}>
                                {booking.guestsCount} khách
                              </span>
                            </div>
                            {booking.orderItems && booking.orderItems.length > 0 && (
                              <div className="text-muted small mt-1" style={{ fontSize: '0.72rem' }}>
                                🍽️ Đã chọn trước {booking.orderItems.length} món
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="p-2 rounded-3 mb-3 bg-white border border-success border-opacity-25 text-center text-success small fw-medium"
                          >
                            ✓ Chưa có lịch hẹn nào
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleToggleStatus(table)}
                        className={`btn btn-sm w-100 d-flex align-items-center justify-content-center gap-1 py-2 rounded-3 fw-semibold ${
                          isAvail
                            ? 'btn-outline-warning text-dark bg-white border shadow-sm'
                            : 'btn-success text-white border-0 shadow-sm'
                        }`}
                        style={{ fontSize: '0.82rem' }}
                      >
                        {isAvail ? (
                          <>
                            <Ban size={14} />
                            <span>Khóa bàn / Đã có khách</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} />
                            <span>Mở bàn / Chuyển sang trống</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Booking Quick Detail Modal */}
      {selectedBookingDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setSelectedBookingDetail(null)}
        >
          <div
            className="p-4 rounded-4 bg-white shadow-lg animate-fade-in"
            style={{ maxWidth: '480px', width: '100%', border: '1px solid var(--border-color)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
              <h5 className="fw-bold mb-0 text-heading">
                Chi Tiết Đặt Bàn {selectedBookingDetail.table.code}
              </h5>
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="btn btn-sm btn-light border rounded-circle"
                style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="d-flex flex-column gap-2 small mb-4">
              <div className="d-flex justify-content-between pb-2 border-bottom">
                <span className="text-muted">Mã đặt bàn:</span>
                <span className="fw-bold text-warning">{selectedBookingDetail.booking.id}</span>
              </div>
              <div className="d-flex justify-content-between pb-2 border-bottom">
                <span className="text-muted">Khách hàng:</span>
                <span className="fw-bold text-heading">{selectedBookingDetail.booking.customerName}</span>
              </div>
              <div className="d-flex justify-content-between pb-2 border-bottom">
                <span className="text-muted">Số điện thoại:</span>
                <span className="fw-semibold text-heading">{selectedBookingDetail.booking.phone}</span>
              </div>
              <div className="d-flex justify-content-between pb-2 border-bottom">
                <span className="text-muted">Thời gian đến:</span>
                <span className="fw-bold text-warning">
                  {selectedBookingDetail.booking.timeSlot} - {selectedBookingDetail.booking.date}
                </span>
              </div>
              <div className="d-flex justify-content-between pb-2 border-bottom">
                <span className="text-muted">Số lượng khách:</span>
                <span className="fw-semibold text-heading">{selectedBookingDetail.booking.guestsCount} người</span>
              </div>

              {selectedBookingDetail.booking.specialRequest && (
                <div className="p-2 rounded bg-light border mt-2">
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Yêu cầu đặc biệt:</div>
                  <div className="fst-italic text-dark">"{selectedBookingDetail.booking.specialRequest}"</div>
                </div>
              )}

              {selectedBookingDetail.booking.orderItems && selectedBookingDetail.booking.orderItems.length > 0 && (
                <div className="mt-2 pt-2 border-top">
                  <div className="fw-bold text-heading mb-2">Món ăn chuẩn bị trước:</div>
                  <div className="d-flex flex-column gap-1">
                    {selectedBookingDetail.booking.orderItems.map((item, i) => (
                      <div key={i} className="d-flex justify-content-between text-secondary">
                        <span>{item.foodName} &times; {item.quantity}</span>
                        <span className="fw-bold text-warning">{formatVND(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBookingDetail(null)}
              className="btn btn-primary-custom w-100 justify-content-center py-2"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTables;
