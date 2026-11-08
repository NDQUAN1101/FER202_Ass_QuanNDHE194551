import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Star, Clock, Plus, Flame, Leaf } from 'lucide-react';

const FoodCard = ({ food, onQuickView }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (food.status === 'Hết món') {
      addToast('Món ăn hiện tại đang tạm hết hàng!', 'warning');
      return;
    }
    addToCart(food, 1);
    addToast(`Đã thêm "${food.name}" vào danh sách gọi trước!`, 'success');
  };

  const isAvailable = food.status !== 'Hết món';

  return (
    <div className="food-card h-100 d-flex flex-column position-relative">
      {/* Food Image & Floating Badges */}
      <div className="food-img-wrapper position-relative">
        <img src={food.image} alt={food.name} loading="lazy" />

        {/* Top Badges */}
        <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1">
          {food.isSpecial && (
            <span className="badge-gold d-inline-flex align-items-center gap-1 shadow-sm">
              <Flame size={13} /> Đặc sắc
            </span>
          )}
          {food.isVegetarian && (
            <span className="badge-green d-inline-flex align-items-center gap-1 shadow-sm">
              <Leaf size={13} /> Món chay
            </span>
          )}
        </div>

        {/* Status Badge */}
        {!isAvailable && (
          <div
            className="position-absolute inset-0 d-flex align-items-center justify-content-center"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(2px)',
            }}
          >
            <span className="badge bg-danger px-3 py-2 fs-6">Tạm Hết Món</span>
          </div>
        )}

        {/* Prep Time */}
        <div
          className="position-absolute bottom-0 end-0 m-2 px-2 py-1 rounded small d-flex align-items-center gap-1 text-white"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', fontSize: '0.75rem' }}
        >
          <Clock size={12} className="text-warning" />
          <span>{food.preparationTime} phút</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          {/* Rating */}
          <div className="d-flex align-items-center gap-1 mb-1 small text-warning">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span className="fw-bold">{food.rating}</span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              ({food.reviewCount} đánh giá)
            </span>
          </div>

          {/* Name */}
          <h6 className="text-white fw-bold mb-2 text-truncate" title={food.name} style={{ fontSize: '1rem' }}>
            {food.name}
          </h6>

          {/* Description */}
          <p
            className="text-muted small mb-3"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.5rem',
              lineHeight: '1.3',
            }}
          >
            {food.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25 mt-2">
          <div>
            <div className="text-warning fw-bold fs-6">{formatVND(food.price)}</div>
            {food.originalPrice && food.originalPrice > food.price && (
              <small className="text-muted text-decoration-line-through" style={{ fontSize: '0.75rem' }}>
                {formatVND(food.originalPrice)}
              </small>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!isAvailable}
            className={`btn btn-sm d-flex align-items-center gap-1 px-3 py-2 rounded-3 fw-semibold ${
              isAvailable ? 'btn-primary-custom' : 'btn-secondary disabled opacity-50'
            }`}
            style={{ fontSize: '0.82rem' }}
          >
            <Plus size={15} />
            <span>Gọi món</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
