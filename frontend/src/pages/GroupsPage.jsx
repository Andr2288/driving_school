import ResourcePage from "../components/ResourcePage";
import { getCategories, getInstructors } from "../api";

function GroupsPage() {
  return (
    <ResourcePage
      title="Групи"
      endpoint="/groups"
      relationLoaders={{
        categories: async () => {
          const categories = await getCategories();
          return categories.map((category) => ({
            value: category.id,
            label: `${category.code} — ${category.name}`,
          }));
        },
        instructors: async () => {
          const instructors = await getInstructors();
          return instructors.map((instructor) => ({
            value: instructor.id,
            label: `${instructor.last_name} ${instructor.first_name}`,
          }));
        },
      }}
      fields={[
        { name: "name", label: "Назва групи", type: "text" },
        { name: "start_date", label: "Дата старту", type: "date" },
        {
          name: "status",
          label: "Статус",
          type: "select",
          options: [
            { value: "active", label: "active" },
            { value: "completed", label: "completed" },
          ],
        },
        {
          name: "category_id",
          label: "Категорія",
          type: "select-number",
          optionsKey: "categories",
        },
        {
          name: "instructor_id",
          label: "Інструктор",
          type: "select-number",
          optionsKey: "instructors",
        },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Назва" },
        { key: "start_date", label: "Старт" },
        { key: "status", label: "Статус" },
        {
          key: "category_id",
          label: "Категорія",
          render: (item, relations) => {
            const category = (relations.categories || []).find(
              (option) => Number(option.value) === item.category_id
            );
            return category ? category.label : item.category_id;
          },
        },
        {
          key: "instructor_id",
          label: "Інструктор",
          render: (item, relations) => {
            const instructor = (relations.instructors || []).find(
              (option) => Number(option.value) === item.instructor_id
            );
            return instructor ? instructor.label : item.instructor_id;
          },
        },
      ]}
    />
  );
}

export default GroupsPage;
