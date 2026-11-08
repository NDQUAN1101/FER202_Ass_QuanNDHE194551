import React, { useState, useEffect, useMemo } from 'react';
import { foodApi, categoryApi } from '../../services/api';
import FoodCard from '../../components/common/FoodCard';
import { Search, Filter, SlidersHorizontal, Utensils, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [specialOnly, setSpecialOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsData, catsData] = await Promise.all([
          foodApi.getAll(),
          categoryApi.getAll(),
        ]);
        setFoods(foodsData);
        setCategories(catsData);
      } catch (err) {
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter and Sort logic
  const filteredFoods = useMemo(() => {
    return foods
      .filter((food) => {
        // Category filter
        if (selectedCategory !== 'all' && food.categoryId !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = food.name.toLowerCase().includes(q);
          const matchDesc = food.description.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        // Vegetarian filter
        if (vegetarianOnly && !food.isVegetarian) {
          return false;
        }
        // Special filter
        if (specialOnly && !food.isSpecial) {
          return false;
        }
        // In stock only
        if (inStockOnly && food.status === 'Hết món') {
          return false;
        }
        // Price limit
        if (food.price > maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        if (sortBy === 'time-asc') return a.preparationTime - b.preparationTime;
        return 0; // default
      });
  }, [foods, selectedCategory, searchQuery, sortBy, vegetarianOnly, specialOnly, inStockOnly, maxPrice]);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy, vegetarianOnly, specialOnly, inStockOnly, maxPrice]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);
  const currentFoods = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFoods.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFoods, currentPage]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('default');
    setVegetarianOnly(false);
    setSpecialOnly(false);
    setInStockOnly(false);
    setMaxPrice(1000000);
    setCurrentPage(1);
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="py-5 animate-fade-in">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-5">
          <span className="badge-gold mb-2 d-inline-block">Tuyển Chọn Tinh Hoa</span>
          <h1 className="text-white fw-bold display-5 mb-2">Thực Đơn Nhà Hàng DineHub</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
            Khám phá hương vị thượng hạng từ các món khai vị thanh tao, bò Wagyu trứ danh, hải sản cao cấp và rượu vang danh tiếng.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`btn px-3 py-2 rounded-pill fw-semibold transition-all ${
              selectedCategory === 'all'
                ? 'btn-warning text-dark'
                : 'btn-dark text-light border border-secondary border-opacity-50'
            }`}
            style={{ fontSize: '0.9rem' }}
          >
            Tất Cả Món ({foods.length})
          </button>
          {categories.map((cat) => {
            const count = foods.filter((f) => f.categoryId === cat.id).length;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`btn px-3 py-2 rounded-pill fw-semibold transition-all ${
                  isActive
                    ? 'btn-warning text-dark'
                    : 'btn-dark text-light border border-secondary border-opacity-50'
                }`}
                style={{ fontSize: '0.9rem' }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Filter & Search Bar Row */}
        <div
          className="p-3 mb-4 rounded-3"
          style={{ backgroundColor: '#131b26', border: '1px solid var(--border-color)' }}
        >
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-lg-5 col-md-6">
              <div className="position-relative">
                <Search
                  size={18}
                  className="position-absolute text-muted"
                  style={{ top: '50%', left: '14px', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  className="form-control form-control-custom ps-5"
                  placeholder="Tìm theo tên món ăn, nguyên liệu, hương vị..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Sort Select */}
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center gap-2">
                <SlidersHorizontal size={18} className="text-warning flex-shrink-0" />
                <select
                  className="form-select form-select-custom"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Sắp xếp: Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="rating-desc">Đánh giá cao nhất</option>
                  <option value="time-asc">Chế biến nhanh nhất</option>
                </select>
              </div>
            </div>

            {/* Price slider */}
            <div className="col-lg-3 col-md-12">
              <div className="d-flex justify-content-between text-muted small mb-1">
                <span>Mức giá tối đa:</span>
                <span className="text-warning fw-bold">{formatVND(maxPrice)}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="100000"
                max="1000000"
                step="50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Quick Filter Checkbox Toggles */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 mt-3 border-top border-secondary border-opacity-25">
            <div className="d-flex flex-wrap gap-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="vegCheck"
                  checked={vegetarianOnly}
                  onChange={(e) => setVegetarianOnly(e.target.checked)}
                />
                <label className="form-check-label text-light small user-select-none" htmlFor="vegCheck">
                  Món chay (Vegetarian)
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="specialCheck"
                  checked={specialOnly}
                  onChange={(e) => setSpecialOnly(e.target.checked)}
                />
                <label className="form-check-label text-light small user-select-none" htmlFor="specialCheck">
                  Món đặc sắc của Bếp trưởng
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="stockCheck"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <label className="form-check-label text-light small user-select-none" htmlFor="stockCheck">
                  Chỉ hiện món còn hàng
                </label>
              </div>
            </div>

            {/* Reset button */}
            <button
              onClick={handleResetFilters}
              className="btn btn-sm btn-outline-secondary text-light d-flex align-items-center gap-1"
            >
              <RotateCcw size={14} />
              <span>Đặt lại bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Count and status info */}
        <div className="d-flex justify-content-between align-items-center mb-4 text-muted small">
          <div>
            Tìm thấy <strong className="text-warning">{filteredFoods.length}</strong> món ăn phù hợp
          </div>
          {totalPages > 1 && (
            <div>
              Trang {currentPage} / {totalPages}
            </div>
          )}
        </div>

        {/* Foods Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <div className="text-muted mt-2">Đang tải danh sách món ăn...</div>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-5 glass-panel p-5 my-4">
            <Utensils size={48} className="text-muted mb-3 opacity-50" />
            <h4 className="text-white fw-bold mb-2">Không tìm thấy món ăn phù hợp</h4>
            <p className="text-muted mb-4">Vui lòng thử tìm kiếm với từ khóa khác hoặc bỏ bớt các tiêu chí lọc.</p>
            <button onClick={handleResetFilters} className="btn-primary-custom">
              <RotateCcw size={16} /> Xem Tất Cả Món Ăn
            </button>
          </div>
        ) : (
          <div className="row g-4 mb-5">
            {currentFoods.map((food) => (
              <div key={food.id} className="col-xl-3 col-lg-4 col-md-6">
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
              className="btn btn-dark border border-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`btn px-3 py-1 fw-bold ${
                  currentPage === page ? 'btn-warning text-dark' : 'btn-dark text-light border border-secondary'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              className="btn btn-dark border border-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
