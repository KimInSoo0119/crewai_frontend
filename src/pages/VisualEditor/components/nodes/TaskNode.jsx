import { Handle, Position, useReactFlow } from "@xyflow/react";

export default function TaskNode({ data, id }) {
  const { deleteElements } = useReactFlow();

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerBar}></div>
      <button
        onClick={handleDelete}
        style={styles.deleteButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#2563eb';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#3b82f6';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="노드 삭제"
      >
        ×
      </button>
      
      <Handle
        id="task-top"
        type="target"
        position={Position.Top}
        style={styles.handleTop}
      />
      
      <Handle
        id="task-left"
        type="target"
        position={Position.Left}
        style={styles.handleLeft}
      />
      
      <div style={styles.content}>
        <div style={styles.iconWrapper}>
          <span style={styles.icon}>📋</span>
        </div>
        <div style={styles.textContent}>
          <div style={styles.title}>{data.name || "New Task"}</div>
          {data.description && (
            <div style={styles.info}>
              <span style={styles.label}>Description</span>
              <span style={styles.value}>
                {data.description.substring(0, 45)}
                {data.description.length > 45 ? "..." : ""}
              </span>
            </div>
          )}
          {data.expected_output && (
            <div style={styles.info}>
              <span style={styles.label}>Expected Output</span>
              <span style={styles.value}>
                {data.expected_output.substring(0, 45)}
                {data.expected_output.length > 45 ? "..." : ""}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <Handle
        id="task-right"
        type="source"
        position={Position.Right}
        style={styles.handleRight}
      />
    </div>
  );
}

const styles = {
  container: {
    borderRadius: "12px",
    border: "1.5px solid #3b82f6",
    background: "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
    width: 220,
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15), 0 2px 4px rgba(0,0,0,0.06)",
    fontFamily: "system-ui, -apple-system, sans-serif",
    position: "relative",
    overflow: "visible",
    transition: "all 0.2s ease",
  },
  headerBar: {
    height: "4px",
    background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
    width: "100%",
  },
  deleteButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    lineHeight: "1",
    padding: 0,
  },
  content: {
    padding: "14px 16px",
    display: "flex",
    gap: "12px",
  },
  iconWrapper: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid #93c5fd",
    boxShadow: "0 2px 4px rgba(59, 130, 246, 0.1)",
  },
  icon: {
    fontSize: "1.125rem",
  },
  textContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: 0,
  },
  title: {
    fontWeight: "600",
    fontSize: "0.875rem",
    color: "#1e40af",
    letterSpacing: "-0.01em",
    lineHeight: "1.2",
    wordBreak: "break-word",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  label: {
    fontSize: "0.625rem",
    fontWeight: "600",
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  value: {
    fontSize: "0.6875rem",
    color: "#6b7280",
    lineHeight: "1.4",
    wordBreak: "break-word",
  },
  handleTop: {
    width: "8px",
    height: "8px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
  },
  handleLeft: {
    width: "8px",
    height: "8px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
  },
  handleRight: {
    width: "8px",
    height: "8px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
  },
};