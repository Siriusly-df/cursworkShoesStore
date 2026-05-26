import React from "react";
import "../styles/ProductCard.css";
import { Link } from "react-router-dom";
import { genderMap, seasonMap } from "../utils/mappers";

const API_URL = "http://localhost:5223";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <img
        src={`${API_URL}${product.image}`}
        alt={product.name}
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{product.price} грн</p>
        <div className="meta">
          <span>{product.brand}</span>
          <span>{genderMap[product.gender] || product.gender}</span>
          <span>{seasonMap[product.season] || product.season}</span>
        </div>
      </div>
    </Link>
  );
}
