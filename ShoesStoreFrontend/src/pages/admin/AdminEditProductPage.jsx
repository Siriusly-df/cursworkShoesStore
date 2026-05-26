import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../api/admin.api";
import "../../styles/admin/AddProduct.css";

const API_URL = "http://localhost:5223";

export default function AdminEditProductPage() {
  const { id } = useParams();

  const [message, setMessage] = useState("");
  const [sizes, setSizes] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [initialImages, setInitialImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    material: "",
    description: "",
    brand: "Nike",
    categoryId: "1",
    gender: "Unisex",
    season: "All season",
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [size, setSize] = useState("");
  const [stock, setStock] = useState("");
  const [extraFiles, setExtraFiles] = useState([]);
  const [extraPreviews, setExtraPreviews] = useState([]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const data = await getProductById(id);

    setForm({
      name: data.name,
      price: data.price,
      material: data.material,
      description: data.description,
      brand: data.brand,
      categoryId: String(data.categoryId ?? "1"),
      gender: data.gender,
      season: data.season,
    });

    setMainPreview(`${API_URL}${data.image}`);

    setOldImages(data.images || []);
    setInitialImages(data.images || []);
    setSizes(data.sizes || []);
    
    if (data.images) {
      setExtraPreviews(
        data.images.map(x => `${API_URL}${x.imageUrl}`)
      );
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleMainImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const addSize = () => {
  const s = Number(size);
  const st = Number(stock);

  if (isNaN(s) || isNaN(st)) return;
  if (s <= 0 || st <= 0) return;

  if (sizes.some(x => x.size === s)) return;

  setSizes(prev => [
    ...prev,
    {
      size: s,
      stock: st
    }
  ]);
    setSize("");
    setStock("");
  };

  const removeSize = (index) => {
    setSizes( sizes.filter((_, i) => i !== index));
  };

  const handleExtraImages = (e) => {
    const files = Array.from(e.target.files);

    setNewImages(prev => [...prev, ...files]);

    const previews = files.map(file =>URL.createObjectURL(file));

    setNewPreviews(prev => [...prev, ...previews]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", form.name);
    data.append("Price", String(Number(form.price)));
    data.append("material", form.material);
    data.append("description", form.description);
    data.append("brand", form.brand);
    data.append("CategoryId", String(Number(form.categoryId)));
    data.append("gender", form.gender);
    data.append("season", form.season);
    data.append("Sizes", JSON.stringify(sizes));

    data.append("deletedImageIds", JSON.stringify(deletedImages));

    if (mainImage) {
      data.append("mainImage", mainImage);
    }

    newImages.forEach(file => {
      data.append("extraImages", file);
    });

    try {
      await updateProduct(id, data);
      setMessage("Товар оновлено");
    }
    catch {
      setMessage("Помилка при оновленні");
    }
  };

  return (
    <div className="add-product-page">
      <div className="form-card">
        <h1>Редагування товару</h1>
        <form
          onSubmit={handleSubmit}
          className="product-form"
        >
          {mainPreview && (
            <img
              src={mainPreview}
              className="preview-img main"
            />
          )}
          <label className="file-label">Нова головна картинка<input
              type="file"
              accept="image/*"
              onChange={handleMainImage}
            />
          </label>

          <label className="file-label">Нові додаткові фото<input
              type="file"
              multiple
              accept="image/*"
              onChange={handleExtraImages}
            />
          </label>
          <div className="extra-previews">
            {oldImages.map((img, i) => (
              <div key={`old-${i}`} className="img-box">
                <img src={`${API_URL}${img.imageUrl}`} />
                <button type="button"
                  onClick={() => {
                    setDeletedImages(prev => [...prev, img.id]);
                    setOldImages(prev => prev.filter((_, index) => index !== i));
                  }}>✕</button>
              </div>
            ))}
            {newPreviews.map((img, i) => (
              <div key={`new-${i}`} className="img-box">
                <img src={img} />
                <button onClick={() => {
                  setNewPreviews(prev => prev.filter((_, index) => index !== i));
                  setNewImages(prev => prev.filter((_, index) => index !== i));
                }}>✕</button>
              </div>
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
            placeholder="Опис"
            value={form.description}
            onChange={handleChange}
          />
          <div className="field">
          <h3>Категорія</h3>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="1">Кросівки</option>
            <option value="2">Чоботи</option>
            <option value="3">Туфлі</option>
            <option value="4">Босоніжки</option>
          </select>
        </div>
        <div className="field">
          <h3>Бренд</h3>
          <select
            name="brand"
            value={form.brand}
            onChange={handleChange}
          >
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
            <option value="Puma">Puma</option>
            <option value="Clarks">Clarks</option>
            <option value="ECCO">ECCO</option>
          </select>
        </div>
        <div className="field">
          <h3>Гендер</h3>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="Male">Чоловіче</option>
            <option value="Female">Жіноче</option>
            <option value="Unisex">Унісекс</option>
          </select>
        </div>
        <div className="field">
          <h3>Сезон</h3>
          <select
            name="season"
            value={form.season}
            onChange={handleChange}
          >
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
          <button
            type="button"
            onClick={addSize}
          >Додати</button>
        </div>
        <div className="sizes-list-edit" >
          {sizes.map((s, i) => (
            <div key={i} className="size-item-edit"
            style={{display: "flex", gap: "10px", alignItems: "center"}}>
              <span>EU: {s.size}</span>
              <input
                type="number"
                value={s.stock}
                onChange={(e) => {
                  const updated = [...sizes];
                  updated[i].stock = Number(e.target.value);
                  setSizes(updated);
                }}
              />
              <button
                type="button"
                onClick={() => removeSize(i)}
              >✕</button>
            </div>
          ))}
        </div>
          <button type="submit">Зберегти зміни</button>
          {message && (<p className="message">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}