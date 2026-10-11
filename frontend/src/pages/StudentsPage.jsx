import { useEffect, useState } from "react";
import { getGroups, getStudents } from "../api";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const [studentsData, groupsData] = await Promise.all([
          getStudents(),
          getGroups(),
        ]);
        setStudents(studentsData);
        setGroups(groupsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  function getGroupName(groupId) {
    const group = groups.find((item) => item.id === groupId);
    return group ? group.name : `№${groupId}`;
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Курсанти</h1>
        <p>Список курсантів з бази даних автошколи.</p>
      </div>

      {loading && <p className="status">Завантаження...</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Прізвище</th>
                <th>Імʼя</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата народження</th>
                <th>Група</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.last_name}</td>
                  <td>{student.first_name}</td>
                  <td>{student.phone}</td>
                  <td>{student.email}</td>
                  <td>{student.birth_date}</td>
                  <td>{getGroupName(student.group_id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default StudentsPage;
