import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../../../../api/axiosClient";

export default function TaskSettingsPanel({node, fetchSettings, onClose, onNodeUpdate}) {
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
      setName(node.data?.name ?? "");
      setDescription(node.data?.description ?? "");
      setExpectedOutput(node.data?.expected_output ?? "");
    }
  }, [node, fetchSettings, projectId]);

  if (!node) return null;

  const handleSave = async () => {
    const params = {
      id: node.dbId,
      project_id: Number(projectId),
      name,
      description,
      expected_output: expectedOutput,
    };

    try {
      const response = await axiosClient.post("/api/v1/tasks/save", params);
      
      if (onNodeUpdate) {
        const updatedNodeData = {
          name: name,
          description: description,
          expected_output: expectedOutput,
          dbId: response.data?.id || node.dbId, 
        };
        
        console.log("Updating task node with data:", updatedNodeData);
        onNodeUpdate(node.id, updatedNodeData);
      }

      onClose();
    } catch (err) {
      console.error("Task save failed", err);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.icon}>📋</div>
            <h4 style={styles.title}>Task Settings</h4>
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
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Data Analysis Report"
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
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this task should accomplish..."
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
            <label style={styles.label}>Expected Output</label>
            <textarea
              style={styles.textarea}
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              placeholder="Describe the expected output format and content..."
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
  textarea: {
    width: "100%",
    minHeight: 210,
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
};