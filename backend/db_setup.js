const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");
const mysql = require("mysql2/promise");
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  TABLES,
} = require("./db/constants");

const schemaSql = fs.readFileSync(path.join(__dirname, "db", "schema.sql"), "utf8");
const seedSql = fs.readFileSync(path.join(__dirname, "db", "seed.sql"), "utf8");

function formatError(error) {
  if (error.code === "ECONNREFUSED") {
    return "Немає з'єднання з MySQL на порту 3306. Запустіть MySQL у XAMPP.";
  }

  return error.message || error.code || "невідома помилка";
}

function createConnection(withDatabase) {
  return mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: withDatabase ? DB_NAME : undefined,
    multipleStatements: true,
  });
}

async function checkStatus() {
  let connection;

  try {
    connection = await createConnection(false);
  } catch (error) {
    console.log("MySQL: немає з'єднання.");
    console.log("Причина:", formatError(error));
    console.log("Перевірте, що XAMPP запущений і MySQL працює.");
    return;
  }

  console.log("MySQL: підключено.");

  const [databases] = await connection.query("SHOW DATABASES LIKE ?", [DB_NAME]);

  if (databases.length === 0) {
    console.log(`База даних "${DB_NAME}": відсутня.`);
    await connection.end();
    return;
  }

  console.log(`База даних "${DB_NAME}": існує.`);
  await connection.changeUser({ database: DB_NAME });

  const [tables] = await connection.query("SHOW TABLES");
  const tableKey = `Tables_in_${DB_NAME}`;
  const existingTables = tables.map((row) => row[tableKey]);

  if (existingTables.length === 0) {
    console.log("Таблиці: немає.");
    await connection.end();
    return;
  }

  console.log("Таблиці та кількість записів:");

  for (const tableName of TABLES) {
    if (!existingTables.includes(tableName)) {
      console.log(`- ${tableName}: таблиця відсутня`);
      continue;
    }

    const [rows] = await connection.query(`SELECT COUNT(*) AS total FROM \`${tableName}\``);
    console.log(`- ${tableName}: ${rows[0].total}`);
  }

  await connection.end();
}

async function initializeDatabase() {
  const connection = await createConnection(false);

  await connection.query(schemaSql);
  await connection.query(seedSql);
  await connection.end();

  console.log(`Базу даних "${DB_NAME}" ініціалізовано. Сід додано.`);
}

async function reinstallDatabase() {
  const connection = await createConnection(false);

  await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
  await connection.end();

  console.log(`Базу даних "${DB_NAME}" видалено.`);
  await initializeDatabase();
}

function printMenu() {
  console.log("");
  console.log("=== Налаштування бази даних автошколи ===");
  console.log("1. Перевірити стан бази даних");
  console.log("2. Ініціалізувати базу даних");
  console.log("3. Перевстановити базу даних");
  console.log("0. Вихід");
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    while (true) {
      printMenu();
      const choice = (await rl.question("Ваш вибір: ")).trim();

      if (choice === "1") {
        await checkStatus();
        continue;
      }

      if (choice === "2") {
        try {
          await initializeDatabase();
        } catch (error) {
          if (error.code === "ER_DUP_ENTRY") {
            console.log("База вже містить дані. Оберіть пункт 3, щоб перевстановити.");
          } else {
            throw error;
          }
        }
        continue;
      }

      if (choice === "3") {
        await reinstallDatabase();
        continue;
      }

      if (choice === "0") {
        console.log("Вихід.");
        break;
      }

      console.log("Невідомий пункт меню. Введіть 0, 1, 2 або 3.");
    }
  } catch (error) {
    console.log("Помилка:", formatError(error));
  } finally {
    rl.close();
  }
}

main();
