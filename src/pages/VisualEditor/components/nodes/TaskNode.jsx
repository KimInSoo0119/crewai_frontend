import { Handle, Position } from "@xyflow/react";

export default function TaskNode({ data }) {
  return (
    <div style={styles.container}>
      <div style={styles.title}>{data.name || "New Task"}</div>
      {data.description && (
        <div style={styles.info}>
          <span style={styles.label}>Description:</span> {data.description.substring(0, 50)}
          {data.description.length > 50 ? "..." : ""}
        </div>
      )}
      {data.expected_output && (
        <div style={styles.info}>
          <span style={styles.label}>Output:</span> {data.expected_output.substring(0, 50)}
          {data.expected_output.length > 50 ? "..." : ""}
        </div>
      )}
      
      {/* 위쪽: 입력(target) - agent의 아래쪽(source)과만 연결 */}
      <Handle
        id="task-top"
        type="target"
        position={Position.Top}
        style={styles.handleTop}
      />
      
      {/* 왼쪽: 입력(target) - 다른 task의 오른쪽(source)과만 연결 */}
      <Handle
        id="task-left"
        type="target"
        position={Position.Left}
        style={styles.handleSide}
      />
      
      {/* 오른쪽: 출력(source) - 다른 task의 왼쪽(target)과만 연결 */}
      <Handle
        id="task-right"
        type="source"
        position={Position.Right}
        style={styles.handleSide}
      />
    </div>
  );
}

const styles = {
  container: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #1c7cc4ff",
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
    color: "#1c7cc4ff",
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
  handleTop: {
    width: 5,
    height: 5,
    background: "#555",
    borderRadius: "50%",
    border: "1px solid #fff",
  },
  handleSide: {
    width: 5,
    height: 5,
    background: "#555",
    borderRadius: "50%",
    border: "1px solid #fff",
  },
};