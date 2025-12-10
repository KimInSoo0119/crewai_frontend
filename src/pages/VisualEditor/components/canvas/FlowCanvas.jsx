import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import AgentNode from "../nodes/AgentNode";
import TaskNode from "../nodes/TaskNode";
import AgentSettingsPanel from "../panel/AgentSettingsPanel";
import TaskSettingsPanel from "../panel/TaskSettingsPanel";
import "@xyflow/react/dist/style.css";

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const openSettings = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) setSelectedNode(node);
    },
    [nodes]
  );

  const nodeTypes = useMemo(
    () => ({
      agent: (props) => <AgentNode {...props} onOpenSettings={openSettings} />,
      task: (props) => <TaskNode {...props} onOpenSettings={openSettings} />,
    }),
    [openSettings]
  );

  const handleNodeChange = (updatedNode) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
    );
    setSelectedNode(null);
  };

  const handleConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const id = `${type}-${Date.now()}`;
      const newNode = {
        id,
        type,
        position: { x: event.clientX - 100, y: event.clientY - 50 },
        data: { label: type.charAt(0).toUpperCase() + type.slice(1), id },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  return (
    <div style={styles.container}>
      <div style={{ flex: 1 }} onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>

      {selectedNode && selectedNode.type === "agent" && (
        <AgentSettingsPanel
          node={selectedNode}
          onChange={handleNodeChange}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {selectedNode && selectedNode.type === "task" && (
        <TaskSettingsPanel
          node={selectedNode}
          onChange={handleNodeChange}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
  },
};
