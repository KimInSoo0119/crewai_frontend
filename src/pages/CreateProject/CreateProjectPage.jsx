import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import CreateProjectPopup from "./popup/CreateProjectPopup";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosClient.get("/api/v1/crew/list");
        setProjects(res.data); 
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async (title) => {
    try {
      const params = { title: title }
      const res = await axiosClient.post("/api/v1/crew/create", params);
      const projectId = res.data;
      setIsModalOpen(false);
      navigate(`/editor?project_id=${projectId}`);
    } catch (error) {
      console.log("Failed to create projects:", error);
    }
  };

  const openProject = (id) => {
    navigate(`/editor?project_id=${id}`);
  };

  const deleteProject = async (id) => {
    try {
      await axiosClient.delete(`/api/v1/crew/delete/${id}`);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("프로젝트 삭제에 실패했습니다.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.header}>Recent Projects</h2>

      <button
        onClick={() => setIsModalOpen(true)}
        style={styles.createButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#222";
          e.currentTarget.style.borderColor = "#555";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "black";
          e.currentTarget.style.borderColor = "#333";
        }}
      >
        + Create New Project
      </button>

      <div style={styles.projectList}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={styles.projectCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
            }}
          >
            <span style={styles.projectName}>{project.title}</span>
            
            <div style={styles.buttonGroup}>
              <button
                style={styles.openButton}
                onClick={() => openProject(project.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#222";
                  e.currentTarget.style.borderColor = "#555";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "black";
                  e.currentTarget.style.borderColor = "#333";
                }}
              >
                Open
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => setDeleteTarget(project)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#8b0000";
                  e.currentTarget.style.borderColor = "#b00020";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#b00020";
                  e.currentTarget.style.borderColor = "#b00020";
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <p style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#b00020" }}>{deleteTarget.title}</strong> 프로젝트를 삭제하시겠습니까?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={() => {
                  deleteProject(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                style={styles.deleteButton}
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateProjectPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(title) => handleCreateProject(title)}
      />
    </div>
  );
}

const styles = {
  pageContainer: {
    padding: "100px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  header: {
    marginBottom: "30px",
    fontWeight: "500",
    fontSize: "1.7rem",
  },
  createButton: {
    padding: "12px 24px",
    marginBottom: "40px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "8px",
    border: "2px solid #333",
    background: "black",
    color: "white",
    transition: "all 0.2s",
  },
  projectList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  projectCard: {
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "transform 0.15s, box-shadow 0.15s",
    border: "2px solid #bbb",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  projectName: {
    fontSize: "16px",
    fontWeight: "500",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px", 
  },
  openButton: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "2px solid #333",
    background: "black",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  deleteButton: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "2px solid #b00020",
    background: "#b00020",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  cancelButton: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "2px solid #555",
    background: "white",
    color: "#333",
    cursor: "pointer",
    fontWeight: "500",
  },
};
