import React, { useCallback } from "react";
import CriblLogo from "./components/CriblLogo";
import LogViewer from "./components/LogViewer";
import Timeline from "./components/Timeline";
import LogFilter from "./components/LogFilter";
import useFetchLogs from "./hooks/useFetchLogs";
import useFilteredLogs from "./hooks/useFilteredLogs";
import "./App.css";

const App: React.FC = () => {
  // Fetch logs using the custom hook
  const { logEntries, loading, error } = useFetchLogs(
    "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log"
  ); 

  // Filter the log entries using the custom hook
  const filtered = useFilteredLogs(
    logEntries,
  );

  // Handle setting the search term with startTransition to improve responsiveness
  const handleSearchTermChange = useCallback((term: string) => {
    filtered.setSearchTerm(term);
  }, [filtered]);

  // Create a compound filter state object
  const filterState = {...filtered, setSearchTerm: handleSearchTermChange};

  return (
    <div className="app-container">
      <header className="header">
        <CriblLogo />
        <span>Log Viewer</span>
      </header>
      
      {error && <div className="error">{error}</div>}

      <section className="timeline">
        <Timeline logEntries={logEntries} />
      </section>

      <section className="log-viewer">
        <LogFilter {...filterState} />
        <LogViewer loading={loading} logEntries={filtered.filteredLogEntries} />
      </section>
    </div>
  );
};

export default App;
