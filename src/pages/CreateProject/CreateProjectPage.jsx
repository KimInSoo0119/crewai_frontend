import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

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

  const handleCreateProject = () => {
    navigate("/editor");
  };

  const openProject = (id) => {
    navigate(`/editor?id=${id}`);
  };

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.header}>Recent Projects</h2>

      <button
        onClick={handleCreateProject}
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
          </div>
        ))}
      </div>
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
};
