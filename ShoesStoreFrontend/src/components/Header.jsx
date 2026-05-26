import { Link } from "react-router-dom";
import "../styles/Header.css";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import cartIcon from "../assets/icons/Cart-icons.png";
import profileIcon from "../assets/icons/Profile-icons.png";

export default function Header() {
  const { user } = useAuth();
  const isAuth = !!user;

  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const [cartCount, setCartCount] = useState(0);

  const updateCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(total);
  };

  const handleSearch = (e) => {
  if (e.key === "Enter" && query.trim()) {
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setQuery(""); // 👈 важно
  }
  };

  useEffect(() => {
    updateCart();

    const handler = () => updateCart();

    window.addEventListener("cartUpdated", handler);

    return () => {
      window.removeEventListener("cartUpdated", handler);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-inner">

        <Link to="/" className="logo">VELORA</Link>

        <div className="search-box">
          <input
            type="text"
            placeholder="Пошук взуття..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <button
            className="search-btn"
            onClick={() => {
              if (query.trim()) {
                navigate(`/products?search=${encodeURIComponent(query)}`);
                setQuery("");
              }
            }}
          ></button>
        </div>

        <nav className="nav">

          <Link to="/" className="btn btn-link">Головна</Link>

          <Link to="/cart" className="btn icon-btn cart-btn">
            <img src={cartIcon} alt="cart" />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

          {!isAuth ? (
            <>
              <Link to="/login" className="btn btn-outline">Вхід</Link>
              <Link to="/register" className="btn btn-primary">Реєстрація</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn user-btn">
                <img src={profileIcon} alt="user" />
                <span>{user.name}</span>
              </Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}