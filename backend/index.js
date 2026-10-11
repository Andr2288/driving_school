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
  res.status(500).json({ error: "Помилка сервера" });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});
