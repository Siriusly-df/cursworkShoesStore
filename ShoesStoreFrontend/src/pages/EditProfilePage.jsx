import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EditProfilePage.css";

import { updateProfile } from "../api/user.api";
import { getMe } from "../api/getProfile.api";

export default function EditProfilePage() {

  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    getMe().then(data => {
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        password: ""
      });
    });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    try {
        const res = await updateProfile(form);

        setSuccess(res.message || "Профіль успішно оновлено");

        setTimeout(() => navigate("/"), 1000);

    } catch (err) {
        setError(err.message || "Помилка оновлення профілю");
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="edit-profile-page">
      <form className="edit-profile-card" onSubmit={handleSubmit}>
        {success && (
        <div className="success-msg-profile">{success}</div>
        )}

        {error && (
        <div className="error-msg-profile">{error}</div>
        )}
        <h1>Редагування профілю</h1>
        <input name="name" value={form.name} placeholder="Ім'я" onChange={handleChange} />
        <input name="email" value={form.email} placeholder="Email" onChange={handleChange} />
        <input name="phone" value={form.phone} placeholder="Номер телефона" onChange={handleChange} />
        <input name="password" value={form.password} placeholder="Новий пароль" onChange={handleChange} />
        <p className="hint-profile ">* Якщо пароль не буде введений — він залишиться без змін</p>
        <button type="submit" disabled={loading}>
        {loading ? "Збереження..." : "Зберегти"}
        </button>
      </form>
    </div>
  );
}
 