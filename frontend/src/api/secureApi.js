const API_URL = "http://localhost:5001";

export async function getUsersSecure() {
  const res = await fetch(`${API_URL}/users`, {
    credentials: "include"
  });
  return await res.json();
}

export async function loginSecure(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include"
  });
  return await res.json();
}