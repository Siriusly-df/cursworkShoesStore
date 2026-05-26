import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { loadProducts } from "../api/products.api";

const API_URL = "http://localhost:5223";

export default function SearchProductsPage() {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const search = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    if (!search) return;

    loadProducts(search).then(setProducts);
  }, [search]);
  return (
    <div className="catalog-page">

      <main className="products-content">
        <h1>Результати пошуку</h1>
        <p className="count-products">Запит: {search}</p>
        <p className="count-products">Знайдено товарів: {products.length}</p>
        <div className="products-grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
            />
          ))}
        </div>
      </main>
    </div>
  );
}