import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { deleteProduct } from "../../api/admin.api";
import "../../styles/CategoryPage.css";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();

    setProducts(data);
  };
  
  return (
    <div className="catalog-page">
      <main className="products-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1>Усі товари</h1>
          <Link
            to="/admin/add-product"
            className="btn btn-primary"
          >+ Додати товар</Link>
        </div>
        <p className="count-products">Всього товарів: {products.length}</p>
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id}>
              <ProductCard product={p} />
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <Link
                  to={`/admin/products/edit/${p.id}`}
                  className="btn btn-outline"
                >Редагувати
                </Link>
                <button
                  style={{
                    border: 'none',
                  }}
                  className="btn btn-primary"
                  onClick={async () => {
                    const success = await deleteProduct(p.id);
                    if (success) { loadProducts();}
                  }}
                >Видалити</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}