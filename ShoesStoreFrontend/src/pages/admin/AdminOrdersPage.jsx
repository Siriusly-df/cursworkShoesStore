import { useEffect, useState } from "react";
import { updateStatus } from "../../api/admin.api";
import "../../styles/admin/AdminOrdersPage.css";

const API_URL = "http://localhost:5223";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
      .then(r => r.json())
      .then(data => {
        setOrders(
          data.map(o => ({
            ...o,
            tempStatus: o.status
          }))
        );
      });
  }, []);

  const handleChange = (id, status) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, tempStatus: status } : o
      )
    );
  };

    const applyStatus = async (id) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    await updateStatus(id, order.tempStatus);

    setOrders(prev =>
        prev
        .map(o =>
            o.id === id
            ? { ...o, status: order.tempStatus, tempStatus: order.tempStatus }
            : o
        )
        .filter(o =>
            o.status !== "Completed" &&
            o.status !== "Cancelled"
        )
    );
    };

  return (
    <div className="admin-orders">
      <h1>Замовлення</h1>

    {orders
    .filter(order =>
        order.status !== "Completed" &&
        order.status !== "Cancelled"
    )
    .map(order => (
        <div key={order.id} className="order-card">
        <div className="order-header">
            <h3>№{order.id}</h3>
            <span>Ім’я: {order.userName}</span>
            <span>Телефон: {order.phone}</span>
            <span>Email: {order.email}</span>
            <span>Всього: {order.total}.00 грн</span>

            <select
            value={order.tempStatus}
            onChange={(e) => handleChange(order.id, e.target.value)}
            >
            <option value="New">Новий</option>
            <option value="Processing">В обробці</option>
            <option value="Completed">Завершено</option>
            <option value="Cancelled">Скасовано</option>
            </select>

            <button
            onClick={() => applyStatus(order.id)}
            className="apply-btn"
            >
            Застосувати
            </button>
        </div>

        <div className="order-items-admin">
            {order.items.map((i, idx) => (
            <div key={idx} className="item-row">
                <strong>{i.productName}</strong>
                <span>Розмір: {i.size}</span>
                <span>Кількість: x{i.quantity}</span>
                <span>Ціна: {i.price}.00 грн</span>
            </div>
            ))}
        </div>
        </div>
    ))}
    </div>
  );
}