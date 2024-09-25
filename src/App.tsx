import React from "react";
import CriblLogo from "./components/CriblLogo";
import LogViewer from "./components/LogViewer";
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

        {error && <div className="error">{error}</div>}

        <section className="log-viewer">
        <LogViewer loading={loading} logEntries={logEntries} />
      </section>
      </header>
    </div>
  );
};

export default App;
