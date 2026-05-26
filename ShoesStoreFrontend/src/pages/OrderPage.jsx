import { useEffect, useState } from "react";
import "../styles/OrderPage.css";
import { getCartItems } from "../api/cart.api";
import { createOrder } from "../api/order.api";
import { useAuth } from "../auth/AuthProvider";


const API_URL = "http://localhost:5223";

export default function OrderPage() {

  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      setCartItems([]);
      return;
    }
    getCartItems(cart).then(setCartItems);
  }, []);

  const total = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateOrder = async () => {
    setError("");
    setSuccess("");

    const dto = {
      items: cartItems.map(i => ({
        productSizeId: i.productSizeId,
        quantity: i.qty
      }))
    };

    if (!user) {
      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.phone.trim()
      ) {
        setError("Заповніть всі поля");
        return;
      }

      dto.guestName = form.name;
      dto.guestEmail = form.email;
      dto.guestPhone = form.phone;
    }

    try {
      await createOrder(dto);

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      setSuccess("Замовлення успішно створено");
      setSuccessModal(true);
    } catch (err) {
      setError(err.message);
    }

};

  return (
    <div className="order-page">
      <h1>Оформлення замовлення</h1>
      {!user && (
        <div className="order-form">
        <p className="oder-info">Введіть ваші дані:</p>
          <input
            name="name"
            placeholder="Ім'я"
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Номер телефона"
            onChange={handleChange}
          />
          {error && <div className="error-message">{error}</div>}
        </div>
      )}
      {user && (
        <div className="user-info">
        <p className="oder-info">Ваші дані:</p>
          <p>Ім'я: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Номер телефона: {user.phone}</p>
        </div>
      )}
      <h2>В кошику</h2>
      <div className="order-items">
        {cartItems.map((item, i) => (
          <div
            key={i}
            className="order-item"
          >
            <img
              src={`${API_URL}${item.image}`}
              alt=""
            />
            <div>
              <h3>{item.name}</h3>
              <p>Розмір: {item.size}</p>
              <p>{item.qty} × {item.price}.00 грн</p>
            </div>
          </div>
        ))}
      </div>
      <h2>Разом: {total}.00 грн</h2>
      <p>Після оформлення замовлення з вами зв’яжеться наш оператор для підтвердження деталей замовлення.</p>
      <button
        className="order-btn"
        onClick={handleCreateOrder}
      >Підтвердити замовлення</button>
      {successModal && (
      <div className="success-overlay">
        <div className="success-modal">
          <h2>Дякуємо за замовлення!</h2>
          <p>Наш оператор скоро зв’яжеться з вами для підтвердження.</p>
          <p>Якщо ви зареєстровані на сайті, інформація про замовлення буде доступна в особистому кабінеті.</p>
          <button
            className="success-btn"
            onClick={() => window.location.href = "/"}
          >На головну</button>
        </div>
      </div>
    )}
    </div>
  );
}