import Modal from "react-modal";

Modal.setAppElement('#root'); 

export default function ExecutionPopup({
  isOpen,
  onClose,
  event="",
  result="",
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      shouldCloseOnOverlayClick={true}
    >
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>실행 결과</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.body}>
          <div style={styles.leftPanel}>
            <h4>Event</h4>
            <pre style={styles.hierarchyList}>
              {event}
            </pre>
          </div>

          <div style={styles.rightPanel}>
            <h4>Result</h4>
            <pre style={styles.resultBox}>
              {result}
            </pre>
          </div>
        </div>
      </div>
    </Modal>
  );
}

const modalStyles = {
  content: {
    width: "80vw",
    height: "80vh",
    top: "50%",
    left: "50%",
    padding: "0",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 2000,
  },
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#fff",
  },
  header: {
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #ddd",
    background: "#fafafa",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
    marginTop: "-5px",
  },
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  leftPanel: {
    width: "30%",
    borderRight: "1px solid #ddd",
    padding: "16px",
    overflowY: "auto",
  },
  rightPanel: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
  },
  resultBox: {
    background: "#f6f6f6",
    padding: "15px",
    borderRadius: "6px",
    whiteSpace: "pre-wrap",
    height: "100%",
  },
};
