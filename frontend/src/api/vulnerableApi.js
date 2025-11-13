const API_URL = "http://localhost:4000";

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);
  return await res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return await res.json();
}