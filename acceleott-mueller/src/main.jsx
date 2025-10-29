// src/main.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Global styles
import "./styles/global.css";
import "./styles/animations.css";

// Animation helpers
import { initReveal, rearmReveal } from "./anim/reveal.js";

/* ------------------------------------------------------------------
   🔁 Trigger reveal animations on route change
   Keeps scroll animations in sync during navigation
------------------------------------------------------------------ */
function RevealOnRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Let DOM settle before retriggering
    requestAnimationFrame(() => rearmReveal());
  }, [pathname]);

  return null;
}

/* ------------------------------------------------------------------
   ⚙️ App Bootstrap
------------------------------------------------------------------ */
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("❌ Root element not found. Check your index.html for <div id='root'></div>");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <RevealOnRoute />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

/* ------------------------------------------------------------------
   🌀 Post-load reveal initialization
   Waits until all styles & DOM are ready for smooth entry animations
------------------------------------------------------------------ */
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    try {
      initReveal();
    } catch (err) {
      console.error("Reveal init failed:", err);
    }
  });
});

/* ------------------------------------------------------------------
   💡 Notes for Production:
   1. Avoid blocking scripts before this runs — animations depend on load.
   2. Keep AuthProvider at root so it wraps router + components.
   3. If using lazy imports, Suspense fallback should be inside App.jsx.
------------------------------------------------------------------ */
