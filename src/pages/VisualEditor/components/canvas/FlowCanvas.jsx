import { useState, useEffect, useCallback, useRef } from "react";
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

  // initialFlow로부터의 초기 세팅은 한 번만 수행하고,
  // 이후에는 FlowCanvas 내부 상태를 단일 source of truth로 유지
  const initializedRef = useRef(false);

  useEffect(() => {
    // 조회 API가 완료되어 실제 노드/엣지가 넘어왔을 때 한 번만 초기화
    const hasInitialData =
      initialFlow &&
      ((Array.isArray(initialFlow.nodes) && initialFlow.nodes.length > 0) ||
        (Array.isArray(initialFlow.edges) && initialFlow.edges.length > 0));

    if (!initializedRef.current && hasInitialData) {
      setNodes(initialFlow.nodes || []);
      setEdges(initialFlow.edges || []);
      initializedRef.current = true;
    }
  }, [initialFlow, setNodes, setEdges]);

  // 노드 / 엣지 상태가 변경될 때마다 부모의 flowData를 최신 화면 기준으로 동기화
  useEffect(() => {
    if (typeof setFlowData === "function") {
      setFlowData({ nodes, edges });
    }
  }, [nodes, edges, setFlowData]);

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
    (params) => {
      const sourceNode = nodes.find(
        (n) => String(n.id) === String(params.source)
      );
      const targetNode = nodes.find(
        (n) => String(n.id) === String(params.target)
      );

      if (!sourceNode || !targetNode) {
        return;
      }

      const { sourceHandle, targetHandle } = params;

      // 1) Agent 규칙
      if (sourceNode.type === "agent") {
        // Agent는 Task 위쪽 점(task-top)으로만 연결
        if (targetNode.type !== "task" || targetHandle !== "task-top") {
          alert("Agent는 Task의 위쪽 점과만 연결할 수 있습니다.");
          return;
        }
      }

      // 2) Task 규칙
      if (sourceNode.type === "task") {
        // Task 위쪽 점에서는 시작 불가
        if (sourceHandle === "task-top") {
          alert("Task의 위쪽 점에서는 연결을 시작할 수 없습니다.");
          return;
        }

        if (targetNode.type === "agent") {
          // Task -> Agent 금지
          alert("Task는 Agent와 연결할 수 없습니다. (Agent -> Task만 가능)");
          return;
        }

        if (targetNode.type === "task") {
          // Task -> Task 는 오른쪽(source: task-right) -> 왼쪽(target: task-left)만 허용
          if (!(sourceHandle === "task-right" && targetHandle === "task-left")) {
            alert("Task 간에는 오른쪽 점에서 왼쪽 점으로만 연결할 수 있습니다.");
            return;
          }
        }
      }

      // 위 조건을 모두 통과하면 엣지 생성
      setEdges((eds) => addEdge(params, eds));
    },
    [nodes, setEdges]
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
