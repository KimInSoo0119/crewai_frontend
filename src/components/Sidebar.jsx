import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <ProSidebar style={styles.sidebar}>
      <div style={styles.header}>INSoft</div>
      <Menu iconShape="circle" className="no-scroll">
        <MenuItem
          component={<NavLink to="/project" style={({ isActive }) => (isActive ? styles.active : styles.menuLink)} />}
          style={styles.menuItem}
        >
          Create Project
        </MenuItem>
        <MenuItem
          component={<NavLink to="/llm_connections" style={({ isActive }) => (isActive ? styles.active : styles.menuLink)} />}
          style={styles.menuItem}
        >
          LLM Connections
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
}

const styles = {
  sidebar: {
    height: "100vh",
    paddingTop: "20px",
    backgroundColor: "#f9f9f9",
    borderRight: "2px solid #ddd",
    overflow: "hidden", 
  },
  header: {
    padding: "20px",
    fontWeight: "700",
    fontSize: "1.8rem",
    letterSpacing: "1px",
    textAlign: "center",
    marginBottom: "30px",
  },
  menuItem: {
    padding: "12px 20px",
    fontWeight: "500",
    fontSize: "14px",
    borderRadius: "6px",
    transition: "all 0.2s",
    margin: "8px 0",
  },
  menuLink: {
    textDecoration: "none",
    color: "#333",
    width: "100%",
    display: "block",
  },
  active: {
    fontWeight: "600",
    textDecoration: "none",
    color: "#fff",
    backgroundColor: "#444",
    width: "100%",
    display: "block",
    borderRadius: "6px",
    padding: "12px 20px",
  },
};
