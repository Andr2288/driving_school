import { useEffect, useState } from "react";
import { createItem, deleteItem, getList, updateItem } from "../api";

function emptyForm(fields) {
  const form = {};
  for (const field of fields) {
    form[field.name] = field.defaultValue ?? "";
  }
  return form;
}

function toInputValue(field, value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (field.type === "datetime-local" && typeof value === "string") {
    return value.replace(" ", "T").slice(0, 16);
  }

  return String(value);
}

function toPayload(fields, form) {
  const payload = {};

  for (const field of fields) {
    const raw = form[field.name];

    if (field.type === "number" || field.type === "select-number") {
      if (raw === "" || raw === null || raw === undefined) {
        payload[field.name] = null;
      } else {
        payload[field.name] = Number(raw);
      }
      continue;
    }

    if (field.type === "datetime-local") {
      payload[field.name] = raw ? `${raw.replace("T", " ")}:00` : "";
      continue;
    }

    payload[field.name] = typeof raw === "string" ? raw.trim() : raw;
  }

  return payload;
}

function ResourcePage({
  title,
  endpoint,
  fields,
  columns,
  relationLoaders = {},
}) {
  const [items, setItems] = useState([]);
  const [relations, setRelations] = useState({});
  const [form, setForm] = useState(() => emptyForm(fields));
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const relationEntries = Object.entries(relationLoaders);
      const relationResults = await Promise.all(
        relationEntries.map(([, loader]) => loader())
      );
      const nextRelations = {};

      relationEntries.forEach(([key], index) => {
        nextRelations[key] = relationResults[index];
      });

      const list = await getList(endpoint);
      setRelations(nextRelations);
      setItems(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [endpoint]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(item) {
    const nextForm = emptyForm(fields);

    for (const field of fields) {
      nextForm[field.name] = toInputValue(field, item[field.name]);
    }

    setEditingId(item.id);
    setForm(nextForm);
    setMessage("");
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm(fields));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = toPayload(fields, form);

    try {
      if (editingId) {
        await updateItem(endpoint, editingId, payload);
        setMessage("Запис оновлено.");
      } else {
        await createItem(endpoint, payload);
        setMessage("Запис додано.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Видалити цей запис?");
    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await deleteItem(endpoint, id);
      if (editingId === id) {
        resetForm();
      }
      setMessage("Запис видалено.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function renderField(field) {
    const value = form[field.name] ?? "";
    const common = {
      id: field.name,
      name: field.name,
      value,
      onChange: handleChange,
      required: field.required !== false,
    };

    if (field.type === "select" || field.type === "select-number") {
      const options = field.options || relations[field.optionsKey] || [];

      return (
        <select {...common}>
          <option value="">Оберіть...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "textarea") {
      return <textarea {...common} rows={3} />;
    }

    return (
      <input
        {...common}
        type={field.type || "text"}
        min={field.min}
        max={field.max}
        step={field.step}
      />
    );
  }

  function renderCell(item, column) {
    if (column.render) {
      return column.render(item, relations);
    }
    return item[column.key];
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h1>{title}</h1>
      </div>

      <form className="resource-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {fields.map((field) => (
            <label
              key={field.name}
              className={field.wide ? "field wide" : "field"}
            >
              <span>{field.label}</span>
              {renderField(field)}
            </label>
          ))}
        </div>

        <div className="form-actions">
          <button className="button" type="submit" disabled={saving}>
            {editingId ? "Зберегти" : "Додати"}
          </button>
          {editingId && (
            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                resetForm();
                setError("");
                setMessage("");
              }}
            >
              Скасувати
            </button>
          )}
        </div>
      </form>

      {loading && <p className="status">Завантаження...</p>}
      {error && <p className="status error">{error}</p>}
      {message && <p className="status success">{message}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="status">Записів поки немає.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {columns.map((column) => (
                    <td key={column.key}>{renderCell(item, column)}</td>
                  ))}
                  <td className="actions-cell">
                    <button
                      className="button button-small"
                      type="button"
                      onClick={() => startEdit(item)}
                    >
                      Редагувати
                    </button>
                    <button
                      className="button button-small button-danger"
                      type="button"
                      onClick={() => handleDelete(item.id)}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ResourcePage;
