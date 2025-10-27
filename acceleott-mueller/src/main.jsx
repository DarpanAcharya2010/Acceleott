import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // ✅ added

// Styles
import "./styles/global.css";
import "./styles/animations.css";

// Animation init
import { initReveal, rearmReveal } from "./anim/reveal.js";

/** Re-run reveal after every route change */
function RevealOnRoute() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    // next tick to ensure views have mounted
    requestAnimationFrame(() => rearmReveal());
  }, [pathname]);
  return null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ wrapped inside AuthProvider */}
      <BrowserRouter>
        <App />
        <RevealOnRoute />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

// Start scroll-reveal after first paint
window.requestAnimationFrame(() => initReveal());
