import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../../../../api/axiosClient";

export default function AgentSettingsPanel({node, fetchSettings, onClose, onNodeUpdate}) {
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [backstory, setBackstory] = useState("");
  const [modelId, setModelId] = useState("");
  const [modelOptions, setModelOptions] = useState([]);
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
        } catch (err) {
          console.error(err);
        }
      };

      fetchAgentSettings();
    } else {
      // 임시 노드의 경우 기존 데이터 유지
      setRole(node.data?.role ?? "");
      setGoal(node.data?.goal ?? "");
      setBackstory(node.data?.backstory ?? "");
      setModelId(node.data?.model_id ?? "");
    }
  }, [node, fetchSettings, projectId]);

  if (!node) return null;

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
      
      // 저장 후 반환된 데이터로 해당 노드만 업데이트
      if (onNodeUpdate) {
        const updatedNodeData = {
          role: role,
          goal: goal,
          backstory: backstory,
          model_id: modelId,
          dbId: response.data?.id || node.dbId, // 새로 생성된 경우 ID 업데이트
        };
        
        console.log("Updating node with data:", updatedNodeData);
        onNodeUpdate(node.id, updatedNodeData);
      }
      
      // 전체 플로우를 새로고침하지 않음
      // await onSaved(); // 이 줄을 제거하거나 조건부로 사용

      onClose();
    } catch (err) {
      console.error("Agent save failed", err);
    }
  };

  return (
    <div style={styles.panel}>
      <h4 style={styles.title}>Agent Settings</h4>

      <label style={styles.label}>Role</label>
      <input
        style={styles.input}
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <label style={styles.label}>Model</label>
      <select
        style={styles.select}
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
      >
        <option value="">Select Model</option>
        {modelOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>

      <label style={styles.label}>Goal</label>
      <textarea
        style={styles.textarea}
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter goal"
      />

      <label style={styles.label}>Backstory</label>
      <textarea
        style={styles.textarea}
        value={backstory}
        onChange={(e) => setBackstory(e.target.value)}
        placeholder="Enter backstory"
      />

      <button style={styles.saveBtn} onClick={handleSave}>
        Save
      </button>
      <button style={styles.closeBtn} onClick={onClose}>
        Cancel
      </button>
    </div>
  );
}

const styles = {
  panel: {
    position: "fixed",
    right: 0,
    top: 0,
    width: 500,
    height: "100vh",
    background: "#fff",
    padding: 20,
    boxShadow: "-4px 0 10px rgba(0,0,0,0.1)",
    zIndex: 999,
    overflowY: "auto",
  },
  title: {
    marginBottom: 20,
    fontWeight: "bold",
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ddd",
    marginBottom: 10,
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "8px 8px",
    borderRadius: 6,
    border: "1px solid #ddd",
    marginBottom: 10,
    boxSizing: "border-box",
    fontSize: 12,
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    minHeight: 180,
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ddd",
    marginBottom: 10,
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
    fontSize: 12,
  },
  saveBtn: {
    width: "100%",
    padding: "8px 0",
    marginBottom: 8,
    background: "black",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  closeBtn: {
    width: "100%",
    padding: "8px 0",
    background: "#eee",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};