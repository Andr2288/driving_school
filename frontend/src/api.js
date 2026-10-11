const API_URL = "http://localhost:3001/api";

async function request(path) {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Помилка запиту до API");
  }

  return response.json();
}

export function getStudents() {
  return request("/students");
}

export function getGroups() {
  return request("/groups");
}

export function getInstructors() {
  return request("/instructors");
}

export function getVehicles() {
  return request("/vehicles");
}

export function getLessons() {
  return request("/lessons");
}

export function getCategories() {
  return request("/categories");
}
