import { useState } from "react";
import Sidebar from "./components/panel/Sidebar";
import FlowCanvas from "./components/canvas/FlowCanvas";

export default function VisualEditorPage() {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div style={styles.container}>
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      <div style={styles.canvas}>
        <FlowCanvas />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  canvas: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    overflow: "auto",
  },
};
