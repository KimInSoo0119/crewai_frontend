import { Handle, Position } from "@xyflow/react";

export default function AgentNode({ data }) {
  return (
    <div style={styles.container}>
      <div style={styles.headerBar}></div>
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
    transition: "all 0.2s ease",
  },
  headerBar: {
    height: "4px",
    background: "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)",
    width: "100%",
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
  handle: {
    width: "8px",
    height: "8px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
  },
};