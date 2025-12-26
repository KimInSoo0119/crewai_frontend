import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <ProSidebar style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logoMain}>AI Mesh</div>
          <div style={styles.logoSub}>Orchestration</div>
        </div>
      </div>
      <Menu iconShape="circle" className="no-scroll" style={styles.menu}>
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
    backgroundColor: "#006F6F", 
    borderRight: "1px solid #ffffff",
    overflow: "hidden",
    margin: 0,
    padding: 0,
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  header: {
    padding: "32px 24px",
    borderBottom: "1px solid #ffffff",
    marginBottom: "24px",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  logoMain: {
    fontWeight: "600",
    fontSize: "1.25rem",
    letterSpacing: "2px",
    color: "#ffffff",
    lineHeight: "1.4",
    textTransform: "uppercase",
  },
  logoSub: {
    fontWeight: "300",
    fontSize: "0.875rem",
    letterSpacing: "3px",
    color: "#ffffff",
    lineHeight: "1.4",
    textTransform: "uppercase",
    opacity: 0.85,
  },
  menu: {
    padding: "0",
  },
  menuItem: {
    margin: "6px 0",
    borderRadius: "0",
    transition: "all 0.25s ease",
    padding: "0",
  },
  menuLink: {
    textDecoration: "none",
    color: "#ffffff",
    width: "100%",
    display: "block",
    padding: "14px 24px",
    borderRadius: "0",
    transition: "all 0.25s ease",
    fontWeight: "500",
    fontSize: "14px",
  },
  active: {
  fontWeight: "600",
  textDecoration: "none",
  color: "#006F6F",     
  backgroundColor: "#ffffff", 
  width: "100%",
  display: "block",
  borderRadius: "0",
  padding: "14px 24px",
  fontSize: "14px",
},
};
