export const getMe = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  const res = await fetch("/api/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    return null;
  }
  if (!res.ok) {
    throw new Error("Server error");
  }
  return await res.json();
};