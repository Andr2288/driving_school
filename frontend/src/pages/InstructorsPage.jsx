import ResourcePage from "../components/ResourcePage";

function InstructorsPage() {
  return (
    <ResourcePage
      title="Інструктори"
      endpoint="/instructors"
      fields={[
        { name: "first_name", label: "Імʼя", type: "text" },
        { name: "last_name", label: "Прізвище", type: "text" },
        { name: "phone", label: "Телефон", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "hire_date", label: "Дата найму", type: "date" },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "last_name", label: "Прізвище" },
        { key: "first_name", label: "Імʼя" },
        { key: "phone", label: "Телефон" },
        { key: "email", label: "Email" },
        { key: "hire_date", label: "Дата найму" },
      ]}
    />
  );
}

export default InstructorsPage;
