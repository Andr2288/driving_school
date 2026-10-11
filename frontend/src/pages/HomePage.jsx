import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  getGroups,
  getInstructors,
  getLessons,
  getStudents,
  getVehicles,
} from "../api";

function HomePage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          students,
          instructors,
          groups,
          vehicles,
          lessons,
          categories,
        ] = await Promise.all([
          getStudents(),
          getInstructors(),
          getGroups(),
          getVehicles(),
          getLessons(),
          getCategories(),
        ]);

        setStats({
          students: students.length,
          instructors: instructors.length,
          groups: groups.length,
          vehicles: vehicles.length,
          lessons: lessons.length,
          categories: categories.length,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <section className="page home-page">
      <div className="hero-copy">
        <p className="eyebrow">Навчальний MVP</p>
        <h1>DriveSchool</h1>
        <p className="lead">
          Облік курсантів, інструкторів, груп, автопарку та занять у одній
          базі даних автошколи.
        </p>
        <Link className="button" to="/students">
          Переглянути курсантів
        </Link>
      </div>

      <div className="stats-block">
        {loading && <p className="status">Завантаження...</p>}
        {error && <p className="status error">{error}</p>}
        {stats && (
          <ul className="stats-list">
            <li>
              <strong>{stats.students}</strong>
              <span>курсанти</span>
            </li>
            <li>
              <strong>{stats.instructors}</strong>
              <span>інструктори</span>
            </li>
            <li>
              <strong>{stats.groups}</strong>
              <span>групи</span>
            </li>
            <li>
              <strong>{stats.vehicles}</strong>
              <span>авто</span>
            </li>
            <li>
              <strong>{stats.lessons}</strong>
              <span>заняття</span>
            </li>
            <li>
              <strong>{stats.categories}</strong>
              <span>категорії</span>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}

export default HomePage;
