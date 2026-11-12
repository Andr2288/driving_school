import ResourcePage from "../components/ResourcePage";
import { getGroups, getInstructors, getVehicles } from "../api";

const TYPE_LABELS = {
  theory: "теорія",
  practice: "практика",
};

function LessonsPage() {
  return (
    <ResourcePage
      title="Заняття"
      endpoint="/lessons"
      relationLoaders={{
        groups: async () => {
          const groups = await getGroups();
          return groups.map((group) => ({
            value: group.id,
            label: group.name,
          }));
        },
        instructors: async () => {
          const instructors = await getInstructors();
          return instructors.map((instructor) => ({
            value: instructor.id,
            label: `${instructor.last_name} ${instructor.first_name}`,
          }));
        },
        vehicles: async () => {
          const vehicles = await getVehicles();
          return vehicles.map((vehicle) => ({
            value: vehicle.id,
            label: `${vehicle.model} (${vehicle.plate_number})`,
          }));
        },
      }}
      fields={[
        {
          name: "lesson_date",
          label: "Дата і час",
          type: "datetime-local",
        },
        {
          name: "type",
          label: "Тип",
          type: "select",
          options: [
            { value: "theory", label: TYPE_LABELS.theory },
            { value: "practice", label: TYPE_LABELS.practice },
          ],
        },
        { name: "topic", label: "Тема", type: "text", wide: true },
        {
          name: "group_id",
          label: "Група",
          type: "select-number",
          optionsKey: "groups",
        },
        {
          name: "instructor_id",
          label: "Інструктор",
          type: "select-number",
          optionsKey: "instructors",
        },
        {
          name: "vehicle_id",
          label: "Авто (для практики)",
          type: "select-number",
          optionsKey: "vehicles",
          required: false,
        },
      ]}
      columns={[
        { key: "id", label: "ID" },
        {
          key: "lesson_date",
          label: "Дата",
          render: (item) => String(item.lesson_date).slice(0, 16),
        },
        {
          key: "type",
          label: "Тип",
          render: (item) => TYPE_LABELS[item.type] || item.type,
        },
        { key: "topic", label: "Тема" },
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
        {
          key: "vehicle_id",
          label: "Авто",
          render: (item, relations) => {
            if (!item.vehicle_id) {
              return "—";
            }
            const vehicle = (relations.vehicles || []).find(
              (option) => Number(option.value) === item.vehicle_id
            );
            return vehicle ? vehicle.label : item.vehicle_id;
          },
        },
      ]}
    />
  );
}

export default LessonsPage;
