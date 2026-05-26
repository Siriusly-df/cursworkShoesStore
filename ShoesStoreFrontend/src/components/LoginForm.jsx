import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../auth/AuthProvider";

export default function LoginForm() {
  const navigate = useNavigate();
  const { reload } = useAuth();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Заповніть всі поля!");
      return;
    }

    setError("");

    try {
      const data = await loginUser(form);

      localStorage.setItem("accessToken", data.accessToken);

      await reload();

      if (data.user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Вхід</h2>
      {success && <p className="success-message">Ви успішно авторизувались!</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password"
          >
            {showPassword ? "Сховати" : "Показати"}
          </button>
        </div>
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
}