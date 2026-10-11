const API_URL = "http://localhost:3001/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Помилка запиту до API");
  }

  return data;
}

export function getList(path) {
  return request(path);
}

export function createItem(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateItem(path, id, body) {
  return request(`${path}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteItem(path, id) {
  return request(`${path}/${id}`, {
    method: "DELETE",
  });
}

export function getStudents() {
  return getList("/students");
}

export function getGroups() {
  return getList("/groups");
}

export function getInstructors() {
  return getList("/instructors");
}

export function getVehicles() {
  return getList("/vehicles");
}

export function getLessons() {
  return getList("/lessons");
}

export function getCategories() {
  return getList("/categories");
}
