import { useState, useEffect } from "react";
import axiosClient from "../../../../api/axiosClient";

export default function NodeSettingsPanel({ node, onChange, onClose }) {
  const [label, setLabel] = useState("");
  const [model, setModel] = useState("");
  const [modelOptions, setModelOptions] = useState([]);
  const [goal, setGoal] = useState("");
  const [backstory, setBackstroy] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await axiosClient.get("/api/v1/llm/list");
        setModelOptions(res.data);
      } catch (error) {
        console.error("Failed to fetch provider options:", error);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    if (node) setLabel(node.data.label || "");
  }, [node?.id, node?.data.label]);

  if (!node) return null;

  const handleSave = () => {
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        label,
      },
    };
    onChange(updatedNode);
    onClose();
  };

  return (
    <div style={styles.panel}>
      <h4 style={styles.title}>Agent Settings</h4>

      <label style={styles.label}>Role</label>
      <input
        style={styles.input}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />

      <label style={styles.label}>Model</label>
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        style={styles.select}
      >
        <option value="">Select Model</option>
        {modelOptions.map((opt) => (
          <option key={opt.id} value={opt.name}>
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
  },
  title: {
    marginBottom: 20,
    fontWeight: "bold",
  },
  label: { 
    fontSize: 12, 
    marginBottom: 6, 
    display: "block" 
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
