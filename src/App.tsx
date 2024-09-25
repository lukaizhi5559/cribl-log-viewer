import React from "react";
import CriblLogo from "./components/CriblLogo";
import LogViewer from "./components/LogViewer";
import Timeline from "./components/Timeline";
import useFetchLogs from "./hooks/useFetchLogs";
import "./App.css";

const App: React.FC = () => {
  // Fetch logs using the custom hook
  const { logEntries, loading, error } = useFetchLogs(
    "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log"
  ); 

  return (
    <div className="app-grid">
      <header className="header">
        <CriblLogo />
        <span>Log Viewer</span>
      </header>

      {error && <div className="error">{error}</div>}

      <section className="timeline">
        <Timeline logEntries={logEntries} />
      </section>

      <section className="log-viewer">       
        <LogViewer loading={loading} logEntries={logEntries} />
      </section>
    </div>
  );
};

export default App;
