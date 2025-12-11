import { useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import ExecutionPopup from "../popup/ExecutionPopup";

export default function Sidebar({ collapsed, onToggle }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleExecute = () => {
    alert('실행'); 
    setIsPopupOpen(true);
  };

  const onDragStart = (e, type) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      style={{
        ...styles.sidebarWrapper,
        transform: collapsed ? "translateX(-280px)" : "translateX(0)",
      }}
    >
      <ProSidebar collapsed={false} style={styles.sidebar}>
        <div style={styles.header}>CrewAI Studio</div>

        <Menu>
          <SubMenu label="Crew" style={styles.subMenuLabel}>
            <MenuItem
              style={styles.menuItem}
              draggable
              onDragStart={(e) => onDragStart(e, "agent")}
            >
              Agent
            </MenuItem>
            <MenuItem
              style={styles.menuItem}
              draggable
              onDragStart={(e) => onDragStart(e, "task")}
            >
              Task
            </MenuItem>
          </SubMenu>
        </Menu>

        <div style={styles.footer}>
          <button
            style={styles.executeButton}
            onClick={handleExecute}
          >
            Execute
          </button>
        </div>
      </ProSidebar>

      <button onClick={onToggle} style={styles.toggleButton}>
        {collapsed ? "→" : "←"}
      </button>
      
      <ExecutionPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        event={"agent->task"}
        result={"이것은 실행 결과 입니다.\nLLM Output..."}
      />
    </div>
  );
}

const styles = {
  sidebarWrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    display: "flex",
    transition: "transform 0.3s",
    zIndex: 999,
  },
  sidebar: {
    width: 240,
    height: "100%",
    padding: 16,
    backgroundColor: "#fff",
    boxShadow: "5px 0 5px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  header: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 20,
  },
  subMenuLabel: {
    fontSize: 15,
    fontWeight: "bold",
  },
  menuItem: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #ddd", 
    marginBottom: 6,
    cursor: "pointer",
    fontSize: 14,
    backgroundColor: "#fff",
  },
  footer: {
    position: "absolute", 
    bottom: 16,          
    left: 16,
    right: 16,
    display: "flex",
    flexDirection: "column"
  },
  executeButton: {
    width: "100%",
    padding: "9px 0",
    marginBottom: "30px",
    border: "none",
    borderRadius: 6,
    backgroundColor: "black",
    color: "#fff",
    fontSize: 12,
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "background-color 0.2s",
  },
  toggleButton: {
    position: "absolute",
    bottom: 20,
    right: -30,
    width: 30,
    height: 50,
    border: "none",
    borderRadius: "0 6px 6px 0",
    backgroundColor: "#b0b0b0", 
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
    zIndex: 1000,
  },
};
