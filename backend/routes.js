const express = require("express");
const db = require("./db");

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

      const [rows] = await db.query(
        `SELECT * FROM \`${resource.table}\` WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Запис не знайдено" });
      }

      res.json(rows[0]);
    } catch (error) {
      next(error);
    }
  });
}

module.exports = router;
