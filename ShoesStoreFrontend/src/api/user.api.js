const API_URL = "http://localhost:5223";

export const deleteAccount = async () => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch("/api/user/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }

  return await res.json();
};

export const updateProfile = async (data) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch("http://localhost:5223/api/user/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw result;
  }

  return result;
};