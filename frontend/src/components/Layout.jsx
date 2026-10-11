import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">DS</span>
          <div>
            <p className="brand-name">DriveSchool</p>
            <p className="brand-tag">база автошколи</p>
          </div>
        </div>

        <nav className="site-nav">
          <NavLink to="/" end>
            Головна
          </NavLink>
          <NavLink to="/students">Курсанти</NavLink>
        </nav>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
