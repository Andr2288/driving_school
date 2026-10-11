const express = require("express");
const db = require("./db");
const { validateResource } = require("./validate");

const router = express.Router();

const resources = [
  { path: "/categories", table: "categories" },
  { path: "/instructors", table: "instructors" },
  { path: "/vehicles", table: "vehicles" },
  { path: "/groups", table: "training_groups" },
  { path: "/students", table: "students" },
  { path: "/lessons", table: "lessons" },
];

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

async function getById(table, id) {
  const [rows] = await db.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id]);
  return rows[0] || null;
}

for (const resource of resources) {
  router.get(resource.path, async (req, res, next) => {
    try {
      const [rows] = await db.query(
        `SELECT * FROM \`${resource.table}\` ORDER BY id`
      );
      res.json(rows);
    } catch (error) {
      next(error);
    }
  });

  router.get(`${resource.path}/:id`, async (req, res, next) => {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: "Некоректний id" });
      }

      const row = await getById(resource.table, id);
      if (!row) {
        return res.status(404).json({ error: "Запис не знайдено" });
      }

      res.json(row);
    } catch (error) {
      next(error);
    }
  });

  router.post(resource.path, async (req, res, next) => {
    try {
      const { data, errors } = validateResource(resource.table, req.body);
      if (errors.length > 0) {
        return res.status(400).json({ error: errors.join("; ") });
      }

      const columns = Object.keys(data);
      const placeholders = columns.map(() => "?").join(", ");
      const values = columns.map((column) => data[column]);

      const [result] = await db.query(
        `INSERT INTO \`${resource.table}\` (${columns
          .map((column) => `\`${column}\``)
          .join(", ")}) VALUES (${placeholders})`,
        values
      );

      const created = await getById(resource.table, result.insertId);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  });

  router.put(`${resource.path}/:id`, async (req, res, next) => {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: "Некоректний id" });
      }

      const existing = await getById(resource.table, id);
      if (!existing) {
        return res.status(404).json({ error: "Запис не знайдено" });
      }

      const { data, errors } = validateResource(resource.table, req.body);
      if (errors.length > 0) {
        return res.status(400).json({ error: errors.join("; ") });
      }

      const columns = Object.keys(data);
      const assignments = columns.map((column) => `\`${column}\` = ?`).join(", ");
      const values = columns.map((column) => data[column]);

      await db.query(
        `UPDATE \`${resource.table}\` SET ${assignments} WHERE id = ?`,
        [...values, id]
      );

      const updated = await getById(resource.table, id);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  router.delete(`${resource.path}/:id`, async (req, res, next) => {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: "Некоректний id" });
      }

      const existing = await getById(resource.table, id);
      if (!existing) {
        return res.status(404).json({ error: "Запис не знайдено" });
      }

      await db.query(`DELETE FROM \`${resource.table}\` WHERE id = ?`, [id]);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
}

module.exports = router;
