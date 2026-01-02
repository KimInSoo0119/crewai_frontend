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
      const res = await axiosClient.post("/api/v1/crew/create", { title });
      const projectId = res.data;
      setIsModalOpen(false);
      navigate(`/editor?project_id=${projectId}`);
    } catch (error) {
      console.log("Failed to create project:", error);
    }
  };

  const openProject = (id) => {
    navigate(`/editor?project_id=${id}`);
  };

  const deleteProject = async (id) => {
    try {
      await axiosClient.delete(`/api/v1/crew/delete/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("프로젝트 삭제에 실패했습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Projects</h1>
          <p style={styles.subtitle}>
            {projects.length} {projects.length !== 1 ? "projects" : "project"}
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        <div
          style={styles.newProjectCard}
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow =
              "0 20px 48px rgba(0,0,0,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 2px 12px rgba(0,0,0,0.04)";
          }}
        >
          <div style={styles.newProjectIcon}>+</div>
          <h3 style={styles.cardTitle}>New Project</h3>
          <p style={styles.cardMeta}>Create a new project</p>
        </div>

        {projects.map((project) => (
          <div
            key={project.id}
            style={styles.card}
            onClick={() => openProject(project.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 20px 48px rgba(0,0,0,0.10)";
              const arrow = e.currentTarget.querySelector("[data-arrow]");
              if (arrow) arrow.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 12px rgba(0,0,0,0.04)";
              const arrow = e.currentTarget.querySelector("[data-arrow]");
              if (arrow) arrow.style.transform = "translateX(0)";
            }}
          >
            <div style={styles.cardTop}>
              <div style={styles.cardDot} />
              <button
                style={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(project);
                }}
              >
                ×
              </button>
            </div>

            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{project.title}</h3>
              <p style={styles.cardMeta}>Project</p>
            </div>

            <div style={styles.cardBottom}>
              <span style={styles.viewText}>View project</span>
              <span style={styles.arrow} data-arrow>
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <div style={styles.overlay} onClick={() => setDeleteTarget(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Delete project</h3>
              <p style={styles.modalSubtitle}>
                This action cannot be undone
              </p>
            </div>
            <p style={styles.modalText}>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title}</strong>?
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.cancelButton}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                style={styles.confirmButton}
                onClick={() => {
                  deleteProject(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateProjectPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#ffffff",
    padding: "72px 96px",
    fontFamily:
      "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "64px",
    paddingBottom: "24px",
    borderBottom: "1px solid #f0f0f0",
  },
  headerLeft: {
    display: "flex",
    alignItems: "baseline",
    gap: "16px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "400",
    color: "#000",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#999",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "32px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e0ddddff",
    borderRadius: "16px",
    padding: "32px",
    cursor: "pointer",
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    minHeight: "200px",
  },
  newProjectCard: {
    background: "#fff",
    border: "1px dashed #e0e0e0",
    borderRadius: "16px",
    padding: "32px",
    cursor: "pointer",
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    gap: "12px",
  },
  newProjectIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#f5f5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    color: "#999",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
  },
  deleteButton: {
    width: "28px",
    height: "28px",
    border: "none",
    background: "transparent",
    fontSize: "22px",
    color: "#ccc",
    cursor: "pointer",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "400",
    color: "#000",
  },
  cardMeta: {
    margin: 0,
    fontSize: "13px",
    color: "#bbb",
  },
  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #fafafa",
    paddingTop: "20px",
  },
  viewText: {
    fontSize: "13px",
    color: "#999",
  },
  arrow: {
    fontSize: "18px",
    color: "#ddd",
    transition: "all 0.3s",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "20px",
    padding: "36px",
    maxWidth: "440px",
    width: "90%",
  },
  modalHeader: { 
    marginBottom: "24px"
  },
  modalTitle: { 
    margin: 0, 
    fontSize: "20px" 
  },
  modalSubtitle: { 
    margin: 0, 
    fontSize: "13px", 
    color: "#999" 
  },
  modalText: { 
    fontSize: "14px", 
    marginBottom: "32px" 
  },
  modalButtons: { 
    display: "flex", 
    gap: "12px" 
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    border: "1px solid #e5e5e5",
    background: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },
  confirmButton: {
    flex: 1,
    padding: "12px",
    background: "#b00020",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
