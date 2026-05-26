export const registerUser = async (data) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Name: data.name,
      Email: data.email,
      Phone: data.phone,
      Password: data.password,
    }),
  });

  const result = await res.json();
  if (!res.ok) {
    const errors = result.errors
      ? Object.values(result.errors).flat().join(", ")
      : result.message;
    throw new Error(errors || "Register failed");
  }
  return result;
};

export const loginUser = async (data) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      Email: data.email,
      Password: data.password,
    }),
  });

  const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Login failed");
    }
  

  localStorage.setItem("accessToken", result.accessToken);

  return result;
};

export const logoutUser = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  return await res.json();
};

export const refreshToken = async () => {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
};