import { useState } from "react";

const PROVIDER_OPTIONS = [
  { value: "custom-openai-compatible", label: "Custom OpenAI Compatible" }
];

export default function LLMConnectionsPage() {
  const [connectionName, setConnectionName] = useState("");
  const [provider, setProvider] = useState();
  const [envVars, setEnvVars] = useState([
    { key: "", value: "" },
    { key: "OPENAI_API_KEY", value: "" },
    { key: "OPENAI_API_BASE", value: "" },
  ]);

  const addVariable = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const updateEnvVar = (index, field, value) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);
  };

  const removeEnvVar = (index) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>LLM Connections</h1>
      <p style={styles.subtitle}>Manage your language model API connections</p>

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
            {PROVIDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.apiCredsSection}>
          <div style={styles.warning}>
            The following environment variables are required: OPENAI_API_KEY, OPENAI_API_BASE
          </div>

          {envVars.map((envVar, idx) => (
            <div key={idx} style={styles.envVarRow}>
              <input
                placeholder="ENV_VAR_KEY"
                value={envVar.key}
                onChange={(e) => updateEnvVar(idx, "key", e.target.value)}
                style={{ ...styles.input, flex: 2, marginRight: 8 }}
              />
              <input
                placeholder="env-var-value"
                value={envVar.value}
                onChange={(e) => updateEnvVar(idx, "value", e.target.value)}
                style={{ ...styles.input, flex: 3, marginRight: 8 }}
              />
              <button
                onClick={() => removeEnvVar(idx)}
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
          <p>
            <b>Important setup information:</b>
          </p>
          <ul>
            <li>
              For <code>OPENAI_API_BASE</code>, include the full base URL with <code>/v1</code> at the end (e.g.,{" "}
              <code>https://api.your-service.com/v1</code>)
            </li>
            <li>
              For <code>OPENAI_API_KEY</code>, provide the API key that will be sent in the Authorization header as{" "}
              <code>Bearer YOUR_API_KEY</code>
            </li>
            <li>Use the "Fetch Available Models" button to verify your connection settings</li>
          </ul>
        </div>

        <div style={{ textAlign: "right" }}>
          <button style={styles.submitButton}>Add Connection</button>
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

  fetchButton: {
    padding: "9px 18px",
    borderRadius: "8px",
    border: "1px solid #666",
    background: "transparent",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "20px",
    transition: "background-color 0.25s ease, color 0.25s ease",
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
