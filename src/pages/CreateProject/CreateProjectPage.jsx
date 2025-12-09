import { useNavigate } from "react-router-dom";

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const projects = [
    { id: 1, name: "Insoft project 1" },
    { id: 2, name: "Insoft project 2" },
    { id: 3, name: "Insoft project 3" }
  ];

  const handleCreateProject = () => {
    navigate("/editor"); 
  };

  const openProject = (id) => {
    navigate(`/editor?id=${id}`);
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Projects</h1>

      <button
        onClick={handleCreateProject}
        style={styles.createButton}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        + Create New Project
      </button>

      <div style={styles.projectList}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={styles.projectCard}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
          >
            <span style={styles.projectName}>{project.name}</span>
            <button
              onClick={() => openProject(project.id)}
              style={styles.openButton}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
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
    padding: "40px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "30px",
  },
  createButton: {
    padding: "12px 24px",
    marginBottom: "40px",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #999",
    background: "transparent",
    alignSelf: "flex-start",
    transition: "all 0.2s",
  },
  projectList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  projectCard: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s",
    cursor: "pointer",
  },
  projectName: {
    fontSize: "16px",
    fontWeight: "500",
  },
  openButton: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #999",
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};