import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import StudentsPage from "./pages/StudentsPage";
import InstructorsPage from "./pages/InstructorsPage";
import GroupsPage from "./pages/GroupsPage";
import VehiclesPage from "./pages/VehiclesPage";
import LessonsPage from "./pages/LessonsPage";
import CategoriesPage from "./pages/CategoriesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/students" replace />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="instructors" element={<InstructorsPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="lessons" element={<LessonsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="*" element={<Navigate to="/students" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
