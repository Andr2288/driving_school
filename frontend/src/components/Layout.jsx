import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink to="/students" className="brand">
          <img
            className="brand-logo"
            src="/logo.jpg"
            alt="DriveSchool"
          />
        </NavLink>

        <nav className="site-nav">
          <NavLink to="/students">Курсанти</NavLink>
          <NavLink to="/instructors">Інструктори</NavLink>
          <NavLink to="/groups">Групи</NavLink>
          <NavLink to="/vehicles">Автопарк</NavLink>
          <NavLink to="/lessons">Заняття</NavLink>
          <NavLink to="/categories">Категорії</NavLink>
        </nav>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
