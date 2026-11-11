import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodApi, categoryApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Search, Edit2, Trash2, Eye, Filter, CheckCircle, XCircle } from 'lucide-react';

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [foodsData, catsData] = await Promise.all([
        foodApi.getAll(),
        categoryApi.getAll(),
      ]);
      setFoods(foodsData);
      setCategories(catsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await foodApi.delete(deleteTarget.id);
      setFoods(prev => prev.filter(f => f.id !== deleteTarget.id));
      addToast(`Đã xóa món "${deleteTarget.name}" thành công!`, 'success');
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      addToast('Lỗi khi xóa món ăn!', 'danger');
    }
  };

  const handleToggleStatus = async (food) => {
    const newStatus = food.status === 'Còn hàng' ? 'Hết món' : 'Còn hàng';
    try {
      const updated = { ...food, status: newStatus };
      await foodApi.update(food.id, updated);
      setFoods(prev => prev.map(f => f.id === food.id ? updated : f));
      addToast(`Đã chuyển trạng thái món sang "${newStatus}"!`, 'info');
    } catch (err) {
      console.error(err);
      addToast('Lỗi khi cập nhật trạng thái!', 'danger');
    }
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredFoods = foods.filter(food => {
    if (selectedCat !== 'all' && food.categoryId !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return food.name.toLowerCase().includes(q) || food.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="animate-fade-in">
      {/* Title & Action */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="text-heading fw-bold mb-1">Quản Lý Thực Đơn Nhà Hàng</h2>
          <p className="text-muted small mb-0">Thêm, sửa, xóa món ăn và cập nhật trạng thái kho nguyên liệu</p>
        </div>
        <Link to="/admin/foods/create" className="btn-primary-custom text-decoration-none py-2 px-3">
          <Plus size={18} /> Thêm Món Ăn Mới
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="position-relative">
              <Search
                size={18}
                className="position-absolute text-muted"
                style={{ top: '50%', left: '14px', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-control form-control-custom ps-5"
                placeholder="Tìm kiếm món ăn theo tên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <select
              className="form-select form-select-custom"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <option value="all">Tất cả danh mục ({foods.length})</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2 text-md-end text-muted small">
            Hiển thị: <strong className="text-warning">{filteredFoods.length}</strong> món
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel p-3 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-5 text-muted">
            Không tìm thấy món ăn nào phù hợp.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-light border table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
              <thead>
                <tr className="border-secondary text-muted small">
                  <th>HÌNH ẢNH</th>
                  <th>TÊN MÓN ĂN</th>
                  <th>DANH MỤC</th>
                  <th>GIÁ BÁN</th>
                  <th>THỜI GIAN</th>
                  <th>TRẠNG THÁI</th>
                  <th className="text-end">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoods.map(food => {
                  const cat = categories.find(c => c.id === food.categoryId);
                  return (
                    <tr key={food.id} className="border-secondary border-opacity-25">
                      <td style={{ width: '80px' }}>
                        <img
                          src={food.image}
                          alt={food.name}
                          style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <div className="fw-bold text-heading mb-1">{food.name}</div>
                        <div className="d-flex gap-1">
                          {food.isSpecial && <span className="badge-gold small py-0 px-2">Đặc sắc</span>}
                          {food.isVegetarian && <span className="badge-green small py-0 px-2">Món chay</span>}
                        </div>
                      </td>
                      <td className="text-muted small">
                        {cat ? cat.name.split('(')[0] : 'Chung'}
                      </td>
                      <td className="text-warning fw-bold">{formatVND(food.price)}</td>
                      <td className="text-secondary small">{food.preparationTime} phút</td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(food)}
                          className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold small ${
                            food.status === 'Còn hàng'
                              ? 'btn-success bg-opacity-25 text-success border border-success'
                              : 'btn-danger bg-opacity-25 text-danger border border-danger'
                          }`}
                        >
                          {food.status === 'Còn hàng' ? 'Còn Hàng' : 'Hết Món'}
                        </button>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Link
                            to={`/admin/foods/edit/${food.id}`}
                            className="btn btn-sm btn-outline-warning py-1 px-2 rounded-2"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={15} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(food)}
                            className="btn btn-sm btn-outline-danger py-1 px-2 rounded-2"
                            title="Xóa món"
                          >
                            <Trash2 size={15} />
                          </button>
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="p-4 rounded-4 animate-fade-in"
            style={{ maxWidth: '420px', width: '100%', backgroundColor: '#131b26', border: '1px solid var(--border-color)' }}
          >
            <h5 className="text-heading fw-bold mb-2">Xác Nhận Xóa Món Ăn</h5>
            <p className="text-muted small mb-4">
              Bạn có chắc chắn muốn xóa món <strong className="text-warning">{deleteTarget.name}</strong> khỏi thực đơn? Hành động này không thể hoàn tác.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn btn-secondary btn-sm px-3"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger btn-sm px-3"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFoods;

