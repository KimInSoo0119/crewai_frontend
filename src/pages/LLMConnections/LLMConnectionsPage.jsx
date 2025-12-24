import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

export default function LLMConnectionsPage() {
  const [connectionName, setConnectionName] = useState("");
  const [provider, setProvider] = useState("");
  const [providerOptions, setProviderOptions] = useState([]);
  const [llmList, setLlmList] = useState([]);
  const [envVars, setEnvVars] = useState([
    { id: crypto.randomUUID(), key: "OPENAI_API_KEY", value: "" },
    { id: crypto.randomUUID(), key: "OPENAI_API_BASE", value: "" },
  ]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axiosClient.get("/api/v1/llm/provider/list");
        setProviderOptions(res.data);
      } catch (error) {
        console.error("Failed to fetch provider options:", error);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    fetchLLMList();
  }, []);

  const fetchLLMList = async () => {
    try {
      const res = await axiosClient.get("/api/v1/llm/list");
      setLlmList(res.data || []);
    } catch (error) {
      console.error("Failed to fetch LLM list:", error);
      setLlmList([]);
    }
  };

  const addVariable = () => {
    setEnvVars([...envVars, { id: crypto.randomUUID(), key: "", value: "" }]);
  };

  const updateEnvVar = (id, field, value) => {
    setEnvVars(envVars.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const removeEnvVar = (id) => {
    setEnvVars(envVars.filter(v => v.id !== id));
  };

  const handleAddConnection = async () => {
    try {

      const apiKey = envVars.find(v => v.key === "OPENAI_API_KEY")?.value || "";
      const apiBase = envVars.find(v => v.key === "OPENAI_API_BASE")?.value || "";

      if (!connectionName || !provider || !apiKey || !apiBase) {
        alert("Please fill all fields!");
        return;
      }

      const params = {
        name: connectionName,
        provider: provider,
        api_key: apiKey,
        api_base: apiBase,
      };

      const response = await axiosClient.post("/api/v1/llm/connection", params);
      console.log("Connection added:", response);

      setConnectionName("");
      setProvider("");
      setEnvVars([
        { id: crypto.randomUUID(), key: "OPENAI_API_KEY", value: "" },
        { id: crypto.randomUUID(), key: "OPENAI_API_BASE", value: "" },
      ]);

      alert("Connection added successfully!");
      fetchLLMList();
    } catch (error) {
      console.error("Failed to add connection:", error);
      alert("Failed to add connection. Check console for details.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>LLM Connections</h1>
      <p style={styles.subtitle}>Manage your language model API connections</p>

      <div style={styles.listContainer}>
        <h2 style={styles.sectionTitle}>Connected LLM Models ({llmList.length})</h2>
        {llmList.length === 0 ? (
          <div style={styles.emptyState}>No LLM connections found. Add one below.</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>Name</th>
                  <th style={styles.tableHeader}>Provider</th>
                  <th style={styles.tableHeader}>API Base URL</th>
                  <th style={styles.tableHeader}>Created</th>
                </tr>
              </thead>
              <tbody>
                {llmList.map((llm) => (
                  <tr key={llm.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{llm.name}</td>
                    <td style={styles.tableCell}>
                      <span style={styles.providerBadge}>{llm.provider}</span>
                    </td>
                    <td style={styles.tableCell}>{llm.api_base_url}</td>
                    <td style={styles.tableCell}>
                      {new Date(llm.create_time).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={styles.formContainer}>
        <div style={styles.formHeader}>
          <button style={styles.plusButton}>+</button>
          <h2 style={styles.formTitle}>Add New Connection</h2>
        </div>

        <div style={styles.row}>
          <input
            placeholder="LLM Connection Name"
            value={connectionName}
            onChange={(e) => setConnectionName(e.target.value)}
            style={styles.input}
          />
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Provider</option>
            {providerOptions.map((opt) => (
              <option key={opt.id} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.apiCredsSection}>
          <div style={styles.warning}>
            The following environment variables are required: OPENAI_API_KEY, OPENAI_API_BASE
          </div>

          {envVars.map((envVar) => (
            <div key={envVar.id} style={styles.envVarRow}>
              <input
                placeholder="ENV_VAR_KEY"
                value={envVar.key}
                onChange={(e) => updateEnvVar(envVar.id, "key", e.target.value)}
                style={{ ...styles.input, flex: 2, marginRight: 8 }}
              />
              <input
                placeholder="env-var-value"
                value={envVar.value}
                onChange={(e) => updateEnvVar(envVar.id, "value", e.target.value)}
                style={{ ...styles.input, flex: 3, marginRight: 8 }}
              />
              <button
                onClick={() => removeEnvVar(envVar.id)}
                style={styles.removeButton}
                aria-label="Remove variable"
              >
                ×
              </button>
            </div>
          ))}
          <button onClick={addVariable} style={styles.addVarButton}>
            + Add Variable
          </button>
        </div>

        <div style={styles.infoBox}>
          <p><b>Important setup information:</b></p>
          <ul>
            <li>
              For <code>OPENAI_API_BASE</code>, include the full base URL with <code>/v1</code> at the end
            </li>
            <li>
              For <code>OPENAI_API_KEY</code>, provide the API key that will be sent in the Authorization header
            </li>
            <li>Use the "Fetch Available Models" button to verify your connection settings</li>
          </ul>
        </div>

        <div style={{ textAlign: "right" }}>
          <button style={styles.submitButton} onClick={handleAddConnection}>
            Add Connection
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    padding: "30px",
    maxWidth: "1300px",
    margin: "0 auto",
    fontSize: "13px",         
    color: "#222",
  },
  title: {
    fontSize: "1.5rem",       
    fontWeight: "500",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "0.85rem",      
    color: "#666",
    marginBottom: "28px",
    lineHeight: 1.45,
  },
  listContainer: {
    marginBottom: "30px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "22px 24px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    fontWeight: "500",
    fontSize: "1.1rem",
    margin: "0 0 16px 0",
    color: "#222",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#999",
    fontSize: "14px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    borderBottom: "2px solid #e0e0e0",
  },
  tableHeader: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tableRow: {
    borderBottom: "1px solid #f0f0f0",
  },
  tableCell: {
    padding: "14px 16px",
    fontSize: "13px",
    color: "#333",
  },
  providerBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "12px",
    backgroundColor: "#e9f0fa",
    color: "#1e40af",
    fontSize: "11px",
    fontWeight: "600",
  },
  formContainer: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "22px 24px",
    backgroundColor: "#fafafa",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    transition: "box-shadow 0.3s ease",
  },
  formHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  plusButton: {
    fontSize: "1.3rem",       
    fontWeight: "700",
    width: "30px",
    height: "30px",
    borderRadius: "7px",
    border: "none",
    backgroundColor: "#ddd",
    cursor: "pointer",
    marginRight: "14px",
    userSelect: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    transition: "background-color 0.3s ease",
  },
  formTitle: {
    fontWeight: "450",
    fontSize: "1.2rem",       
    margin: 0,
    color: "#222",
    letterSpacing: "0.02em",
  },
  row: {
    display: "flex",
    gap: "14px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "8px 12px",     
    fontSize: "13px",        
    borderRadius: "7px",
    border: "1.4px solid #ccc",
    outline: "none",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
    fontWeight: "500",
    color: "#333",
  },
  select: {
    flex: 1,
    padding: "8px 12px",
    fontSize: "13px",
    borderRadius: "7px",
    border: "1.4px solid #ccc",
    outline: "none",
    cursor: "pointer",
    fontWeight: "500",
    color: "#333",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
  },

  apiCredsSection: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "18px 20px",
    marginBottom: "20px",
    backgroundColor: "#fff",
    boxShadow: "inset 0 1px 5px rgba(0,0,0,0.03)",
  },
  warning: {
    color: "#d48806",
    fontWeight: "700",
    marginBottom: "12px",
    fontSize: "13px",
  },
  envVarRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  removeButton: {
    background: "transparent",
    border: "none",
    color: "#999",
    fontSize: "18px",
    cursor: "pointer",
    userSelect: "none",
    transition: "color 0.2s ease",
  },
  addVarButton: {
    marginTop: "10px",
    padding: "7px 12px",
    borderRadius: "7px",
    border: "1px solid #999",
    background: "transparent",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },

  infoBox: {
    backgroundColor: "#e9f0fa",
    borderRadius: "8px",
    padding: "14px 16px",
    marginBottom: "20px",
    fontSize: "12.5px",
    color: "#1b1b1b",
    lineHeight: 1.45,
  },

  submitButton: {
    padding: "10px 26px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
    letterSpacing: "0.02em",
    transition: "background-color 0.3s ease",
  },
};