import { Handle, Position, useReactFlow } from "@xyflow/react";

export default function AgentNode({ data, id }) {
  const { deleteElements } = useReactFlow();

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  const containerStyle = {
    ...styles.container,
    ...(data.isDropTarget && styles.dropTargetContainer),
  };

  const headerBarStyle = {
    ...styles.headerBar,
    ...(data.isDropTarget && styles.dropTargetHeader),
  };

  return (
    <div style={containerStyle}>
      {data.isDropTarget && (
        <div style={styles.dropIndicator}>
          <span style={styles.dropText}>Tool을 여기에 놓으세요</span>
        </div>
      )}
      <div style={headerBarStyle}></div>
      <button
        onClick={handleDelete}
        style={styles.deleteButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#dc2626';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ef4444';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="노드 삭제"
      >
        ×
      </button>
      <div style={styles.content}>
        <div style={styles.iconWrapper}>
          <span style={styles.icon}>👤</span>
        </div>
        <div style={styles.textContent}>
          <div style={styles.title}>{data.role || "New Agent"}</div>
          {data.goal && (
            <div style={styles.info}>
              <span style={styles.label}>Goal</span>
              <span style={styles.value}>
                {data.goal.substring(0, 45)}
                {data.goal.length > 45 ? "..." : ""}
              </span>
            </div>
          )}
          {data.backstory && (
            <div style={styles.info}>
              <span style={styles.label}>Backstory</span>
              <span style={styles.value}>
                {data.backstory.substring(0, 45)}
                {data.backstory.length > 45 ? "..." : ""}
              </span>
            </div>
          )}
          {data.tools && data.tools.length > 0 && (
            <div style={styles.info}>
              <span style={styles.label}>Tools</span>
              <div style={styles.toolsContainer}>
                {data.tools.map((tool, index) => (
                  <span key={index} style={styles.toolBadge}>
                    {tool.name || tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Handle
        id="agent-bottom"
        type="source"
        position={Position.Bottom}
        style={styles.handle}
      />
    </div>
  );
}

const styles = {
  container: {
    borderRadius: "12px",
    border: "1.5px solid #ef4444",
    background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
    width: 220,
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15), 0 2px 4px rgba(0,0,0,0.06)",
    fontFamily: "system-ui, -apple-system, sans-serif",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  dropTargetContainer: {
    border: "3px dashed #4CAF50",
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3), 0 0 0 4px rgba(76, 175, 80, 0.1)",
    transform: "scale(1.05)",
  },
  dropIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    zIndex: 5,
    pointerEvents: "none",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  dropText: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#16a34a",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "4px 12px",
    borderRadius: "12px",
    border: "1.5px solid #4CAF50",
    boxShadow: "0 2px 8px rgba(76, 175, 80, 0.2)",
    whiteSpace: "nowrap",
  },
  headerBar: {
    height: "4px",
    background: "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)",
    width: "100%",
    transition: "all 0.3s ease",
  },
  dropTargetHeader: {
    background: "linear-gradient(90deg, #4CAF50 0%, #16a34a 100%)",
    height: "6px",
  },
  deleteButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "none",
    background: "#ef4444",
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
    background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid #fca5a5",
    boxShadow: "0 2px 4px rgba(239, 68, 68, 0.1)",
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
    color: "#991b1b",
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
    color: "#dc2626",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  value: {
    fontSize: "0.6875rem",
    color: "#6b7280",
    lineHeight: "1.4",
    wordBreak: "break-word",
  },
  toolsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "2px",
  },
  toolBadge: {
    fontSize: "0.625rem",
    padding: "2px 6px",
    background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
    color: "#991b1b",
    borderRadius: "4px",
    border: "1px solid #fca5a5",
    fontWeight: "500",
    whiteSpace: "nowrap",
    lineHeight: "1.2",
  },
  handle: {
    width: "8px",
    height: "8px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
  },
};