import { useNavigate } from "react-router-dom";

function CreateProjectPage() {
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
    <div style={{ padding: 30 }}>
      <h2>Create Projects</h2>

      <button
        onClick={handleCreateProject}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        + Create New Project
      </button>

      <h2>Existing Projects</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>{project.name}</span>
            <button onClick={() => openProject(project.id)}>Open</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateProjectPage;
