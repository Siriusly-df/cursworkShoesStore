import { Link } from "react-router-dom";
import "../../styles/admin/AdminPage.css";
import "../../styles/admin/AdminLayout.css";

export default function AdminPage() {
  return (
    <div className="admin-page">
      <main className="admin-content">
        <h1 className="admin-logo-page">Панель адміністратора</h1>
        <div className="admin-cards">
          <div className="admin-card">
            <h3>Додати товар</h3>
            <p>Створення нового товару</p>
            <Link to="/admin/add-product" className="admin-btn">
              Перейти
            </Link>
          </div>
          <div className="admin-card">
            <h3>Замовлення</h3>
            <p>Перегляд замовлень</p>
            <Link to="/admin/orders" className="admin-btn">
              Перейти
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}