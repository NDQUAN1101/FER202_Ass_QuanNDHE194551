import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { foodApi, categoryApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Save, Image as ImageIcon, Flame, Leaf } from 'lucide-react';

const AdminFoodForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'cat-2',
    price: '',
    originalPrice: '',
    image: '',
    description: '',
    preparationTime: 20,
    isSpecial: false,
    isVegetarian: false,
    status: 'Còn hàng',
    rating: 4.8,
    reviewCount: 10,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await categoryApi.getAll();
        setCategories(cats);
        if (isEditMode) {
          const food = await foodApi.getById(id);
          if (food) {
            setFormData(food);
          } else {
            addToast('Không tìm thấy món ăn!', 'danger');
            navigate('/admin/foods');
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, [id, isEditMode, navigate]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Vui lòng nhập tên món ăn!';
    } else if (formData.name.trim().length < 3) {
      errs.name = 'Tên món phải có ít nhất 3 ký tự!';
    }

    if (!formData.price || Number(formData.price) <= 0) {
      errs.price = 'Giá bán phải là số nguyên dương lớn hơn 0!';
    }

    if (!formData.image.trim()) {
      errs.image = 'Vui lòng cung cấp link hình ảnh món ăn!';
    }

    if (!formData.description.trim()) {
      errs.description = 'Vui lòng nhập mô tả món ăn!';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Mô tả cần ít nhất 10 ký tự!';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Vui lòng kiểm tra lại thông tin biểu mẫu!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        preparationTime: Number(formData.preparationTime),
      };

      if (isEditMode) {
        await foodApi.update(id, payload);
        addToast('Cập nhật món ăn thành công!', 'success');
      } else {
        await foodApi.create(payload);
        addToast('Thêm món ăn mới vào thực đơn thành công!', 'success');
      }
      navigate('/admin/foods');
    } catch (err) {
      console.error(err);
      addToast('Lỗi khi lưu dữ liệu món ăn!', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      {/* Back button */}
      <div className="mb-3">
        <Link to="/admin/foods" className="btn btn-sm btn-outline-secondary text-light d-inline-flex align-items-center gap-1">
          <ArrowLeft size={16} /> Quay Lại Danh Sách
        </Link>
      </div>

      <div className="glass-panel p-4 p-md-5">
        <div className="mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <h3 className="text-white fw-bold mb-1">
            {isEditMode ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới'}
          </h3>
          <p className="text-muted small mb-0">
            {isEditMode ? `Cập nhật thông tin cho mã: ${id}` : 'Điền đầy đủ thông tin để bổ sung vào thực đơn DineHub'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="row g-4">
          {/* Food Name */}
          <div className="col-md-8">
            <label className="form-label text-light small fw-medium">
              Tên món ăn <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control form-control-custom ${errors.name ? 'is-invalid border-danger' : ''}`}
              placeholder="VD: Bò Wagyu A5 Nướng Đá Nóng"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <small className="text-danger mt-1 d-block">{errors.name}</small>}
          </div>

          {/* Category */}
          <div className="col-md-4">
            <label className="form-label text-light small fw-medium">
              Danh mục thực đơn <span className="text-danger">*</span>
            </label>
            <select
              className="form-select form-select-custom"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="col-md-4">
            <label className="form-label text-light small fw-medium">
              Giá bán (VNĐ) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className={`form-control form-control-custom ${errors.price ? 'is-invalid border-danger' : ''}`}
              placeholder="VD: 350000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            {errors.price && <small className="text-danger mt-1 d-block">{errors.price}</small>}
          </div>

          {/* Original Price */}
          <div className="col-md-4">
            <label className="form-label text-light small fw-medium">
              Giá niêm yết gốc (nếu có giảm giá)
            </label>
            <input
              type="number"
              className="form-control form-control-custom"
              placeholder="VD: 390000"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            />
          </div>

          {/* Prep time */}
          <div className="col-md-4">
            <label className="form-label text-light small fw-medium">
              Thời gian chế biến (phút)
            </label>
            <input
              type="number"
              className="form-control form-control-custom"
              value={formData.preparationTime}
              min="1"
              onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
            />
          </div>

          {/* Image URL & Preview */}
          <div className="col-12">
            <label className="form-label text-light small fw-medium">
              Đường dẫn hình ảnh (URL Unsplash / Online) <span className="text-danger">*</span>
            </label>
            <input
              type="url"
              className={`form-control form-control-custom ${errors.image ? 'is-invalid border-danger' : ''}`}
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            {errors.image && <small className="text-danger mt-1 d-block">{errors.image}</small>}

            {formData.image && (
              <div className="mt-3 p-2 rounded-3 d-inline-flex align-items-center gap-3" style={{ backgroundColor: '#131b26', border: '1px solid var(--border-color)' }}>
                <img
                  src={formData.image}
                  alt="Xem trước ảnh"
                  style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                  onError={(e) => { e.target.src = 'https://placehold.co/100x70?text=Invalid+Image'; }}
                />
                <span className="small text-muted">Xem trước ảnh món ăn</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="col-12">
            <label className="form-label text-light small fw-medium">
              Mô tả chi tiết nguyên liệu & hương vị <span className="text-danger">*</span>
            </label>
            <textarea
              rows={3}
              className={`form-control form-control-custom ${errors.description ? 'is-invalid border-danger' : ''}`}
              placeholder="Mô tả kỹ về cách chế biến, thành phần sốt, nguồn gốc nguyên liệu..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <small className="text-danger mt-1 d-block">{errors.description}</small>}
          </div>

          {/* Flags & Status */}
          <div className="col-md-6 d-flex align-items-center gap-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="isSpecialCheck"
                checked={formData.isSpecial}
                onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
              />
              <label className="form-check-label text-light small user-select-none" htmlFor="isSpecialCheck">
                Món đặc sắc của Bếp trưởng
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="isVegCheck"
                checked={formData.isVegetarian}
                onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
              />
              <label className="form-check-label text-light small user-select-none" htmlFor="isVegCheck">
                Món chay (Vegetarian)
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label text-light small fw-medium">Trạng thái kho:</label>
            <select
              className="form-select form-select-custom"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Còn hàng">Còn hàng (Phục vụ bình thường)</option>
              <option value="Hết món">Hết món (Tạm ngưng phục vụ)</option>
            </select>
          </div>

          {/* Submit */}
          <div className="col-12 mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-end gap-2">
            <Link to="/admin/foods" className="btn btn-outline-secondary text-light px-4">
              Hủy
            </Link>
            <button type="submit" disabled={loading} className="btn-primary-custom px-4">
              <Save size={18} />
              <span>{isEditMode ? 'Lưu Thay Đổi' : 'Thêm Món Vào Menu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFoodForm;
