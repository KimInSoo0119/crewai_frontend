import { Handle, Position } from "@xyflow/react";

export default function TaskNode({ data, onOpenSettings }) {
  return (
    <div style={styles.container}>
      <div style={styles.title}>{data.label}</div>

      <button style={styles.button} onClick={() => onOpenSettings(data.id)}>
        ⚙ 설정
      </button>

      <Handle type="target" position={Position.Top} style={styles.handle} />
      <Handle type="source" position={Position.Bottom} style={styles.handle} />
    </div>
  );
}

const styles = {
  container: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #aaa",
    background: "#fff",
    width: 160,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    fontFamily: "Arial, sans-serif",
    position: "relative",
  },
  title: {
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 6,
  },
  button: {
    alignSelf: "flex-end",
    width: "30%",
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: "black",
    color: "#fff",
    fontWeight: 300,
    fontSize: 9,
    transition: "all 0.2s",
  },
  handle: {
    width: 5,
    height: 5,
    background: "#555",
    borderRadius: "50%",
    border: "1px solid #fff",
  },
};
