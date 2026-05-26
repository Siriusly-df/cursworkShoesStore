export const getProductById = async (id) => {
  const res = await fetch(`/api/products/${id}`);

  if (!res.ok) throw new Error("Error product");

  return res.json();
};

export const loadProducts = async (search) => {
  const res = await fetch(
    `/api/products/search?search=${encodeURIComponent(search)}`
  );

  return await res.json();
};