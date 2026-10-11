import ResourcePage from "../components/ResourcePage";
import { getGroups } from "../api";

function StudentsPage() {
  return (
    <ResourcePage
      title="Курсанти"
      endpoint="/students"
      relationLoaders={{
        groups: async () => {
          const groups = await getGroups();
          return groups.map((group) => ({
            value: group.id,
            label: group.name,
          }));
        },
      }}
      fields={[
        { name: "first_name", label: "Імʼя", type: "text" },
        { name: "last_name", label: "Прізвище", type: "text" },
        { name: "phone", label: "Телефон", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "birth_date", label: "Дата народження", type: "date" },
        {
          name: "group_id",
          label: "Група",
          type: "select-number",
          optionsKey: "groups",
        },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "last_name", label: "Прізвище" },
        { key: "first_name", label: "Імʼя" },
        { key: "phone", label: "Телефон" },
        { key: "email", label: "Email" },
        { key: "birth_date", label: "Дата народження" },
        {
          key: "group_id",
          label: "Група",
          render: (item, relations) => {
            const group = (relations.groups || []).find(
              (option) => Number(option.value) === item.group_id
            );
            return group ? group.label : item.group_id;
          },
        },
      ]}
    />
  );
}

export default StudentsPage;
