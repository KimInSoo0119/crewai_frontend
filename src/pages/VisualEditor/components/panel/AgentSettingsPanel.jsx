import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../../../../api/axiosClient";

export default function AgentSettingsPanel({node, fetchSettings, onClose, onNodeUpdate}) {
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [backstory, setBackstory] = useState("");
  const [modelId, setModelId] = useState("");
  const [modelOptions, setModelOptions] = useState([]);
  const [tools, setTools] = useState([]);
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project_id");

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await axiosClient.get("/api/v1/llm/list");
        setModelOptions(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    if (!node) return;

    if (fetchSettings && node.dbId) {
      const fetchAgentSettings = async () => {
        try {
          const res = await axiosClient.get(
            `/api/v1/agents/projects/${projectId}/agents/${node.dbId}`
          );

          const agent = res.data?.[0];
          if (!agent) return;

          setRole(agent.role ?? "");
          setGoal(agent.goal ?? "");
          setBackstory(agent.backstory ?? "");
          setModelId(agent.model_id ?? "");
          setTools(agent.tools ?? []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchAgentSettings();
    } else {
      setRole(node.data?.role ?? "");
      setGoal(node.data?.goal ?? "");
      setBackstory(node.data?.backstory ?? "");
      setModelId(node.data?.model_id ?? "");
      setTools(node.data?.tools ?? []);
    }
  }, [node, fetchSettings, projectId]);

  const handleDeleteTool = async (toolId, toolName) => {
    if (!node?.dbId) {
      alert("Agent가 저장되지 않아 Tool을 삭제할 수 없습니다.");
      return;
    }

    try {
      const params = { agent_id: node.dbId, tool_name: toolName };
      await axiosClient.post("/api/v1/agents/tools/del", params);

      const updatedTools = tools.filter(t => t.name !== toolName);
      setTools(updatedTools);

      if (onNodeUpdate) {
        onNodeUpdate(node.id, { tools: updatedTools });
      }

      console.log("Tool 삭제 완료:", toolName);
    } catch (err) {
      console.error("Tool delete failed", err);
      alert("Tool 삭제에 실패했습니다.");
    }
  };

  const handleSave = async () => {
    const params = {
      id: node.dbId,
      project_id: Number(projectId),
      role,
      goal,
      backstory,
      model_id: Number(modelId),
    };

    try {
      const response = await axiosClient.post("/api/v1/agents/save", params);

      if (onNodeUpdate) {
        const updatedNodeData = {
          role,
          goal,
          backstory,
          model_id: modelId,
          dbId: response.data?.id || node.dbId,
          tools: tools
        };
        onNodeUpdate(node.id, updatedNodeData);
      }

      onClose();
    } catch (err) {
      console.error("Agent save failed", err);
    }
  };

  if (!node) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.icon}>👤</div>
            <h4 style={styles.title}>Agent Settings</h4>
          </div>
          <button 
            style={styles.closeIconBtn} 
            onClick={onClose}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.content}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <input
              style={styles.input}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Data Analyst"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.backgroundColor = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#fafafa';
              }}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Model</label>
            <select
              style={styles.select}
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.backgroundColor = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#fafafa';
              }}
            >
              <option value="">Select Model</option>
              {modelOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Goal</label>
            <textarea
              style={styles.textarea}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Describe the agent's primary objective..."
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.backgroundColor = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#fafafa';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Backstory</label>
            <textarea
              style={styles.textarea}
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              placeholder="Provide context and background for the agent..."
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.backgroundColor = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#fafafa';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tools</label>

            {tools.length === 0 ? (
              <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                No tools assigned. Drag a tool into this agent.
              </div>
            ) : (
              <ul style={{ paddingLeft: 0, margin: 0 }}>
                {tools.map((tool, idx) => (
                  <li
                    key={tool.id ?? idx}
                    style={styles.toolItem}
                  >
                    <span>{tool.name}</span>

                    <button
                      style={styles.toolDeleteBtn}
                      onClick={() => handleDeleteTool(tool.id, tool.name)}
                      onMouseEnter={(e)=>e.currentTarget.style.backgroundColor="#f3f4f6"}
                      onMouseLeave={(e)=>e.currentTarget.style.backgroundColor="transparent"}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div style={styles.footer}>
          <button 
            style={styles.closeBtn} 
            onClick={onClose}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            Cancel
          </button>
          <button 
            style={styles.saveBtn} 
            onClick={handleSave}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'black';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.08)';
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 998,
    backdropFilter: "blur(2px)",
  },
  panel: {
    position: "fixed",
    right: 0,
    top: 0,
    width: 360,
    height: "100vh",
    background: "#fff",
    boxShadow: "-2px 0 20px rgba(0,0,0,0.08)",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },
  icon: {
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontWeight: "600",
    fontSize: "0.875rem",
    color: "#1a1a1a",
    letterSpacing: "-0.005em",
  },
  closeIconBtn: {
    background: "transparent",
    border: "none",
    fontSize: "0.9375rem",
    color: "#9ca3af",
    cursor: "pointer",
    width: "26px",
    height: "26px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    fontWeight: "300",
  },
  divider: {
    height: "1px",
    backgroundColor: "#f3f4f6",
    margin: "0 18px",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "18px",
  },
  formGroup: {
    marginBottom: "14px",
  },
  label: {
    fontSize: "0.6875rem",
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: "6px",
    display: "block",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "8px 11px",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
    fontSize: "0.75rem",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    color: "#1a1a1a",
    backgroundColor: "#fafafa",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "8px 11px",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
    fontSize: "0.75rem",
    boxSizing: "border-box",
    fontFamily: "inherit",
    color: "#1a1a1a",
    backgroundColor: "#fafafa",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: 180,
    padding: "8px 11px",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
    fontSize: "0.75rem",
    color: "#1a1a1a",
    lineHeight: "1.5",
    transition: "all 0.2s ease",
    backgroundColor: "#fafafa",
    outline: "none",
  },
  footer: {
    padding: "14px 18px",
    borderTop: "1px solid #f3f4f6",
    display: "flex",
    gap: "7px",
    backgroundColor: "#fff",
  },
  closeBtn: {
    flex: 1,
    padding: "8px 0",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "#6b7280",
    transition: "all 0.2s ease",
  },
  saveBtn: {
    flex: 1,
    padding: "8px 0",
    background: "black",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    transition: "all 0.2s ease",
    letterSpacing: "0.01em",
  },
  toolItem: {
    listStyle: "none",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    marginBottom: "6px",
    backgroundColor: "#fff",
    fontSize: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  toolDeleteBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "4px 6px",
    borderRadius: "4px",
    color: "#9ca3af",
    fontSize: "0.75rem",
    transition: "all 0.2s ease",
  },
};