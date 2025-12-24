import { Handle, Position } from "@xyflow/react";

export default function AgentNode({ data }) {
  return (
    <div style={styles.container}>
      <div style={styles.title}>{data.role || "New Agent"}</div>
      {data.goal && (
        <div style={styles.info}>
          <span style={styles.label}>Goal:</span> {data.goal.substring(0, 50)}
          {data.goal.length > 50 ? "..." : ""}
        </div>
      )}
      {data.backstory && (
        <div style={styles.info}>
          <span style={styles.label}>Backstory:</span> {data.backstory.substring(0, 50)}
          {data.backstory.length > 50 ? "..." : ""}
        </div>
      )}
      
      {/* 아래쪽: 출력(source) - task의 위쪽(target)과만 연결 */}
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
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #c41c1cff",
    background: "#fff",
    width: 180,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontFamily: "Arial, sans-serif",
    position: "relative",
  },
  title: {
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 4,
    color: "#c41c1cff",
  },
  info: {
    fontSize: 11,
    color: "#666",
    lineHeight: 1.4,
  },
  label: {
    fontWeight: 600,
    color: "#333",
  },
  handle: {
    width: 5,
    height: 5,
    background: "#555",
    borderRadius: "50%",
    border: "1px solid #fff",
  },
};