function isNonEmptyString(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

function isPositiveInt(value) {
  return Number.isInteger(value) && value >= 1;
}

function isDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isDateTime(value) {
  if (typeof value !== "string") {
    return false;
  }

  const match = value.match(
    /^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/
  );
  if (!match || !isDate(match[1])) {
    return false;
  }

  const hours = Number(match[2]);
  const minutes = Number(match[3]);
  const seconds = match[4] === undefined ? 0 : Number(match[4]);

  return hours <= 23 && minutes <= 59 && seconds <= 59;
}

function isPhone(value) {
  return typeof value === "string" && /^\+380\d{9}$/.test(value.trim());
}

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readBody(body, fields) {
  const data = {};
  const errors = [];

  for (const field of fields) {
    const value = body[field.name];

    if (value === undefined || value === null || value === "") {
      if (field.required) {
        errors.push(`Поле "${field.name}" обов'язкове`);
      } else {
        data[field.name] = null;
      }
      continue;
    }

    if (field.type === "string") {
      if (!isNonEmptyString(value, field.max)) {
        errors.push(`Поле "${field.name}" має бути текстом до ${field.max} символів`);
        continue;
      }
      data[field.name] = value.trim();
      continue;
    }

    if (field.type === "email") {
      if (!isEmail(value) || value.length > field.max) {
        errors.push(`Поле "${field.name}" має бути коректним email`);
        continue;
      }
      data[field.name] = value.trim();
      continue;
    }

    if (field.type === "phone") {
      if (!isPhone(value)) {
        errors.push(`Поле "${field.name}" має бути у форматі +380XXXXXXXXX`);
        continue;
      }
      data[field.name] = value.trim();
      continue;
    }

    if (field.type === "int") {
      const number = Number(value);
      if (!isPositiveInt(number)) {
        errors.push(`Поле "${field.name}" має бути додатним цілим числом`);
        continue;
      }
      const max = field.maxCurrentYear ? new Date().getFullYear() : field.max;
      if (field.min !== undefined && number < field.min) {
        errors.push(`Поле "${field.name}" має бути не менше ${field.min}`);
        continue;
      }
      if (max !== undefined && number > max) {
        errors.push(`Поле "${field.name}" має бути не більше ${max}`);
        continue;
      }
      data[field.name] = number;
      continue;
    }

    if (field.type === "date") {
      if (!isDate(value)) {
        errors.push(`Поле "${field.name}" має бути коректною датою у форматі YYYY-MM-DD`);
        continue;
      }
      if (field.notFuture && value > todayIso()) {
        errors.push(`Поле "${field.name}" не може бути в майбутньому`);
        continue;
      }
      data[field.name] = value;
      continue;
    }

    if (field.type === "datetime") {
      if (!isDateTime(value)) {
        errors.push(
          `Поле "${field.name}" має бути коректною датою у форматі YYYY-MM-DD HH:MM:SS`
        );
        continue;
      }
      data[field.name] = value.replace("T", " ");
      continue;
    }

    if (field.type === "enum") {
      if (!field.values.includes(value)) {
        errors.push(
          `Поле "${field.name}" має бути одним із: ${field.values.join(", ")}`
        );
        continue;
      }
      data[field.name] = value;
    }
  }

  return { data, errors };
}

const schemas = {
  categories: [
    { name: "code", type: "string", max: 5, required: true },
    { name: "name", type: "string", max: 100, required: true },
    { name: "description", type: "string", max: 255, required: true },
  ],
  instructors: [
    { name: "first_name", type: "string", max: 80, required: true },
    { name: "last_name", type: "string", max: 80, required: true },
    { name: "phone", type: "phone", required: true },
    { name: "email", type: "email", max: 120, required: true },
    { name: "hire_date", type: "date", required: true, notFuture: true },
  ],
  vehicles: [
    { name: "brand", type: "string", max: 50, required: true },
    { name: "model", type: "string", max: 50, required: true },
    { name: "plate_number", type: "string", max: 15, required: true },
    { name: "year", type: "int", min: 1990, maxCurrentYear: true, required: true },
    { name: "category_id", type: "int", required: true },
  ],
  training_groups: [
    { name: "name", type: "string", max: 50, required: true },
    { name: "start_date", type: "date", required: true },
    { name: "status", type: "enum", values: ["active", "completed"], required: true },
    { name: "category_id", type: "int", required: true },
    { name: "instructor_id", type: "int", required: true },
  ],
  students: [
    { name: "first_name", type: "string", max: 80, required: true },
    { name: "last_name", type: "string", max: 80, required: true },
    { name: "phone", type: "phone", required: true },
    { name: "email", type: "email", max: 120, required: true },
    { name: "birth_date", type: "date", required: true, notFuture: true },
    { name: "group_id", type: "int", required: true },
  ],
  lessons: [
    { name: "lesson_date", type: "datetime", required: true },
    { name: "type", type: "enum", values: ["theory", "practice"], required: true },
    { name: "topic", type: "string", max: 255, required: true },
    { name: "group_id", type: "int", required: true },
    { name: "instructor_id", type: "int", required: true },
    { name: "vehicle_id", type: "int", required: false },
  ],
};

function validateResource(table, body) {
  const { data, errors } = readBody(body, schemas[table]);

  if (table === "lessons" && data.type === "practice" && data.vehicle_id === null) {
    errors.push('Для практики поле "vehicle_id" обов\'язкове');
  }

  if (table === "lessons" && data.type === "theory") {
    data.vehicle_id = null;
  }

  return { data, errors };
}

module.exports = {
  validateResource,
};
