import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  useReactFlow,
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

export default function FlowCanvas({ setFlowData, initialFlow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow?.edges || []);
  const [selectedNode, setSelectedNode] = useState(null);

  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    if (initialFlow) {
      setNodes(initialFlow.nodes || []);
      setEdges(initialFlow.edges || []);
    }
  }, [initialFlow])

  // 내부 상태를 부모와 동기화하기 위한 useEffect
  useEffect(() => {
    if (setFlowData) {
      setFlowData({ nodes, edges });
    }
  }, [nodes, edges, setFlowData]);

  // 노드 클릭 시 설정 패널 열기
  const openSettings = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) setSelectedNode(node);
    },
    [nodes]
  );

  // 노드 타입 정의
  const nodeTypes = useMemo(
    () => ({
      agent: (props) => <AgentNode {...props} onOpenSettings={openSettings} />,
      task: (props) => <TaskNode {...props} onOpenSettings={openSettings} />,
    }),
    [openSettings]
  );

  // 노드 수정 시
  const handleNodeChange = useCallback(
    (updatedNode) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
      );
      setSelectedNode(null);
    },
    [setNodes]
  );

  // 노드 연결
  const handleConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 드래그앤드롭으로 새 노드 추가
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = `${type}-${Date.now()}`;
      const newNode = {
        id,
        type,
        position,
        data: { label: type.charAt(0).toUpperCase() + type.slice(1), id },
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
        >
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
