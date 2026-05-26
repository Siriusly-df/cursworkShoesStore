import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";
import { registerUser } from "../api/auth.api";

export default function RegistrationForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Заповніть всі поля!");
      setSuccess(false);
      return;
    }

    setError("");

    try {
      await registerUser(form);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Реєстрація</h2>
      {success && <p className="success-message">Ви успішно зареєструвались!</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="name" placeholder="Ім'я" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Номер телефону" onChange={handleChange} />
        <div className="password-wrapper">
          <input
            name="password"
            placeholder="Пароль"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Сховати" : "Показати"}
          </button>
        </div>
        <p className="reg-info">* Пароль мінімум 6 символів</p>
        <button type="submit">Зареєструватися</button>
      </form>
    </div>
  );
}