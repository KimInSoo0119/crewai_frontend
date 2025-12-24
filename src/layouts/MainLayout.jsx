import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
  },
  main: {
    marginLeft: "250px", 
    width: "100%",
    minHeight: "100vh",
    padding: "24px",
    background: "#f5f5f5",
  },
};
