import { useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

export default function Sidebar({ collapsed, onToggle }) {
  const [llmConnections, setLlmConnections] = useState([
    { id: 1, name: "OpenAI GPT-4" },
    { id: 2, name: "Cohere LLM" },
  ]);
  const [selectedConnection, setSelectedConnection] = useState(null);

  const handleExecute = () => {
    if (!selectedConnection) {
      alert("LLM Connection을 선택해주세요!");
      return;
    }
    alert(`Execute 버튼 클릭됨! 사용된 LLM: ${selectedConnection.name}`);
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
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
            >
              Agent
            </MenuItem>
            <MenuItem
              style={styles.menuItem}
              draggable
              onDragStart={(e) => onDragStart(e, "task")}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
            >
              Task
            </MenuItem>
          </SubMenu>

          <SubMenu label="LLM" style={styles.subMenuLabel}>
            {llmConnections.map((conn) => (
              <MenuItem
                key={conn.id}
                style={{
                  ...styles.menuItem,
                  fontWeight: selectedConnection?.id === conn.id ? "bold" : "normal",
                }}
                onClick={() => setSelectedConnection(conn)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
              >
                {conn.name}
              </MenuItem>
            ))}
          </SubMenu>
        </Menu>

        <div style={styles.footer}>
          <button
            style={styles.executeButton}
            onClick={handleExecute}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
          >
            Execute
          </button>
        </div>
      </ProSidebar>

      <button onClick={onToggle} style={styles.toggleButton}>
        {collapsed ? "→" : "←"}
      </button>
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
  },
  header: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 20,
  },
  subMenuLabel: {
    fontSize: 13,
    fontWeight: "bold",
  },
  menuItem: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #ddd", 
    marginBottom: 6,
    cursor: "pointer",
    fontSize: 12,
    backgroundColor: "#fff",
    transition: "background 0.2s",
  },
  footer: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
  },
  executeButton: {
    width: "100%",
    padding: "8px 0",
    border: "none",
    borderRadius: 6,
    backgroundColor: "#fff",
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.2s",
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
