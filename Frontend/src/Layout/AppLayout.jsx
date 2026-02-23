import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="app-layout">
      {/* LEFT DRAWER */}
      <NavBar />

      {/* RIGHT CONTENT */}
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
