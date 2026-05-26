export const getCategories = async () => {
  const res = await fetch("/api/categories");
  if (!res.ok) {
    throw new Error("Помилка отримання категорій");
  }
  return await res.json();
};

export const getCategoryById = async (id) => {
  const res = await fetch(`/api/categories/${id}`);
  if (!res.ok) throw new Error("Error");
  return res.json();
};

export const getProductsByCategory = async (id) => {
  const res = await fetch(`/api/products?categoryId=${id}`);
  if (!res.ok) throw new Error("Error products");
  return res.json();
};