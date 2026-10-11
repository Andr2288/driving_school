USE driving_school;

INSERT INTO categories (id, code, name, description) VALUES
  (1, 'A1', 'Категорія A1', 'Мопеди та легкі мотоцикли до 125 см³'),
  (2, 'A', 'Категорія A', 'Мотоцикли'),
  (3, 'B', 'Категорія B', 'Легкові автомобілі'),
  (4, 'C', 'Категорія C', 'Вантажні автомобілі'),
  (5, 'D', 'Категорія D', 'Автобуси');

INSERT INTO instructors (id, first_name, last_name, phone, email, hire_date) VALUES
  (1, 'Олег', 'Ковальчук', '+380671112233', 'o.kovalchuk@drive.ua', '2018-03-12'),
  (2, 'Марина', 'Шевченко', '+380672223344', 'm.shevchenko@drive.ua', '2019-09-01'),
  (3, 'Андрій', 'Бондар', '+380673334455', 'a.bondar@drive.ua', '2020-01-20'),
  (4, 'Ірина', 'Мельник', '+380674445566', 'i.melnyk@drive.ua', '2021-06-15'),
  (5, 'Тарас', 'Лисенко', '+380675556677', 't.lysenko@drive.ua', '2022-11-03');

INSERT INTO vehicles (id, brand, model, plate_number, year, category_id) VALUES
  (1, 'Honda', 'CB125', 'AA1111AI', 2021, 1),
  (2, 'Yamaha', 'MT-07', 'AA2222AI', 2022, 2),
  (3, 'Volkswagen', 'Golf', 'AA3333AI', 2020, 3),
  (4, 'Toyota', 'Corolla', 'AA4444AI', 2023, 3),
  (5, 'Mercedes-Benz', 'Sprinter', 'AA5555AI', 2019, 4);

INSERT INTO training_groups (id, name, start_date, status, category_id, instructor_id) VALUES
  (1, 'A1-2026-1', '2026-02-02', 'active', 1, 5),
  (2, 'A-2026-1', '2026-02-10', 'active', 2, 3),
  (3, 'B-2026-1', '2026-01-15', 'active', 3, 1),
  (4, 'B-2026-2', '2026-03-01', 'active', 3, 2),
  (5, 'C-2025-3', '2025-11-03', 'completed', 4, 4);

INSERT INTO students (id, first_name, last_name, phone, email, birth_date, group_id) VALUES
  (1, 'Дмитро', 'Іваненко', '+380501111111', 'd.ivanenko@gmail.com', '2004-04-18', 3),
  (2, 'Олена', 'Петрук', '+380502222222', 'o.petruk@gmail.com', '2003-08-09', 3),
  (3, 'Максим', 'Гончар', '+380503333333', 'm.honchar@gmail.com', '2005-01-22', 4),
  (4, 'Софія', 'Романенко', '+380504444444', 's.romanenko@gmail.com', '2002-12-01', 2),
  (5, 'Владислав', 'Кравець', '+380505555555', 'v.kravets@gmail.com', '1999-07-30', 5);

INSERT INTO lessons (id, lesson_date, type, topic, group_id, instructor_id, vehicle_id) VALUES
  (1, '2026-03-02 10:00:00', 'theory', 'Знаки пріоритету', 3, 1, NULL),
  (2, '2026-03-03 09:00:00', 'practice', 'Старт і зупинка', 3, 1, 3),
  (3, '2026-03-04 11:30:00', 'theory', 'Проїзд перехресть', 4, 2, NULL),
  (4, '2026-03-05 16:00:00', 'practice', 'Міське водіння', 2, 3, 2),
  (5, '2026-03-06 08:30:00', 'practice', 'Габарити вантажівки', 5, 4, 5);
