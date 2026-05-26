import { Outlet, NavLink } from "react-router-dom";
import "../../styles/admin/AdminPage.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          VELORA <span>ADMIN</span>
        </div>
        <nav className="admin-menu">
          <NavLink to="/admin" className="admin-link">Головна</NavLink>
          <NavLink to="/admin/products" className="admin-link">Товари</NavLink>
          <NavLink to="/admin/orders" className="admin-link">Замовлення</NavLink>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}