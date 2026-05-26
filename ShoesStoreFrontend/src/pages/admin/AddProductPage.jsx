import { useState, useEffect } from "react";
import { createProduct } from "../../api/admin.api";
import "../../styles/admin/AddProduct.css";

export default function AddProductPage() {
  const initialForm = {
    name: "",
    price: "",
    material: "",
    description: "",
    brand: "Nike",
    categoryId: "1",
    gender: "Unisex",
    season: "All season",
  };

  const [form, setForm] = useState(initialForm);
  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState("");
  const [stock, setStock] = useState("");
  const [extraFiles, setExtraFiles] = useState([]);
  const [extraPreviews, setExtraPreviews] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));

    e.target.value = null;
  };

  const handleExtraChange = (e) => {
    const newFiles = Array.from(e.target.files);

    setExtraFiles(prev => {
      const updated = [...prev, ...newFiles].slice(0, 3);
      return updated;
    });

    e.target.value = null;
  };

  useEffect(() => {
    const urls = images.map(file => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  useEffect(() => {
    const urls = extraFiles.map(file => URL.createObjectURL(file));
    setExtraPreviews(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [extraFiles]);

  const addSize = () => {
    const s = Number(size);
    const st = Number(stock);

    if (isNaN(s) || isNaN(st)) return;
    if (s <= 0 || st <= 0) return;

    if (sizes.some(x => x.size === s)) return;

    setSizes(prev => [...prev, { size: s, stock: st }]);
    setSize("");
    setStock("");
  };

  const removeSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  const data = new FormData();

  data.append("name", form.name);
  data.append("price", form.price);
  data.append("material", form.material);
  data.append("description", form.description);
  data.append("brand", form.brand);
  data.append("categoryId", form.categoryId);
  data.append("gender", form.gender);
  data.append("season", form.season);
  if (mainImage) {
    data.append("mainImage", mainImage);
  }
  extraFiles.forEach(file => {
    data.append("extraImages", file);
  });
  images.forEach((img) => {
    data.append("images", img);
  });

  data.append("sizes", JSON.stringify(sizes || []));

console.log("=== FORM DATA DEBUG ===");

for (let pair of data.entries()) {
  console.log(pair[0], pair[1]);
}

    try {
      await createProduct(data);

      setMessage("Товар успішно додано");

      setForm(initialForm);
      setImages([]);
      setPreviews([]);
      setExtraFiles([]);
      setExtraPreviews([]);
      setSizes([]);
      setSize("");
      setStock("");

    } catch (err) {
      setMessage("Помилка при створенні товару");
    }
  };

  return (
    <div className="add-product-page">
      <div className="form-card">
        <h1>Додати товар</h1>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="main-preview">
            {mainPreview && (
              <img src={mainPreview} className="preview-img main" />
            )}
          </div>
          <label className="file-label">
            Виберіть картинку
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <label className="file-label">
            Додаткові фото 
            <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleExtraChange}
          />
          </label>
          <div className="extra-previews">
            {extraPreviews.map((img, i) => (
              <img key={i} src={img} className="preview-img" />
            ))}
          </div>
          <input
            name="name"
            placeholder="Назва"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="price"
            type="number"
            placeholder="Ціна"
            value={form.price}
            onChange={handleChange}
          />
          <input
            name="material"
            placeholder="Матеріал"
            value={form.material}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Опис товару"
            value={form.description}
            onChange={handleChange}
          />
          <div className="field">
            <h3>Категорія</h3>
            <select name="categoryId" value={form.categoryId} onChange={handleChange}>
              <option value="1">Кросівки</option>
              <option value="2">Чоботи</option>
              <option value="3">Туфлі</option>
              <option value="4">Босоніжки</option>
            </select>
          </div>
          <div className="field">
            <h3>Бренд</h3>
            <select name="brand" value={form.brand} onChange={handleChange}>
              <option value="Nike">Nike</option>
              <option value="Adidas">Adidas</option>
              <option value="Puma">Puma</option>
              <option value="Clarks">Clarks</option>
              <option value="ECCO">ECCO</option>
            </select>
          </div>
          <div className="field">
            <h3>Гендер</h3>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="Male">Чоловіче</option>
              <option value="Female">Жіноче</option>
              <option value="Unisex">Унісекс</option>
            </select>
          </div>
          <div className="field">
            <h3>Сезон</h3>
            <select name="season" value={form.season} onChange={handleChange}>
              <option value="Summer">Літо</option>
              <option value="Winter">Зима</option>
              <option value="All season">Демісезон</option>
            </select>
          </div>
          <h3>Розміри</h3>
          <div className="size-box">
            <input
              type="number"
              placeholder="EU: Розмір"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
            <input
              type="number"
              placeholder="Кількість"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <button type="button" onClick={addSize}>
              Додати
            </button>
          </div>
          <div className="sizes-list">
            {sizes.map((s, i) => (
              <div key={i} className="size-item">
                EU: {s.size} — {s.stock} шт
                <button type="button" onClick={() => removeSize(i)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="submit">Створити товар</button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}