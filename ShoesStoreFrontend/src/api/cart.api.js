export const getCartItems = async (items) => {
  const res = await fetch(`/api/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(items),
  });

  if (!res.ok) throw new Error("Cart error");

  return await res.json();
};