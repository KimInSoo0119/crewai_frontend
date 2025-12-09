import { useState, useEffect } from "react";

export default function NodeSettingsPanel({ node, onChange, onClose }) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [output, setOutput] = useState("");

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
      <h4 style={styles.title}>Task Settings</h4>

      <label style={styles.label}>Name</label>
      <input
        style={styles.input}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />

      <label style={styles.label}>Description</label>
      <textarea
        style={styles.textarea}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description"
      />

      <label style={styles.label}>Expected Output</label>
      <textarea
        style={styles.textarea}
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        placeholder="Enter expected output"
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
    width: 280,
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
  textarea: {
    width: "100%",
    minHeight: 230,          
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
    background: "#4a90e2",
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
