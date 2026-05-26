import "../styles/Cart.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCartItems } from "../api/cart.api";

import cartIcon from "../assets/icons/Cart-icons.png";

const API_URL = "http://localhost:5223";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const loadCart = async (cartData) => {
    if (!cartData || cartData.length === 0) {
      setCartItems([]);
      return;
    }

    const data = await getCartItems(cartData);
    setCartItems(data);
  };
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    loadCart(localCart);
  }, []);

const removeItem = (index) => {
  const localCart = JSON.parse(localStorage.getItem("cart")) || [];
  const updated = localCart.filter((_, i) => i !== index);
  localStorage.setItem("cart", JSON.stringify(updated));
  window.dispatchEvent(new Event("cartUpdated"));
  loadCart(updated);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="cart-container">
      <div className="cart-header">
        <img src={cartIcon} alt="cart" />
        <h2>Кошик</h2>
      </div>
      {cartItems.length === 0 ? (
        <p className="empty">Кошик порожній</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img
                  src={`${API_URL}${item.image}`}
                  alt={item.name}
                />
                <div className="info">
                  <span className="name">{item.name}</span>
                  <span className="meta">Розмір: {item.size}</span>
                  <span className="price">{item.price}.00 грн</span>
                  <span>Кількість: {item.qty}</span>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(index)}
                >Видалити</button>
              </div>
            ))}

          </div>
          <div className="cart-total">
            <span>Разом:</span>
            <strong>{total}.00 грн</strong>
          </div>
          <Link to="/orders" className="order-btn-cart">Замовити</Link>
        </>
      )}

    </div>
  );
}