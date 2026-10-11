const DB_HOST = "127.0.0.1";
const DB_PORT = 3306;
const DB_USER = "root";
const DB_PASSWORD = "";
const DB_NAME = "driving_school";

const TABLES = [
  "categories",
  "instructors",
  "vehicles",
  "training_groups",
  "students",
  "lessons",
];

module.exports = {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  TABLES,
};
