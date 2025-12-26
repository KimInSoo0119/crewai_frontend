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
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Projects</h1>
          <p style={styles.subtitle}>{projects.length} {projects.length !== 1 ? 'projects' : 'project'}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={styles.createButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #1a1a1a 0%, #000 100%)";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #2d2d2d 0%, #000 100%)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
          }}
        >
           New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyContent}>
            <div style={styles.emptyCircle}>
              <div style={styles.emptyInnerCircle} />
            </div>
            <h3 style={styles.emptyTitle}>Create your first project</h3>
            <p style={styles.emptyText}>Start building AI workflows with CrewAI Studio</p>
            <button
              onClick={() => setIsModalOpen(true)}
              style={styles.emptyButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #1a1a1a 0%, #000 100%)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #2d2d2d 0%, #000 100%)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {projects.map((project) => (
            <div
              key={project.id}
              style={styles.card}
              onClick={() => openProject(project.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.10)";
                const arrow = e.currentTarget.querySelector('[data-arrow]');
                if (arrow) arrow.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                const arrow = e.currentTarget.querySelector('[data-arrow]');
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(176, 0, 32, 0.08)";
                    e.currentTarget.style.color = "#b00020";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#ccc";
                  }}
                >
                  ×
                </button>
              </div>

              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{project.title}</h3>
                <p style={styles.cardMeta}>Project #{project.id}</p>
              </div>

              <div style={styles.cardBottom}>
                <span style={styles.viewText}>View project</span>
                <span style={styles.arrow} data-arrow>→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <div style={styles.overlay} onClick={() => setDeleteTarget(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Delete project</h3>
              <p style={styles.modalSubtitle}>This action cannot be undone</p>
            </div>
            <p style={styles.modalText}>
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
            </p>
            <div style={styles.modalButtons}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={styles.cancelButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fafafa";
                  e.currentTarget.style.borderColor = "#ccc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = "#e5e5e5";
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProject(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                style={styles.confirmButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#8b0000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#b00020";
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
        onCreate={(title) => handleCreateProject(title)}
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#ffffff",
    padding: "72px 96px",
    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
    fontWeight: "400",
  },
  createButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #2d2d2d 0%, #000 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "400",
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
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
    boxShadow: "0 0 0 3px rgba(74, 222, 128, 0.15)",
  },
  deleteButton: {
    width: "28px",
    height: "28px",
    border: "none",
    background: "transparent",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "22px",
    fontWeight: "300",
    color: "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    lineHeight: "1",
  },
  cardContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "400",
    color: "#000",
    letterSpacing: "-0.01em",
    lineHeight: "1.4",
  },
  cardMeta: {
    margin: 0,
    fontSize: "13px",
    color: "#bbb",
    fontWeight: "400",
  },
  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "20px",
    borderTop: "1px solid #fafafa",
  },
  viewText: {
    fontSize: "13px",
    color: "#999",
    fontWeight: "400",
  },
  arrow: {
    fontSize: "18px",
    color: "#ddd",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  emptyState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  emptyContent: {
    textAlign: "center",
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  emptyCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#fafafa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  emptyInnerCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#f0f0f0",
  },
  emptyTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "400",
    color: "#000",
    letterSpacing: "-0.01em",
  },
  emptyText: {
    margin: 0,
    fontSize: "14px",
    color: "#999",
    lineHeight: "1.6",
    fontWeight: "400",
  },
  emptyButton: {
    marginTop: "12px",
    padding: "12px 28px",
    background: "linear-gradient(135deg, #2d2d2d 0%, #000 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    letterSpacing: "0.01em",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    borderRadius: "20px",
    padding: "36px",
    maxWidth: "440px",
    width: "90%",
    boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    marginBottom: "24px",
  },
  modalTitle: {
    margin: "0 0 6px 0",
    fontSize: "20px",
    fontWeight: "400",
    color: "#000",
    letterSpacing: "-0.01em",
  },
  modalSubtitle: {
    margin: 0,
    fontSize: "13px",
    color: "#999",
    fontWeight: "400",
  },
  modalText: {
    margin: "0 0 32px 0",
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
    fontWeight: "400",
  },
  modalButtons: {
    display: "flex",
    gap: "12px",
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    background: "white",
    border: "1px solid #e5e5e5",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#666",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  confirmButton: {
    flex: 1,
    padding: "12px",
    background: "#b00020",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    color: "white",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};