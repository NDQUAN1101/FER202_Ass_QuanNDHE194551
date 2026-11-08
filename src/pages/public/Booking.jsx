import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tableApi, foodApi, reservationApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, Users, MapPin, CheckCircle, ChevronRight, ChevronLeft, Utensils, AlertCircle } from 'lucide-react';

const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00',
  '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

const Booking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, totalAmount, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [tables, setTables] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Step 1: Booking Schedule & Table
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('18:30');
  const [guestsCount, setGuestsCount] = useState(4);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');

  // Form Step 3: Customer Information
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [specialRequest, setSpecialRequest] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tablesData, foodsData] = await Promise.all([
          tableApi.getAll(),
          foodApi.getAll(),
        ]);
        setTables(tablesData);
        setFoods(foodsData);
        // Default select first available table
        const firstAvail = tablesData.find(t => t.status === 'Available');
        if (firstAvail) setSelectedTableId(firstAvail.id);
      } catch (err) {
        console.error('Error loading tables:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Filtered tables by area and capacity
  const filteredTables = tables.filter(t => {
    if (selectedArea !== 'all' && !t.area.includes(selectedArea)) return false;
    return true;
  });

  const selectedTable = tables.find(t => t.id === selectedTableId);

  // Validate step 1
  const handleNextStep1 = () => {
    if (!date) {
      addToast('Vui lòng chọn ngày dùng bữa!', 'warning');
      return;
    }
    if (!timeSlot) {
      addToast('Vui lòng chọn khung giờ đặt bàn!', 'warning');
      return;
    }
    if (!selectedTableId) {
      addToast('Vui lòng chọn một bàn ăn còn trống!', 'warning');
      return;
    }
    setStep(2);
  };

  // Validate step 3
  const validateForm = () => {
    const errs = {};
    if (!customerName.trim()) {
      errs.customerName = 'Vui lòng nhập họ và tên!';
    }
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại!';
    } else if (!phoneRegex.test(phone.trim())) {
      errs.phone = 'Số điện thoại không hợp lệ (VD: 0987654321)!';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Vui lòng nhập địa chỉ email!';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Email không đúng định dạng!';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle final submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Vui lòng kiểm tra lại thông tin liên hệ!', 'warning');
      return;
    }

    setIsSubmitting(true);
    const reservationCode = `DH-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReservation = {
      id: reservationCode,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      date,
      timeSlot,
      guestsCount: Number(guestsCount),
      tableId: selectedTableId,
      specialRequest: specialRequest.trim(),
      orderItems: cartItems.map(item => ({
        foodId: item.food.id,
        foodName: item.food.name,
        price: item.food.price,
        quantity: item.quantity,
        total: item.food.price * item.quantity,
      })),
      totalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    try {
      await reservationApi.create(newReservation);
      clearCart();
      addToast('Đặt bàn thành công! Mã đơn: ' + reservationCode, 'success');
      navigate('/booking-success', { state: { reservation: newReservation, table: selectedTable } });
    } catch (err) {
      console.error(err);
      addToast('Có lỗi xảy ra khi gửi đơn đặt bàn. Vui lòng thử lại!', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-5 animate-fade-in">
      <div className="container">
        {/* Page Title */}
        <div className="text-center mb-5">
          <span className="badge-gold mb-2 d-inline-block">Dịch Vụ Đặt Chỗ Trực Tuyến</span>
          <h1 className="text-white fw-bold display-5 mb-2">Đặt Bàn Nhà Hàng DineHub</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Giữ chỗ nhanh chóng, chọn trước vị trí bàn yêu thích và gọi món lên sẵn để có trải nghiệm trọn vẹn nhất.
          </p>
        </div>

        {/* 3 Steps Progress Tracker */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="d-flex align-items-center justify-content-between position-relative">
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10%',
                  right: '10%',
                  height: '2px',
                  backgroundColor: '#334155',
                  zIndex: 1,
                  transform: 'translateY(-50%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10%',
                  width: step === 1 ? '0%' : step === 2 ? '50%' : '80%',
                  height: '2px',
                  backgroundColor: 'var(--primary-color)',
                  zIndex: 2,
                  transform: 'translateY(-50%)',
                  transition: 'width 0.4s ease',
                }}
              />

              {/* Step 1 indicator */}
              <div
                onClick={() => setStep(1)}
                className="d-flex flex-column align-items-center position-relative cursor-pointer"
                style={{ zIndex: 3 }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white mb-2"
                  style={{
                    width: '42px',
                    height: '42px',
                    background: step >= 1 ? 'var(--primary-gradient)' : '#1e293b',
                    border: '3px solid #0b0f17',
                    boxShadow: step >= 1 ? '0 0 15px rgba(226,135,34,0.5)' : 'none',
                  }}
                >
                  1
                </div>
                <span className={`small fw-semibold ${step >= 1 ? 'text-warning' : 'text-muted'}`}>
                  Thời gian & Bàn
                </span>
              </div>

              {/* Step 2 indicator */}
              <div
                onClick={() => step > 2 && setStep(2)}
                className="d-flex flex-column align-items-center position-relative"
                style={{ zIndex: 3, cursor: step >= 2 ? 'pointer' : 'default' }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white mb-2"
                  style={{
                    width: '42px',
                    height: '42px',
                    background: step >= 2 ? 'var(--primary-gradient)' : '#1e293b',
                    border: '3px solid #0b0f17',
                    boxShadow: step >= 2 ? '0 0 15px rgba(226,135,34,0.5)' : 'none',
                  }}
                >
                  2
                </div>
                <span className={`small fw-semibold ${step >= 2 ? 'text-warning' : 'text-muted'}`}>
                  Chọn Món Trước
                </span>
              </div>

              {/* Step 3 indicator */}
              <div className="d-flex flex-column align-items-center position-relative" style={{ zIndex: 3 }}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white mb-2"
                  style={{
                    width: '42px',
                    height: '42px',
                    background: step === 3 ? 'var(--primary-gradient)' : '#1e293b',
                    border: '3px solid #0b0f17',
                    boxShadow: step === 3 ? '0 0 15px rgba(226,135,34,0.5)' : 'none',
                  }}
                >
                  3
                </div>
                <span className={`small fw-semibold ${step === 3 ? 'text-warning' : 'text-muted'}`}>
                  Xác Nhận Đặt Bàn
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 1: Date, Time, Guests & Table Selection */}
        {step === 1 && (
          <div className="row g-4 animate-fade-in">
            <div className="col-lg-5">
              <div className="glass-panel p-4 h-100">
                <h4 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                  <Calendar size={22} className="text-warning" />
                  <span>1. Chọn Lịch Dùng Bữa</span>
                </h4>

                {/* Date */}
                <div className="mb-3">
                  <label className="form-label text-light small fw-medium">Ngày đặt bàn:</label>
                  <input
                    type="date"
                    className="form-control form-control-custom"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                {/* Guests */}
                <div className="mb-4">
                  <label className="form-label text-light small fw-medium">Số lượng khách:</label>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="range"
                      className="form-range"
                      min="1"
                      max="15"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                    />
                    <span className="badge bg-warning text-dark fs-6 px-3 py-2 fw-bold">
                      {guestsCount} khách
                    </span>
                  </div>
                </div>

                {/* Time slot pills */}
                <div className="mb-4">
                  <label className="form-label text-light small fw-medium d-flex align-items-center gap-1">
                    <Clock size={16} className="text-warning" />
                    <span>Khung giờ nhận bàn:</span>
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`btn btn-sm px-3 py-2 rounded-2 fw-semibold ${
                          timeSlot === slot
                            ? 'btn-warning text-dark'
                            : 'btn-dark text-light border border-secondary border-opacity-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected summary */}
                <div className="p-3 rounded-3" style={{ backgroundColor: '#131b26', border: '1px solid var(--border-color)' }}>
                  <div className="small text-muted mb-1">Tóm tắt bước 1:</div>
                  <div className="text-white fw-medium">
                    📅 Ngày <strong>{date}</strong> vào lúc <strong className="text-warning">{timeSlot}</strong>
                  </div>
                  <div className="text-white small mt-1">
                    👥 Đi nhóm: <strong>{guestsCount} người</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Selection Grid */}
            <div className="col-lg-7">
              <div className="glass-panel p-4 h-100">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
                  <h4 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
                    <MapPin size={22} className="text-warning" />
                    <span>2. Chọn Vị Trí Bàn Ăn</span>
                  </h4>

                  {/* Area Filter */}
                  <select
                    className="form-select form-select-custom form-select-sm"
                    style={{ maxWidth: '240px' }}
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                  >
                    <option value="all">Tất cả khu vực</option>
                    <option value="Tầng 1">Tầng 1 - Sân vườn</option>
                    <option value="Tầng 2">Tầng 2 - Đại sảnh</option>
                    <option value="Tầng 3">Tầng 3 - Phòng VIP</option>
                  </select>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-warning" role="status"></div>
                  </div>
                ) : (
                  <div className="row g-3">
                    {filteredTables.map((table) => {
                      const isSelected = selectedTableId === table.id;
                      const isAvailable = table.status === 'Available';
                      return (
                        <div key={table.id} className="col-sm-6">
                          <div
                            onClick={() => isAvailable && setSelectedTableId(table.id)}
                            className={`p-3 rounded-3 h-100 transition-all ${
                              isSelected
                                ? 'border-warning shadow-lg'
                                : 'border-secondary border-opacity-25'
                            }`}
                            style={{
                              backgroundColor: isSelected ? '#243247' : '#141c28',
                              border: isSelected ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                              cursor: isAvailable ? 'pointer' : 'not-allowed',
                              opacity: isAvailable ? 1 : 0.5,
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <span className="fw-bold fs-6 text-white">{table.code}</span>
                              {isAvailable ? (
                                <span className="badge-green small">Trống</span>
                              ) : (
                                <span className="badge bg-secondary small">Đã được đặt</span>
                              )}
                            </div>
                            <div className="text-muted small mb-2">{table.area}</div>
                            <div className="d-flex align-items-center gap-1 text-light small">
                              <Users size={14} className="text-warning" />
                              <span>Sức chứa: Tối đa {table.capacity} khách</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="d-flex justify-content-end mt-4 pt-3 border-top border-secondary border-opacity-25">
                  <button
                    onClick={handleNextStep1}
                    className="btn-primary-custom text-decoration-none py-2 px-4"
                  >
                    <span>Tiếp Tục: Chọn Món Trước</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Pre-order Food Selection */}
        {step === 2 && (
          <div className="row g-4 animate-fade-in">
            {/* Left: Quick Food Picker */}
            <div className="col-lg-7">
              <div className="glass-panel p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
                    <Utensils size={22} className="text-warning" />
                    <span>Chọn Món Ăn Mang Lên Sẵn (Tùy Chọn)</span>
                  </h4>
                </div>
                <p className="text-muted small mb-4">
                  Bạn có thể chọn trước các món khai vị, món chính hoặc đồ uống để nhà hàng chuẩn bị sẵn sàng khi bạn vừa bước vào quán.
                </p>

                {/* Mini Food List */}
                <div className="d-flex flex-column gap-3" style={{ maxHeight: '550px', overflowY: 'auto' }}>
                  {foods.filter(f => f.status !== 'Hết món').map((food) => {
                    const cartItem = cartItems.find(item => item.food.id === food.id);
                    const qty = cartItem ? cartItem.quantity : 0;
                    return (
                      <div
                        key={food.id}
                        className="d-flex align-items-center justify-content-between p-3 rounded-3"
                        style={{ backgroundColor: '#141c28', border: '1px solid var(--border-color)' }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={food.image}
                            alt={food.name}
                            style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-semibold text-white">{food.name}</div>
                            <div className="text-warning fw-bold small">{formatVND(food.price)}</div>
                            <small className="text-muted">{food.preparationTime} phút chế biến</small>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          {qty > 0 ? (
                            <>
                              <button
                                className="btn btn-sm btn-secondary px-2 py-1"
                                onClick={() => updateQuantity(food.id, qty - 1)}
                              >
                                -
                              </button>
                              <span className="text-white fw-bold px-2">{qty}</span>
                              <button
                                className="btn btn-sm btn-secondary px-2 py-1"
                                onClick={() => updateQuantity(food.id, qty + 1)}
                              >
                                +
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-warning px-3 py-1 fw-medium"
                              onClick={() => {
                                addToCart(food, 1);
                                addToast(`Đã thêm ${food.name}!`, 'success');
                              }}
                            >
                              + Thêm
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Selected Cart Summary */}
            <div className="col-lg-5">
              <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <h4 className="text-white fw-bold mb-3">Danh Sách Món Đã Chọn</h4>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <Utensils size={40} className="mb-2 opacity-50" />
                      <p className="mb-0">Bạn chưa chọn món nào.</p>
                      <small>(Bạn có thể bỏ qua bước này và gọi món trực tiếp khi đến nhà hàng)</small>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {cartItems.map(item => (
                        <div
                          key={item.food.id}
                          className="d-flex justify-content-between align-items-center p-2 rounded"
                          style={{ backgroundColor: '#182232', border: '1px solid var(--border-color)' }}
                        >
                          <div>
                            <div className="text-white small fw-medium">{item.food.name}</div>
                            <small className="text-muted">
                              {formatVND(item.food.price)} &times; {item.quantity}
                            </small>
                          </div>
                          <span className="text-warning fw-bold small">
                            {formatVND(item.food.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-top border-secondary border-opacity-50">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="text-muted">Tiền món tạm tính:</span>
                    <span className="fs-5 text-warning fw-bold">{formatVND(totalAmount)}</span>
                  </div>

                  <div className="d-flex justify-content-between gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="btn btn-outline-secondary text-light d-flex align-items-center gap-1"
                    >
                      <ChevronLeft size={18} />
                      <span>Quay Lại</span>
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="btn-primary-custom d-flex align-items-center gap-1"
                    >
                      <span>Tiếp Tục: Điền Thông Tin</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Customer Information & Final Confirmation */}
        {step === 3 && (
          <form onSubmit={handleSubmitBooking} className="row g-4 animate-fade-in">
            {/* Contact Details Form */}
            <div className="col-lg-7">
              <div className="glass-panel p-4">
                <h4 className="text-white fw-bold mb-4">Thông Tin Liên Hệ Nhận Bàn</h4>

                <div className="row g-3">
                  {/* Name */}
                  <div className="col-md-12">
                    <label className="form-label text-light small fw-medium">
                      Họ và tên quý khách <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-custom ${errors.customerName ? 'is-invalid border-danger' : ''}`}
                      placeholder="VD: Nguyễn Đình Quân"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                    {errors.customerName && (
                      <small className="text-danger mt-1 d-block">{errors.customerName}</small>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label text-light small fw-medium">
                      Số điện thoại di động <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control form-control-custom ${errors.phone ? 'is-invalid border-danger' : ''}`}
                      placeholder="VD: 0987654321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && (
                      <small className="text-danger mt-1 d-block">{errors.phone}</small>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label text-light small fw-medium">
                      Địa chỉ Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-custom ${errors.email ? 'is-invalid border-danger' : ''}`}
                      placeholder="VD: quanndhe194551@fpt.edu.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <small className="text-danger mt-1 d-block">{errors.email}</small>
                    )}
                  </div>

                  {/* Special Requests */}
                  <div className="col-12">
                    <label className="form-label text-light small fw-medium">
                      Yêu cầu đặc biệt (Ghế em bé, nến sinh nhật, hoa tươi trang trí...)
                    </label>
                    <textarea
                      rows={3}
                      className="form-control form-control-custom"
                      placeholder="Ví dụ: Tiệc kỷ niệm ngày cưới, chuẩn bị vị trí bàn lãng mạn giúp tôi..."
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Review Card */}
            <div className="col-lg-5">
              <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <h4 className="text-white fw-bold mb-4">Chi Tiết Đơn Đặt Bàn</h4>

                  <div className="d-flex flex-column gap-3 mb-4">
                    <div className="d-flex justify-content-between text-muted small pb-2 border-bottom border-secondary border-opacity-25">
                      <span>Lịch hẹn:</span>
                      <strong className="text-white">
                        {timeSlot} - Ngày {date}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between text-muted small pb-2 border-bottom border-secondary border-opacity-25">
                      <span>Vị trí bàn ăn:</span>
                      <strong className="text-warning">
                        {selectedTable?.code} ({selectedTable?.area})
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between text-muted small pb-2 border-bottom border-secondary border-opacity-25">
                      <span>Số lượng khách:</span>
                      <strong className="text-white">{guestsCount} người</strong>
                    </div>

                    <div className="d-flex justify-content-between text-muted small pb-2 border-bottom border-secondary border-opacity-25">
                      <span>Món gọi trước ({cartItems.length}):</span>
                      <strong className="text-white">{formatVND(totalAmount)}</strong>
                    </div>

                    <div className="d-flex justify-content-between text-muted small pb-2 border-bottom border-secondary border-opacity-25">
                      <span>Phí đặt cọc giữ bàn:</span>
                      <strong className="text-success">0đ (Miễn phí)</strong>
                    </div>
                  </div>

                  <div
                    className="p-3 rounded-3 mb-4"
                    style={{ backgroundColor: 'rgba(226, 135, 34, 0.1)', border: '1px solid rgba(226, 135, 34, 0.3)' }}
                  >
                    <div className="d-flex align-items-center gap-2 text-warning small fw-medium">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>Nhà hàng sẽ giữ bàn tối đa 15 phút so với giờ hẹn của quý khách.</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between gap-3 pt-3 border-top border-secondary border-opacity-50">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-outline-secondary text-light d-flex align-items-center gap-1"
                  >
                    <ChevronLeft size={18} />
                    <span>Quay Lại</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary-custom flex-grow-1 justify-content-center"
                  >
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        <span>Xác Nhận Đặt Bàn Ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Booking;
