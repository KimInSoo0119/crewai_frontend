import { useState, useEffect } from 'react';
import Modal from "react-modal";
import ReactMarkdown from 'react-markdown';

Modal.setAppElement('#root'); 

function Spinner() {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 6) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div style={{
      ...styles.spinner,
      transform: `rotate(${rotation}deg)`
    }} />
  );
}

export default function ExecutionPopup({isOpen, onClose, event=[], workflow=[], finalOutput=""}) {
  const [expandedAgents, setExpandedAgents] = useState({});

  const toggleAgent = (agentId) => {
    setExpandedAgents(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      shouldCloseOnOverlayClick={true}
    >
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.headerTitle}>실행 결과</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.body}>
          <div style={styles.leftPanel}>
            <div style={styles.panelHeader}>
              <h4 style={styles.panelTitle}>Events</h4>
              <div style={styles.panelSubtitle}>실행 흐름</div>
            </div>
            <div style={styles.hierarchyList}>
              {event && event.length > 0 ? (
                event.map((agent, idx) => (
                  <div key={agent.agent_id || idx} style={styles.agentGroup}>
                    <div 
                      style={styles.agentHeader}
                      onClick={() => toggleAgent(agent.agent_id)}
                    >
                      <span style={styles.toggleIcon}>
                        {expandedAgents[agent.agent_id] ? '▼' : '▶'}
                      </span>
                      <span style={styles.agentName}>{agent.agent_role}</span>
                      <span style={styles.taskCount}>{agent.tasks?.length || 0} tasks</span>
                    </div>

                    {expandedAgents[agent.agent_id] && (
                      <div style={styles.taskList}>
                        {agent.tasks && agent.tasks.length > 0 ? (
                          agent.tasks.map((task, taskIdx) => (
                            <div key={task.id || taskIdx} style={styles.taskItem}>
                              <div style={styles.taskBullet}>●</div>
                              <div style={styles.taskDescription}>
                                {task.description || `Task ${taskIdx + 1}`}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={styles.noTasks}>연결된 태스크가 없습니다</div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p style={styles.emptyMessage}>이벤트 데이터가 없습니다</p>
              )}
            </div>
          </div>

          <div style={styles.rightPanel}>
            <div style={styles.panelHeader}>
              <h4 style={styles.panelTitle}>Result</h4>
              <div style={styles.panelSubtitle}>실행 결과</div>
            </div>
            {workflow.length === 0 ? (
              <div style={styles.loadingContainer}>
                <Spinner />
                <p style={styles.loadingMessage}>답변 생성중...</p>
              </div>
            ) : (
              <>
                {workflow.map(task => (
                  <div key={task.id} style={styles.taskBox}>
                    <div style={styles.section}>
                      <h4 style={styles.sectionTitle}>
                        <span style={styles.sectionIcon}>📋</span>
                        Description
                      </h4>
                      <div style={styles.sectionContent}>
                        <ReactMarkdown>{task.output.description || "설명이 없습니다."}</ReactMarkdown>
                      </div>
                    </div>

                    <div style={styles.section}>
                      <h4 style={styles.sectionTitle}>
                        <span style={styles.sectionIcon}>✨</span>
                        Output
                      </h4>
                      <div style={styles.markdownContent}>
                        <ReactMarkdown>{task.output.raw || "출력이 없습니다."}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                
                {finalOutput && (
                  <div style={styles.finalOutputBox}>
                    <h4 style={styles.finalOutputTitle}>
                      Final Output
                    </h4>
                    <div style={styles.markdownContent}>
                      <ReactMarkdown>{finalOutput}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

const modalStyles = {
  content: {
    width: "80vw",
    height: "87vh",
    top: "50%",
    left: "50%",
    padding: "0",
    transform: "translate(-50%, -50%)",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e0e0e0",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 2000,
  },
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#fff",
  },
  header: {
    padding: "13px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e8e8e8",
    background: "black"
  },
  headerTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#fff",
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    fontWeight: "300",
  },
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  leftPanel: {
    width: "35%",
    borderRight: "1px solid #e8e8e8",
    overflowY: "auto",
    backgroundColor: "#f8f9fa",
  },
  rightPanel: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: "#fff",
  },
  panelHeader: {
    padding: "20px 20px 16px 20px",
    borderBottom: "1px solid #e8e8e8",
    backgroundColor: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  panelTitle: {
    margin: "0 0 4px 0",
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: "-0.3px",
  },
  panelSubtitle: {
    fontSize: "12px",
    color: "#999",
    fontWeight: "400",
  },
  hierarchyList: {
    fontSize: "14px",
    padding: "16px",
  },
  agentGroup: {
    marginBottom: "12px",
  },
  agentHeader: {
    display: "flex",
    alignItems: "center",
    padding: "12px 14px",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    userSelect: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  toggleIcon: {
    fontSize: "10px",
    marginRight: "10px",
    color: "#667eea",
    minWidth: "10px",
    fontWeight: "600",
  },
  agentName: {
    fontWeight: "600",
    color: "#2d3748",
    flex: 1,
    fontSize: "14px",
  },
  taskCount: {
    fontSize: "11px",
    color: "#fff",
    backgroundColor: "black",
    padding: "3px 10px",
    borderRadius: "12px",
    fontWeight: "600",
  },
  taskList: {
    marginTop: "8px",
    marginLeft: "20px",
    paddingLeft: "16px",
    borderLeft: "2px solid #e0e0e0",
  },
  taskItem: {
    display: "flex",
    alignItems: "flex-start",
    padding: "10px 12px",
    marginBottom: "6px",
    backgroundColor: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: "6px",
    transition: "all 0.2s ease",
  },
  taskBullet: {
    marginRight: "10px",
    color: "black",
    fontSize: "6px",
    marginTop: "6px",
  },
  taskDescription: {
    flex: 1,
    fontSize: "13px",
    color: "#4a5568",
    lineHeight: "1.5",
  },
  noTasks: {
    padding: "12px",
    color: "#999",
    fontSize: "13px",
    fontStyle: "italic",
  },
  emptyMessage: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#999",
    fontSize: "14px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    marginTop: "150px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #333",
    borderRadius: "50%",
  },
  loadingMessage: {
    marginTop: "20px",
    color: "#666",
    fontSize: "14px",
  },
  taskBox: {
    margin: "16px 20px",
    padding: "20px",
    border: "1px solid #e8e8e8",
    borderRadius: "10px",
    backgroundColor: "#fafafa",
    boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#2d3748",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    paddingBottom: "8px",
    borderBottom: "2px solid #e8e8e8",
  },
  sectionIcon: {
    fontSize: "16px",
  },
  sectionContent: {
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#4a5568",
    padding: "8px 0",
  },
  markdownContent: {
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#2d3748",
    padding: "12px 16px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    border: "1px solid #e8e8e8",
  },
  finalOutputBox: {
    margin: "20px",
    padding: "24px",
    border: "2px solid #667eea",
    borderRadius: "12px",
    backgroundColor: "#f8f9ff",
    boxShadow: "0 4px 8px rgba(102, 126, 234, 0.1)",
  },
  finalOutputTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#667eea",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingBottom: "10px",
    borderBottom: "2px solid #667eea",
  },
};