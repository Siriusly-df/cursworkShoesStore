import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/products.api";
import "../styles/ProductPage.css";
import { genderMap, seasonMap } from "../utils/mappers";
import { useLocation } from "react-router-dom";
const API_URL = "http://localhost:5223";

export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    getProductById(id).then(setProduct);
  }, [id]);

  if (!product) return <p>Завантаження...</p>;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2000);

  const existing = cart.find(
    x => x.productId === product.id && x.productSizeId === selectedSize.id
  );

    if (existing) {
      existing.qty += 1;
    } else {
    cart.push({
      productId: product.id,
      productSizeId: selectedSize.id,
      qty: 1,
    });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

return (
  <div className="product-page">

    <div className="product-left">
    <div className="product-images">

      <div className="product-gallery">

        <img
          src={`${API_URL}${product.image}`}
          alt={product.name}
          className="gallery-thumb"
        />

      {product.images?.map(img => (
        <img
          key={img.id}
          src={`${API_URL}${img.imageUrl}`}
          className="gallery-thumb"
          alt={product.name}
        />
      ))}
      </div>
    </div>
    </div>

    <div className="product-right">

      <h1>{product.name}</h1>

      <h2 className="product-price">
        Ціна: {product.price} грн
      </h2>

      <div className="product-meta">
        <div className="meta-item">
          <span>Бренд</span>
          {product.brand}
        </div>

        <div className="meta-item">
          <span>Гендер</span>
          {genderMap[product.gender] || product.gender}
        </div>

        <div className="meta-item">
          <span>Сезон</span>
          {seasonMap[product.season] || product.season}
        </div>

        <div className="meta-item">
          <span>Матеріал</span>
          {product.material}
        </div>
      </div>

      <h2>Опис:</h2>
      <p>{product.description}</p>

      <div className="sizes">
        <h3>Оберіть розмір</h3>
        EU:

        {[...(product.sizes || [])]
          .sort((a, b) => a.size - b.size)
          .map((s) => (
            <button
              key={s.id}
              disabled={s.stock === 0}
              className={selectedSize?.id === s.id ? "active-size" : ""}
              onClick={() => setSelectedSize(s)}
            >
              {s.size}
            </button>
          ))}
      </div>

      {selectedSize && (
        <p>
          Вибрано розмір: <b>{selectedSize.size}</b>
        </p>
      )}
      {addedMessage && (
        <p className="added-message">
          Товар додано у кошик
        </p>
      )}
      <button
        className="add-btn"
        onClick={addToCart}
        disabled={!selectedSize}
      >Додати в кошик</button>
    </div>
  </div>
);
}