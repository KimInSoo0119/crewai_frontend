import { useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useSearchParams } from "react-router-dom";
import ExecutionPopup from "../popup/ExecutionPopup";
import { poll } from "../../../../utils/polling";
import axiosClient from "../../../../api/axiosClient";

export default function Sidebar({ collapsed, onToggle, flowData }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [agentHierarchy, setAgentHierarchy] = useState([]); 
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project_id");

  const buildExecuteFlowParams = (nodes, edges, projectId) => {
    const formattedNodes = nodes.map(node => {
      let nodeData = {};

      switch (node.type) {
        case 'agent':
          nodeData = {
            id: node.data?.id ?? null,
            model_id: node.data?.model_id ?? null,
            role: node.data?.role ?? "",
            backstory: node.data?.backstory ?? "",
            goal: node.data?.goal ?? "",
            tools: node.data?.tools ?? null
          };
          break;
        default:
          nodeData = {
            id: node.data?.id ?? null,
            agent_id: node.data?.agent_id ?? null,
            name: node.data?.name ?? null,
            description: node.data?.description ?? "",
            expected_output: node.data?.expected_output ?? ""
          };
          break;
      }

      return {
        id: String(node.id),
        dbId: node.dbId ?? null,
        type: String(node.type),
        position: {
          x: node.position?.x ?? 0,
          y: node.position?.y ?? 0
        },
        data: nodeData
      };
    });

    const formattedEdges = edges.map(edge => ({
      id: String(edge.id),
      dbId: edge.dbId ?? null,
      source: String(edge.source),
      target: String(edge.target),
      sourceHandle: edge.sourceHandle ?? null,
      targetHandle: edge.targetHandle ?? null
    }));

    return {
      project_id: Number(projectId),
      nodes: formattedNodes,
      edges: formattedEdges
    };
  };

  const handleExecute = async () => {
    if (!projectId) {
      alert("project_id가 없습니다.");
      return;
    }

    if (!flowData?.nodes || !flowData?.edges) {
      alert("실행할 플로우가 없습니다.");
      return;
    }

    setIsPopupOpen(true);
    setResultData(null);
    setCompletedTasks([]);
    setAgentHierarchy([]);
    setIsExecuting(true);

    try {
      const params = buildExecuteFlowParams(flowData.nodes, flowData.edges, projectId); 
      const executeRes = await axiosClient.post("/api/v1/crew/flow/execute", params);
      console.log("Execute response:", executeRes.data);
      
      const executionId = executeRes.data?.execution_id;
      
      if (!executionId) {
        throw new Error("execution_id를 받지 못했습니다.");
      }
      
      console.log("Execution ID:", executionId);
      
      const finalRes = await poll({
        func: () => axiosClient.get(`/api/v1/crew/flow/status/${executionId}`),
        interval: 3000,
        maxAttempts: 100,
        checkDone: (res) => {
          console.log("Poll response:", res.data);
          return res.data?.status === true;
        },
        onProgress: (res) => {
          const statusData = res.data;
          console.log("Progress update:", statusData);
          
          if (statusData?.result) {
            // workflow 업데이트
            if (statusData.result.workflow) {
              const workflows = statusData.result.workflow;
              console.log("Updating completed tasks:", workflows);
              setCompletedTasks([...workflows]);
            }
            
            // agent_hierarchy 업데이트
            if (statusData.result.agent_hierarchy) {
              console.log("Updating agent hierarchy:", statusData.result.agent_hierarchy);
              setAgentHierarchy([...statusData.result.agent_hierarchy]);
            }
          }
        }
      });

      const finalResult = finalRes.data?.result;
      
      if (!finalResult) {
        console.error("No result in final response:", finalRes.data);
        throw new Error("결과 데이터를 받지 못했습니다.");
      }
      setResultData(finalResult);
      setCompletedTasks(finalResult.workflow || []);
      setAgentHierarchy(finalResult.agent_hierarchy || []); 
      setIsExecuting(false);
      
      console.log("Result data set successfully");
      
    } catch (error) {
      console.error("Failed to execute flow:", error);
      console.error("Error details:", error.response?.data);
      
      alert(`실행 중 오류가 발생했습니다: ${error.message}`);

      setIsPopupOpen(false);
      setResultData(null);
      setCompletedTasks([]);
      setAgentHierarchy([]);
      setIsExecuting(false);
    }
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setResultData(null);
    setCompletedTasks([]);
    setAgentHierarchy([]); 
    setIsExecuting(false);
  }

  const onDragStart = (e, type) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      style={{
        ...styles.sidebarWrapper,
        transform: collapsed ? "translateX(-250px)" : "translateX(0)",
      }}
    >
      <ProSidebar collapsed={false} style={styles.sidebar}>
        <div style={styles.header}>
          <div style={styles.logo}>CrewAI Studio</div>
          <div style={styles.divider}></div>
        </div>

        <div style={styles.menuContainer}>
          <Menu>
            <SubMenu label="Crew" style={styles.subMenuLabel}>
              <MenuItem
                style={styles.menuItem}
                draggable
                onDragStart={(e) => onDragStart(e, "agent")}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
              >
                <div style={styles.menuItemContent}>
                  <span style={styles.menuItemIcon}>👤</span>
                  <span>Agent</span>
                </div>
              </MenuItem>
              <MenuItem
                style={styles.menuItem}
                draggable
                onDragStart={(e) => onDragStart(e, "task")}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
              >
                <div style={styles.menuItemContent}>
                  <span style={styles.menuItemIcon}>📋</span>
                  <span>Task</span>
                </div>
              </MenuItem>
            </SubMenu>
            <SubMenu label="Tools" style={styles.subMenuLabel}>
              <MenuItem
                style={styles.menuItem}
                draggable
                onDragStart={(e) => onDragStart(e, "WebSearchTool")}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
              >
                <div style={styles.menuItemContent}>
                  <span style={styles.menuItemIcon}>🔍</span>
                  <span>WebSearchTool</span>
                </div>
              </MenuItem>
              <MenuItem
                style={styles.menuItem}
                draggable
                onDragStart={(e) => onDragStart(e, "YoutubeChannelTool")}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
              >
                <div style={styles.menuItemContent}>
                  <span style={styles.menuItemIcon}>📺</span>
                  <span>YoutubeChannelTool</span>
                </div>
              </MenuItem>
              <MenuItem
                style={styles.menuItem}
                draggable
                onDragStart={(e) => onDragStart(e, "GithubSearchTool")}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
              >
                <div style={styles.menuItemContent}>
                  <span style={styles.menuItemIcon}>🐙</span>
                  <span>GithubSearchTool</span>
                </div>
              </MenuItem>
            </SubMenu>
          </Menu>
        </div>

        <div style={styles.footer}>
          <button
            style={{
              ...styles.executeButton,
              opacity: isExecuting ? 0.6 : 1,
              cursor: isExecuting ? 'not-allowed' : 'pointer'
            }}
            onClick={handleExecute}
            disabled={isExecuting}
            onMouseEnter={(e) => {
              if (!isExecuting) {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.12)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isExecuting) {
                e.currentTarget.style.backgroundColor = '#000';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.08)';
              }
            }}
          >
            <span style={styles.executeIcon}>
              {isExecuting ? '⏳' : '▶'}
            </span>
            <span>{isExecuting ? 'Executing...' : 'Execute Flow'}</span>
          </button>
        </div>
      </ProSidebar>

      <button 
        onClick={onToggle} 
        style={styles.toggleButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#9a9a9a';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#b0b0b0';
        }}
      >
        {collapsed ? "→" : "←"}
      </button>
      
      <ExecutionPopup
        isOpen={isPopupOpen}
        onClose={handleClose}
        event={isExecuting ? agentHierarchy : (resultData?.agent_hierarchy || agentHierarchy)}
        workflow={resultData?.workflow}
        finalOutput={resultData?.final_output}
        completedTasks={completedTasks}
        isExecuting={isExecuting}
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
    transition: "transform 0.3s ease",
    zIndex: 999,
  },
  sidebar: {
    width: 260,
    height: "100%",
    padding: 0,
    backgroundColor: "#fff",
    boxShadow: "2px 0 10px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  header: {
    padding: "20px 18px 16px",
  },
  logo: {
    fontWeight: "600",
    fontSize: "1rem",
    letterSpacing: "-0.01em",
    color: "#1a1a1a",
    marginBottom: "14px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    width: "100%",
  },
  menuContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 14px",
  },
  subMenuLabel: {
    fontSize: "0.7rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#6b7280",
    padding: "6px 4px",
  },
  menuItem: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    marginBottom: "6px",
    cursor: "grab",
    fontSize: "0.8125rem",
    backgroundColor: "#fff",
    transition: "all 0.2s ease",
    fontWeight: "500",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  menuItemContent: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  menuItemIcon: {
    fontSize: "0.8125rem",
    display: "flex",
    alignItems: "center",
  },
  footer: {
    padding: "12px",
    borderTop: "1px solid #f3f4f6",
    backgroundColor: "#fff",
    marginTop: "auto",
  },
  executeButton: {
    width: "100%",
    padding: "9px 14px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    letterSpacing: "0.01em",
  },
  executeIcon: {
    fontSize: "0.5625rem",
    display: "flex",
    alignItems: "center",
  },
  toggleButton: {
    position: "absolute",
    bottom: 18,
    right: -26,
    width: 26,
    height: 44,
    border: "none",
    borderRadius: "0 5px 5px 0",
    backgroundColor: "#b0b0b0",
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.8125rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    zIndex: 1000,
    boxShadow: "2px 2px 6px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};