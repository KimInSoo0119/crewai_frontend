import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./components/panel/Sidebar";
import { ReactFlowProvider } from "@xyflow/react";
import FlowCanvas from "./components/canvas/FlowCanvas";
import axiosClient from "../../api/axiosClient";

export default function VisualEditorPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project_id");

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const fetchFlows = async () => {
      if (!projectId) return;
      try {
        const res = await axiosClient.get(`/api/v1/crew/flow/${projectId}`)
        if (res) {
          setFlowData(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch flows:", error)
      }
    };

    fetchFlows();
  }, [projectId])

  return (
    <div style={styles.container}>
      <Sidebar collapsed={collapsed} onToggle={handleToggle} flowData={flowData}/>
      <div style={styles.canvas}>
        <ReactFlowProvider>
          <FlowCanvas setFlowData={setFlowData} initialFlow={flowData}/>
        </ReactFlowProvider>
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
