import React, { useState, useEffect } from 'react';
import { tableApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Grid, Users, RefreshCw, CheckCircle, Ban } from 'lucide-react';

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await tableApi.getAll();
      setTables(data);
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

  const availableCount = tables.filter(t => t.status === 'Available').length;
  const reservedCount = tables.filter(t => t.status === 'Reserved').length;

  const areas = ['Tầng 1 - Sân vườn thoáng đãng', 'Tầng 2 - Đại sảnh máy lạnh ấm cúng', 'Tầng 3 - Phòng VIP Hoàng Gia (Riêng tư)', 'Tầng 3 - Phòng VIP Panorama (View triệu đô)'];

  return (
    <div className="animate-fade-in">
      {/* Title */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="text-heading fw-bold mb-1">Sơ Đồ Quản Lý Bàn Ăn</h2>
          <p className="text-muted small mb-0">Theo dõi trực quan trạng thái bàn theo từng khu vực và tầng lầu</p>
        </div>
        <button onClick={loadTables} className="btn-outline-custom d-flex align-items-center gap-1 small py-2">
          <RefreshCw size={15} /> Làm Mới
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="glass-panel p-3 text-center">
            <span className="text-muted small">Tổng Số Bàn:</span>
            <div className="fs-3 fw-bold text-heading mt-1">{tables.length} Bàn</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-panel p-3 text-center">
            <span className="text-muted small">Bàn Đang Trống (Available):</span>
            <div className="fs-3 fw-bold text-success mt-1">{availableCount} Bàn</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-panel p-3 text-center">
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
          <div className="glass-panel p-4">
            <h5 className="text-heading fw-bold mb-3 pb-2 border-bottom border-secondary border-opacity-25">
              Danh Sách Bàn Ăn Nhà Hàng
            </h5>
            <div className="row g-3">
              {tables.map(table => {
                const isAvail = table.status === 'Available';
                return (
                  <div key={table.id} className="col-xl-3 col-lg-4 col-sm-6">
                    <div
                      className="p-3 rounded-3 h-100 position-relative transition-all"
                      style={{
                        backgroundColor: '#182232',
                        border: isAvail ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                        boxShadow: isAvail ? '0 4px 15px rgba(16, 185, 129, 0.05)' : '0 4px 15px rgba(245, 158, 11, 0.08)',
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold fs-5 text-heading">{table.code}</span>
                        <span className={isAvail ? 'badge-green' : 'badge-gold'}>
                          {isAvail ? 'Đang trống' : 'Đã đặt'}
                        </span>
                      </div>

                      <div className="text-muted small mb-2">{table.area}</div>

                      <div className="d-flex align-items-center gap-1 text-secondary small mb-3">
                        <Users size={14} className="text-warning" />
                        <span>Sức chứa: {table.capacity} khách</span>
                      </div>

                      <button
                        onClick={() => handleToggleStatus(table)}
                        className={`btn btn-sm w-100 d-flex align-items-center justify-content-center gap-1 py-1 rounded-2 ${
                          isAvail ? 'btn-outline-warning' : 'btn-outline-success'
                        }`}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {isAvail ? (
                          <>
                            <Ban size={13} />
                            <span>Khóa bàn / Đánh dấu có khách</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={13} />
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
    </div>
  );
};

export default AdminTables;

