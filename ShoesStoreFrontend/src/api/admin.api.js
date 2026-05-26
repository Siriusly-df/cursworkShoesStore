export const createProduct = async (data) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch("http://localhost:5223/api/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  if (!res.ok) {
    throw new Error("Помилка створення товару");
  }
  return await res.json();
};

export const updateStatus = async (id, status) => {
  const res = await fetch(`/api/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    throw new Error("Status update failed");
  }
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });
  return res.ok;
};

export const getProductById = async (id) => {
  const res = await fetch(`/api/products/${id}`);
  return await res.json();
};


export const updateProduct = async (id, data) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: data
  });

  const result = await res.json();

  if (!res.ok) {
    console.log(result);
    throw new Error("Update error");
  }

  return result;
};
