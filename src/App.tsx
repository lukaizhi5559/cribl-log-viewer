import React, { useCallback } from "react";
import CriblLogo from "./components/CriblLogo";
import "./App.css";

const App: React.FC = () => {
  

  return (
    <div className="app-grid">
      <header className="header">
        <CriblLogo />
        <span>Log Viewer</span>
      </header>
    </div>
  );
};

export default App;
