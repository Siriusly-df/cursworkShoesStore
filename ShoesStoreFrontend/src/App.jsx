import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import OrderPage from "./pages/OrderPage";
import SearchProductsPage from "./pages/SearchProductsPage"
import EditProfilePage from "./pages/EditProfilePage"

import AdminLayout from "./components/admin/AdminLayout";
import AdminPage from "./pages/admin/AdminPage";
import AddProductPage from "./pages/admin/AddProductPage"
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminEditProductPage from './pages/admin/AdminEditProductPage.jsx'

import ProtectedRoute from "./auth/ProtectedRoute";

function AppContent() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
    <div className="app-wrapper">
      {!isAdmin && <Header />}
       <main className="app-content">
      <Routes >
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/orders" element={<OrderPage/>} />
        <Route path="/products" element={<SearchProductsPage />} />
        <Route path="/profile/edit" element={<EditProfilePage />}/>


        <Route path="/admin" element={
        <ProtectedRoute role="Admin">
         <AdminLayout />
        </ProtectedRoute>}>
        <Route index element={<AdminPage />} />
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="/admin/products/edit/:id" element={<AdminEditProductPage />}/>
        </Route>
      </Routes>
      </main>
      {!isAdmin && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;