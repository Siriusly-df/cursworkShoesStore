import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/category.api";
import "../styles/CategoryСard.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(data => {
      setCategories(data);
    });
  }, []);

  const API_URL = "http://localhost:5223";

  return (
    <div className="categories">
      <h1>Категорії</h1>

      <div className="categories-grid">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => navigate(`/category/${cat.id}`)}
          >
            <img
              src={`${API_URL}${cat.image}`}
              alt={cat.name}
            />
            <h2>{cat.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}