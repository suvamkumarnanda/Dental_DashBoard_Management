import React  from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
// import { BrowserRouter } from "react-router-dom";
import './index.css';
createRoot(document.getElementById("root")).render(
     <React.StrictMode>
     <AuthProvider> 
          <App />
    </AuthProvider>
  </React.StrictMode>
  );