import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodApi, reservationApi, tableApi } from '../../services/api';
import { Utensils, CalendarCheck, DollarSign, Grid, ArrowUpRight, Plus, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const [foods, setFoods] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsData, resData, tablesData] = await Promise.all([
          foodApi.getAll(),
          reservationApi.getAll(),
          tableApi.getAll(),
        ]);
        setFoods(foodsData);
        setReservations(resData);
        setTables(tablesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const pendingCount = reservations.filter(r => r.status === 'Pending').length;
  const availableTablesCount = tables.filter(t => t.status === 'Available').length;

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="animate-fade-in">
      {/* Page Title & Action */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="text-heading fw-bold mb-1">Bảng Tổng Quan Hoạt Động</h2>
          <p className="text-muted small mb-0">Theo dõi doanh thu, tình trạng bàn ăn và lịch đặt bàn hôm nay</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/foods/create" className="btn-primary-custom text-decoration-none py-2 px-3 small">
            <Plus size={16} /> Thêm Món Ăn Mới
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="row g-3 mb-4">
        {/* Metric 1 */}
        <div className="col-xl-3 col-sm-6">
          <div className="glass-panel p-3 h-100 position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-medium">Tổng Đơn Đặt Bàn</span>
              <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                <CalendarCheck size={20} />
              </div>
            </div>
            <div className="fs-3 fw-bold text-heading mb-1">{reservations.length}</div>
            <div className="small text-warning">
              {pendingCount} đơn chờ duyệt xác nhận
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="col-xl-3 col-sm-6">
          <div className="glass-panel p-3 h-100 position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-medium">Doanh Thu Dự Kiến</span>
              <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="fs-3 fw-bold text-heading mb-1">{formatVND(totalRevenue)}</div>
            <div className="small text-success">Từ các món ăn đặt trước</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="col-xl-3 col-sm-6">
          <div className="glass-panel p-3 h-100 position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-medium">Bàn Ăn Sẵn Sàng</span>
              <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                <Grid size={20} />
              </div>
            </div>
            <div className="fs-3 fw-bold text-heading mb-1">
              {availableTablesCount} / {tables.length}
            </div>
            <div className="small text-muted">Bàn trống đang có thể nhận khách</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="col-xl-3 col-sm-6">
          <div className="glass-panel p-3 h-100 position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-medium">Thực Đơn Nhà Hàng</span>
              <div className="p-2 rounded-3 bg-danger bg-opacity-10 text-danger">
                <Utensils size={20} />
              </div>
            </div>
            <div className="fs-3 fw-bold text-heading mb-1">{foods.length} Món</div>
            <div className="small text-muted">Bao gồm 5 danh mục ẩm thực</div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="glass-panel p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-heading fw-bold mb-0">Lịch Đặt Bàn Gần Đây</h5>
          <Link to="/admin/bookings" className="text-warning small text-decoration-none fw-semibold">
            Xem Tất Cả &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-light border table-hover mb-0 align-middle" style={{ backgroundColor: 'transparent' }}>
              <thead>
                <tr className="border-secondary text-muted small">
                  <th>MÃ ĐƠN</th>
                  <th>KHÁCH HÀNG</th>
                  <th>SỐ ĐIỆN THOẠI</th>
                  <th>NGÀY & GIỜ</th>
                  <th>SỐ KHÁCH</th>
                  <th>TIỀN MÓN</th>
                  <th>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {reservations.slice(0, 5).map((res) => (
                  <tr key={res.id} className="border-secondary border-opacity-25">
                    <td>
                      <span className="fw-bold text-warning">{res.id}</span>
                    </td>
                    <td className="text-heading fw-medium">{res.customerName}</td>
                    <td className="text-muted">{res.phone}</td>
                    <td className="text-secondary">
                      {res.timeSlot} - {res.date}
                    </td>
                    <td>{res.guestsCount} khách</td>
                    <td className="text-warning fw-bold">{formatVND(res.totalAmount)}</td>
                    <td>
                      {res.status === 'Confirmed' ? (
                        <span className="badge-green">Đã xác nhận</span>
                      ) : res.status === 'Completed' ? (
                        <span className="badge bg-primary">Hoàn thành</span>
                      ) : res.status === 'Cancelled' ? (
                        <span className="badge bg-danger">Đã hủy</span>
                      ) : (
                        <span className="badge-gold">Chờ duyệt</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

