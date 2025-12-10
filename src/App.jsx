import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CreateProjectPage from "./pages/CreateProject/CreateProjectPage";
import VisualEditorPage from "./pages/VisualEditor/VisualEditorPage";
import LLMConnectionsPage from "./pages/LLMConnections/LLMConnectionsPage";

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/editor";

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {!hideSidebar && <Sidebar />}
      <main style={{ flex: 1, overflowY: "auto" }}>
        <Routes>
          <Route path="/" element={<CreateProjectPage />} />
          <Route path="/project" element={<CreateProjectPage />} />
          <Route path="/llm_connections" element={<LLMConnectionsPage />} />
          <Route path="/editor" element={<VisualEditorPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
