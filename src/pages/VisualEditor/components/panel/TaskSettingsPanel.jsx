import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../../../../api/axiosClient";

export default function TaskSettingsPanel({node, fetchSettings, onSaved, onClose,}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project_id");

  useEffect(() => {
    if (!node) return;
    if (fetchSettings && node.dbId) {
      const fetchTaskSettings = async () => {
        try {
          const res = await axiosClient.get(
            `/api/v1/tasks/projects/${projectId}/tasks/${node.dbId}`
          );
          const task = res.data?.[0];
          if (!task) return;

          setName(task.name ?? "");
          setDescription(task.description ?? "");
          setExpectedOutput(task.expected_output ?? "");
        } catch (err) {
          console.error(err);
        }
      };

      fetchTaskSettings();
    } else {
      setName("");
      setDescription("");
      setExpectedOutput("");
    }
  }, [node, fetchSettings, projectId]);

  if (!node) return null;

  const handleSave = async () => {
    const params = {
      id: node.dbId,
      project_id: Number(projectId),
      agent_id: node.agent_id,
      name: name,
      description: description,
      expected_output: expectedOutput,
    };

    try {
      await axiosClient.post("/api/v1/tasks/save", params);
      await onSaved();
      onClose();
    } catch (err) {
      console.error("Task save failed", err);
    }
  };

  return (
    <div style={styles.panel}>
      <h4 style={styles.title}>Task Settings</h4>

      <label style={styles.label}>Name</label>
      <input
        style={styles.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        value={expectedOutput}
        onChange={(e) => setExpectedOutput(e.target.value)}
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
