import ResourcePage from "../components/ResourcePage";

function CategoriesPage() {
  return (
    <ResourcePage
      title="Категорії"
      endpoint="/categories"
      fields={[
        { name: "code", label: "Код", type: "text" },
        { name: "name", label: "Назва", type: "text" },
        {
          name: "description",
          label: "Опис",
          type: "textarea",
          wide: true,
        },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "code", label: "Код" },
        { key: "name", label: "Назва" },
        { key: "description", label: "Опис" },
      ]}
    />
  );
}

export default CategoriesPage;
