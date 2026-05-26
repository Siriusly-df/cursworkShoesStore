import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";
import { useAuth } from "../auth/AuthProvider";
import { logoutUser } from "../api/auth.api";
import { deleteAccount } from "../api/user.api";
import { orderStatusMap } from "../utils/mappers";

const API_URL = "http://localhost:5223";

export default function ProfilePage() {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/api/orders/my`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
      .then(r => r.json())
      .then(setOrders);
  }, [user]);

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/login");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/register");
    } catch {
      alert("Помилка видалення акаунта");
    }
  };

  if (loading || !user) {
    return <div className="profile-page">Завантаження...</div>;
  }

  return (
    <div className="profile-layout">

      <div className="profile-card">
        <h2>Мій кабінет</h2>
        <div className="profile-info">
          <p><strong>Ім'я:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Номер телефону:</strong> {user.phone}</p>
          <p>
            <strong>Дата реєстрації:</strong>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("uk-UA")
              : "Невідомо"}
          </p>
        </div>
        <div className="profile-actions">
          <button onClick={logout} className="user-logout-btn">Вийти з профілю</button>
          <button className="edit-btn-profile" onClick={() => navigate("/profile/edit")}>Редагувати профіль</button>
          <button onClick={handleDelete} className="delete-btn">Видалити акаунт</button>
        </div>
      </div>

      <div className="orders-card">
        <h2>Мої замовлення</h2>
        {orders.length === 0 && <p>Немає замовлень</p>}
        {orders.map(order => (
          <div key={order.id} className="profile-card">
            <div className="order-header-user-order">
              <div className="order-title">
                <span className="order-id">Замовлення №{order.id}</span>
                <span className="status-user-order">Статус замовлення: {orderStatusMap[order.status]}</span>
              </div>
              <div className="order-total">
                 Всього: {order.total}.00 грн
              </div>
            </div>
            <div className="order-body">
                <div className="order-table-header">
                  <span>Товар</span>
                  <span>Розмір</span>
                  <span>К-сть</span>
                  <span>Сума</span>
                </div>
                <div className="order-products">
                {order.items.map((i, idx) => (
                    <div key={idx} className="order-product">
                    <span className="product-name">{i.productName}</span>
                    <span className="product-size">{i.size}</span>
                    <span className="product-qty">x{i.quantity}</span>
                    <span className="product-price-user-order">{i.price * i.quantity}.00 грн</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}