import { useState, useEffect, useCallback, useRef } from "react";
import {
  ReactFlow,
  useReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  MarkerType,
} from "@xyflow/react";
import AgentNode from "../nodes/AgentNode";
import TaskNode from "../nodes/TaskNode";
import AgentSettingsPanel from "../panel/AgentSettingsPanel";
import TaskSettingsPanel from "../panel/TaskSettingsPanel";
import "@xyflow/react/dist/style.css";
import axiosClient from "../../../../api/axiosClient";

const nodeTypes = {
  agent: AgentNode,
  task: TaskNode,
};

const defaultEdgeOptions = {
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
  },
  style: {
    strokeWidth: 1.5,
  },
};

export default function FlowCanvas({ setFlowData, initialFlow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow?.edges || []);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isDraggingTool, setIsDraggingTool] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const initializedRef = useRef(false);
  const edgeReconnectSuccessful = useRef(true);

  useEffect(() => {
    const hasInitialData =
      initialFlow &&
      ((Array.isArray(initialFlow.nodes) && initialFlow.nodes.length > 0) ||
        (Array.isArray(initialFlow.edges) && initialFlow.edges.length > 0));

    if (!initializedRef.current && hasInitialData) {
      setNodes(initialFlow.nodes || []);
      // 기존 엣지에도 화살표 추가
      const edgesWithArrows = (initialFlow.edges || []).map(edge => ({
        ...edge,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      }));
      setEdges(edgesWithArrows);
      initializedRef.current = true;
    }
  }, [initialFlow, setNodes, setEdges]);

  useEffect(() => {
    if (typeof setFlowData === "function") {
      setFlowData({ nodes, edges });
    }
  }, [nodes, edges, setFlowData]);

  // Tool 드래그 중일 때 Agent 노드 하이라이트
  useEffect(() => {
    if (isDraggingTool) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isDropTarget: node.type === "agent",
          },
        }))
      );
    } else {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isDropTarget: false,
          },
        }))
      );
    }
  }, [isDraggingTool, setNodes]);

  // 전역 dragend 이벤트 리스너 추가
  useEffect(() => {
    const handleDragEnd = () => {
      setIsDraggingTool(false);
    };

    window.addEventListener('dragend', handleDragEnd);
    return () => {
      window.removeEventListener('dragend', handleDragEnd);
    };
  }, []);

  const updateNodeData = useCallback((nodeId, newData) => {
    console.log("updateNodeData called with:", { nodeId, newData });
    
    const oldNodeId = nodeId;
    const newNodeId = (newData.dbId && String(nodeId).startsWith("tmp-")) 
      ? String(newData.dbId) 
      : nodeId;

    setNodes((nds) => {
      const updated = nds.map((node) => {
        if (node.id === oldNodeId) {
          const updatedNode = {
            ...node,
            id: newNodeId,
            data: {
              ...node.data,
              ...newData,
            },
            dbId: newData.dbId || node.dbId,
          };
          console.log("Node updated:", updatedNode);
          return updatedNode;
        }
        return node;
      });
      console.log("All nodes after update:", updated);
      return updated;
    });

    if (oldNodeId !== newNodeId) {
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          source: edge.source === oldNodeId ? newNodeId : edge.source,
          target: edge.target === oldNodeId ? newNodeId : edge.target,
        }))
      );
    }
    
    // selectedNode도 업데이트
    setSelectedNode((prev) => {
      if (prev && String(prev.id) === String(oldNodeId)) {
        return {
          ...prev,
          id: newNodeId,
          data: {
            ...prev.data,
            ...newData,
          },
          dbId: newData.dbId || prev.dbId,
        };
      }
      return prev;
    });
  }, [setNodes, setEdges]);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => String(n.id) !== String(nodeId)));

    setEdges((eds) => eds.filter(
      (e) => String(e.source) !== String(nodeId) && String(e.target) !== String(nodeId)
    ));
    
    if (selectedNode && String(selectedNode.id) === String(nodeId)) {
      setSelectedNode(null);
      setIsFetchingSettings(false);
    }
  }, [setNodes, setEdges, selectedNode]);

  const openSettings = useCallback((node) => {
    setSelectedNode(node);
    setIsFetchingSettings(!node.id.startsWith("tmp-"));
  }, []);

  const validateConnection = useCallback((sourceNode, targetNode, sourceHandle, targetHandle) => {
    if (!sourceNode || !targetNode) {
      return { valid: false, message: "노드를 찾을 수 없습니다." };
    }

    if (sourceNode.type === "agent") {
      if (targetNode.type !== "task" || targetHandle !== "task-top") {
        return { valid: false, message: "Agent는 Task의 위쪽 점과만 연결할 수 있습니다." };
      }
    }

    if (sourceNode.type === "task") {
      if (sourceHandle === "task-top") {
        return { valid: false, message: "Task의 위쪽 점에서는 연결을 시작할 수 없습니다." };
      }

      if (targetNode.type === "agent") {
        return { valid: false, message: "Task는 Agent와 연결할 수 없습니다. (Agent -> Task만 가능)" };
      }

      if (targetNode.type === "task") {
        if (!(sourceHandle === "task-right" && targetHandle === "task-left")) {
          return { valid: false, message: "Task 간에는 오른쪽 점에서 왼쪽 점으로만 연결할 수 있습니다." };
        }
      }
    }

    return { valid: true };
  }, []);

  const handleConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find(
        (n) => String(n.id) === String(params.source)
      );
      const targetNode = nodes.find(
        (n) => String(n.id) === String(params.target)
      );

      const validation = validateConnection(
        sourceNode,
        targetNode,
        params.sourceHandle,
        params.targetHandle
      );

      if (!validation.valid) {
        alert(validation.message);
        return;
      }

      // 연결할 때 화살표 추가
      const newEdge = {
        ...params,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [nodes, setEdges, validateConnection]
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      const sourceNode = nodes.find(
        (n) => String(n.id) === String(newConnection.source)
      );
      const targetNode = nodes.find(
        (n) => String(n.id) === String(newConnection.target)
      );

      const validation = validateConnection(
        sourceNode,
        targetNode,
        newConnection.sourceHandle,
        newConnection.targetHandle
      );

      if (!validation.valid) {
        alert(validation.message);
        return;
      }

      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [nodes, setEdges, validateConnection]
  );

  const onReconnectEnd = useCallback(
    (_, edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeReconnectSuccessful.current = true;
    },
    [setEdges]
  );

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();
      setIsDraggingTool(false);

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX, 
        y: event.clientY,
      });

      if (type.endsWith("Tool")) {
        const targetNode = nodes.find(
          (node) =>
            position.x >= node.position.x &&
            position.x <= node.position.x + 250 &&
            position.y >= node.position.y &&
            position.y <= node.position.y + 120
        );

        // Agent 노드가 아니면 조용히 무시
        if (!targetNode || targetNode.type !== "agent") {
          return;
        }

        const newTool = { name: type };
        const alreadyHas = (targetNode.data.tools || []).some(
          (t) => t.name === type
        );
        
        if (alreadyHas) {
          alert(`이미 ${type}이 추가된 Agent입니다.`);
          return;
        }

        // dbId 확인 (노드의 dbId 또는 data.dbId 모두 체크)
        let agentId = targetNode.dbId || targetNode.data?.dbId;

        // Agent가 저장되지 않은 경우 먼저 저장
        if (!agentId) {
          try {
            const saveResponse = await axiosClient.post("/api/v1/agents/save", {
              id: null,
              project_id: Number(new URLSearchParams(window.location.search).get("project_id")),
              role: targetNode.data.role || "New Agent",
              goal: targetNode.data.goal || "",
              backstory: targetNode.data.backstory || "",
              model_id: targetNode.data.model_id || null,
              position: targetNode.position || { x: 0, y: 0 },
            });
            
            agentId = saveResponse.data?.[0]?.id;
            
            if (!agentId) {
              alert("Agent 저장에 실패했습니다.");
              return;
            }

            // 노드 업데이트 (dbId 추가)
            updateNodeData(targetNode.id, { dbId: agentId, id: agentId });
            
          } catch (error) {
            console.error("Agent 자동 저장 실패:", error);
            alert("Agent를 저장하지 못해 Tool을 추가할 수 없습니다.");
            return;
          }
        }

        const updatedTools = [...(targetNode.data.tools || []), newTool];
        updateNodeData(targetNode.id, { tools: updatedTools });

        try {
          await axiosClient.post("/api/v1/agents/tools/save", {
            agent_id: agentId,
            tool: newTool,
          });
          console.log(`${type} 저장 완료`);
        } catch (error) {
          console.error("Tool 저장 실패:", error);
          alert("서버 저장 실패!");
        }

        return;
      }

      let nodeData = {};
      if (type === "agent") {
        nodeData = { role: "newNode", tools: [] };
      } else {
        nodeData = { name: "newNode" };
      }

      const newNode = {
        id: `tmp-${Date.now()}`,
        type,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, screenToFlowPosition, setNodes, updateNodeData]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDragEnter = (event) => {
    event.preventDefault();
    const hasData = event.dataTransfer.types.includes("application/reactflow");
    if (hasData) {
      setIsDraggingTool(true);
    }
  };

  const onDragLeave = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDraggingTool(false);
    }
  };

  return (
    <div style={styles.container}>
      <div 
        style={{ flex: 1 }} 
        onDrop={onDrop} 
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodeClick={(event, node) => openSettings(node)}
          onNodesDelete={(deletedNodes) => {
            deletedNodes.forEach((node) => deleteNode(node.id));
          }}
          reconnectRadius={20}
        >
          <Background />
        </ReactFlow>
      </div>

      {selectedNode && selectedNode.type === "agent" && (
        <AgentSettingsPanel
          node={selectedNode}
          fetchSettings={isFetchingSettings}
          onNodeUpdate={updateNodeData}
          onNodeDelete={deleteNode}
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
          onNodeUpdate={updateNodeData}
          onNodeDelete={deleteNode}
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