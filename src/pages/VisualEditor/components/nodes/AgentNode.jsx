import { Handle, Position } from "@xyflow/react";

export default function AgentNode({ data }) {
  return (
    <div style={styles.container}>
      <div style={styles.title}>{data.role}</div>
      {/* <div>{data.backstory}</div>
      <div>{data.role}</div> */}

      <Handle type="source" position={Position.Bottom} style={styles.handle} />
    </div>
  );
}

const styles = {
  container: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #c41c1cff",
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
  handle: {
    width: 5,
    height: 5,
    background: "#555",
    borderRadius: "50%",
    border: "1px solid #fff",
  },
};
