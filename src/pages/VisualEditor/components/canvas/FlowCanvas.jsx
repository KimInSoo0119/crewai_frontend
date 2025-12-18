import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ReactFlow,
  useReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import axiosClient from "../../../../api/axiosClient";
import AgentNode from "../nodes/AgentNode";
import TaskNode from "../nodes/TaskNode";
import AgentSettingsPanel from "../panel/AgentSettingsPanel";
import TaskSettingsPanel from "../panel/TaskSettingsPanel";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  agent: AgentNode,
  task: TaskNode,
};

export default function FlowCanvas({ setFlowData, initialFlow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow?.edges || []);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project_id");

  useEffect(() => {
    if (initialFlow) {
      setNodes(initialFlow.nodes || []);
      setEdges(initialFlow.edges || []);
    }
  }, [initialFlow, setNodes, setEdges]);

  const refreshFlow = useCallback(async () => {
    try {
      const res = await axiosClient.get(`/api/v1/crew/flow/${projectId}`);
      setNodes(res.data.nodes || []);
      setEdges(res.data.edges || []);
    } catch (err) {
      console.error("Failed to refresh flow", err);
    }
  }, [projectId, setNodes, setEdges]);

  const openSettings = useCallback((node) => {
    setSelectedNode(node);
    setIsFetchingSettings(!node.id.startsWith("tmp-"));
  }, []);

  const handleConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let nodeData = {};

      if (type === 'agent') {
        nodeData = {role: "newNode"}
      } else {
        nodeData = {name: "newNode"}
      }

      const newNode = {
        id: `tmp-${Date.now()}`,
        type,
        position,
        data: nodeData
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
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
          onNodeClick={(event, node) => openSettings(node)}
        >
          <Background />
        </ReactFlow>
      </div>

      {selectedNode && selectedNode.type === "agent" && (
        <AgentSettingsPanel
          node={selectedNode}
          fetchSettings={isFetchingSettings}
          onSaved={refreshFlow}
          onClose={() => {
            setSelectedNode(null);
            setIsFetchingSettings(false);
          }}
        />
      )}

      {selectedNode && selectedNode.type === "task" && (
        <TaskSettingsPanel
          node={selectedNode}
          fetchSettings={isFetchingSettings}
          onSaved={refreshFlow}
          onClose={() => {
            setSelectedNode(null);
            setIsFetchingSettings(false);
          }}
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
