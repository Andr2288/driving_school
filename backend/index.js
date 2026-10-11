const express = require("express");
const cors = require("cors");
const { PORT } = require("./db/constants");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", routes);

app.use((error, req, res, next) => {
  console.error(error);

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "Запис із такими унікальними даними вже існує" });
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ error: "Пов'язаний запис не існує" });
  }

  if (error.code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(409).json({ error: "Неможливо видалити: є пов'язані записи" });
  }

  res.status(500).json({ error: "Помилка сервера" });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});
