import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Core Layout Components
import Navbar from "./components/Navbar.jsx";

// Section Components
import Hero from "./sections/Hero.jsx";
import Features from "./sections/Features.jsx";
import About from "./sections/About.jsx";
import Blog from "./sections/Blog.jsx";
import Footer from "./sections/Footer.jsx";

// Auth Pages
import LoginPage from "./pages/LoginPage.jsx";
import "./pages/loginpage.css";
import GetStartedPage from "./pages/GetStartedPage.jsx";
import "./pages/getstarted.css";
import VerifySuccessPage from "./pages/VerifySuccessPage.jsx";

// Service Pages
import AIMMEDPage from "./pages/AIMMEDPage.jsx";
import MarketBoostPage from "./pages/MarketBoostPage.jsx";

// Blog Detail Page
import BlogDetailPage from "./pages/BlogDetailPage.jsx";

// Demo Request Page
import DemoRequestPage from "./pages/DemoRequestPage.jsx";

/* -------------------------------
   Scroll to top or to hash anchor
--------------------------------- */
function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, hash]);

  return null;
}

/* -------------------------------
   Main App Component
--------------------------------- */
export default function App() {
  useEffect(() => {
    AOS.init({
      once: true,
      offset: 60,
      duration: 1000,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <>
      <Navbar />
      <RouteEffects />

      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <main>
                <Hero />
                <Features />
                <About />
                <Blog />
              </main>
              <Footer />
            </>
          }
        />

        {/* Blog Detail Page */}
        <Route path="/blog/:id" element={<BlogDetailPage />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/verify-success" element={<VerifySuccessPage />} />

        {/* Services */}
        <Route path="/aimmed" element={<AIMMEDPage />} />
        <Route path="/marketboost" element={<MarketBoostPage />} />

        {/* Demo Request */}
        <Route path="/demo" element={<DemoRequestPage />} />

        {/* Default Redirect to Home if route not found */}
        <Route
          path="*"
          element={
            <>
              <main>
                <Hero />
                <Features />
                <About />
                <Blog />
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}
