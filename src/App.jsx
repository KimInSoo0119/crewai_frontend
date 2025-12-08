import { Routes, Route } from "react-router-dom";
import CreateProjectPage from "./pages/CreateProject/CreateProjectPage"
import VisualEditorPage from "./pages/VisualEditor/VisualEditorPage"

function App() {
  return (
    <Routes>
        <Route path="/" element={<CreateProjectPage />} />
        <Route path="/project" element={<CreateProjectPage />}/>
        <Route path="/editor" element={<VisualEditorPage />} />
    </Routes>
  )
}

export default App
