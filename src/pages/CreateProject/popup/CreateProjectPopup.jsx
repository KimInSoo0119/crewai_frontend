import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); 

export default function CreateProjectPopup({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");

  const handleCreate = () => {
    if (title.trim()) {
      onCreate(title.trim());
      setTitle(""); 
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Create Project"
    >
      <h2 style={styles.header}>Create Project</h2>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && title.trim()) {
              handleCreate();
            }
          }}
          style={styles.input}
        />
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={handleCreate} style={styles.createButton} disabled={!title.trim()}>
          Create
        </button>
        <button onClick={onClose} style={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: "24px",
    borderRadius: "10px",
    width: "320px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },
};

const styles = {
  header: {
    marginBottom: "16px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },
  inputContainer: {
    display: "flex",
    width: "100%", 
  },
  input: {
    flex: 1, 
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  createButton: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "black",
    color: "white",
    cursor: "pointer",
  },
  cancelButton: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "#f5f5f5",
    cursor: "pointer",
  },
};
