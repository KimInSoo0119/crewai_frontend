import { Handle, Position } from "@xyflow/react";

export default function TaskNode({ data }) {
  return (
    <div style={styles.container}>
      <div style={styles.title}>{data.name}</div>
      {/* <div>{data.description}</div>
      <div>{data.expected_output}</div> */}

      {/* 위쪽: agent에서만 연결받는 입력(target) */}
      <Handle
        id="task-top"
        type="target"
        position={Position.Top}
        style={styles.handle}
      />

      {/* 왼쪽: task-task 연결에서 입력(target) */}
      <Handle
        id="task-left"
        type="target"
        position={Position.Left}
        style={styles.handle}
      />

      {/* 오른쪽: task-task 연결에서 출력(source) */}
      <Handle
        id="task-right"
        type="source"
        position={Position.Right}
        style={styles.handle}
      />
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
  handle: {
    width: 5,
    height: 5,
    background: "#555",
    borderRadius: "50%",
    border: "1px solid #fff",
  },
};
