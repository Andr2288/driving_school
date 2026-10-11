import ResourcePage from "../components/ResourcePage";
import { getCategories } from "../api";

function VehiclesPage() {
  return (
    <ResourcePage
      title="Автопарк"
      endpoint="/vehicles"
      relationLoaders={{
        categories: async () => {
          const categories = await getCategories();
          return categories.map((category) => ({
            value: category.id,
            label: `${category.code} — ${category.name}`,
          }));
        },
      }}
      fields={[
        { name: "brand", label: "Марка", type: "text" },
        { name: "model", label: "Модель", type: "text" },
        { name: "plate_number", label: "Номер", type: "text" },
        {
          name: "year",
          label: "Рік",
          type: "number",
          min: 1990,
          max: 2100,
        },
        {
          name: "category_id",
          label: "Категорія",
          type: "select-number",
          optionsKey: "categories",
        },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "brand", label: "Марка" },
        { key: "model", label: "Модель" },
        { key: "plate_number", label: "Номер" },
        { key: "year", label: "Рік" },
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
      ]}
    />
  );
}

export default VehiclesPage;
