CREATE DATABASE IF NOT EXISTS driving_school
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE driving_school;

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(5) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS instructors (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  hire_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  plate_number VARCHAR(15) NOT NULL UNIQUE,
  year INT NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS training_groups (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  instructor_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

CREATE TABLE IF NOT EXISTS students (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  birth_date DATE NOT NULL,
  group_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (group_id) REFERENCES training_groups(id)
);

CREATE TABLE IF NOT EXISTS lessons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lesson_date DATETIME NOT NULL,
  type ENUM('theory', 'practice') NOT NULL,
  topic VARCHAR(255) NOT NULL,
  group_id INT UNSIGNED NOT NULL,
  instructor_id INT UNSIGNED NOT NULL,
  vehicle_id INT UNSIGNED NULL,
  FOREIGN KEY (group_id) REFERENCES training_groups(id),
  FOREIGN KEY (instructor_id) REFERENCES instructors(id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
