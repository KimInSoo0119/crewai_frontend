import { Routes, Route } from "react-router-dom";
import CreateProjectPage from "./pages/CreateProject/CreateProjectPage";
import VisualEditorPage from "./pages/VisualEditor/VisualEditorPage";
import LLMConnectionsPage from "./pages/LLMConnections/LLMConnectionsPage";
import Layout from "./layouts/MainLayout";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CreateProjectPage />} />
        <Route path="/project" element={<CreateProjectPage />} />
        <Route path="/llm_connections" element={<LLMConnectionsPage />} />
      </Route>

      <Route path="/editor" element={<VisualEditorPage />} />
    </Routes>
  );
}

export default App;
