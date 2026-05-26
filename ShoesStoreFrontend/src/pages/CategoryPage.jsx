import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getCategoryById } from "../api/category.api";
import "../styles/CategoryPage.css";

export default function CategoryPage() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  const [brandId, setBrandId] = useState("");
  const [gender, setGender] = useState("");
  const [season, setSeason] = useState("");

  useEffect(() => {
    getCategoryById(id).then(setCategory);
  }, [id]);

  useEffect(() => {
    loadProducts();
  }, [id, brandId, gender, season]);

  const loadProducts = async () => {
    const params = new URLSearchParams();

    params.append("categoryId", id);

    if (brandId) params.append("brand", brandId);
    if (gender) params.append("gender", gender);
    if (season) params.append("season", season);

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    setProducts(data);
  };

  return (
    <div className="catalog-page">

      <aside className="filters">

        <h2>Фільтри</h2>

      <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
        <option value="">Усі бренди</option>
        <option value="Nike">Nike</option>
        <option value="Adidas">Adidas</option>
        <option value="Puma">Puma</option>
        <option value="Clarks">Clarks</option>
        <option value="ECCO">ECCO</option>
      </select>

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Уся стать</option>
          <option value="Male">Чоловіче</option>
          <option value="Female">Жіноче</option>
          <option value="Unisex">Унісекс</option>
        </select>

        <select value={season} onChange={(e) => setSeason(e.target.value)}>
          <option value="">Усі сезони</option>
          <option value="Summer">Літо</option>
          <option value="Winter">Зима</option>
          <option value="All season">Демісезон</option>
        </select>

        <button
          className="reset-btn"
          onClick={() => {
            setBrandId("");
            setGender("");
            setSeason("");
          }}
        >Скинути фільтри</button>
      </aside>
      <main className="products-content">
        <h1>{category?.name}</h1>
        <p className="count-products">
          Знайдено товарів: {products.length}
        </p>
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