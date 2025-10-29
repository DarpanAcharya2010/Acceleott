// src/App.jsx
import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { initReveal, rearmReveal } from "./anim/reveal";

// Core Layout Components
import Navbar from "./components/Navbar.jsx";
import Footer from "./sections/Footer.jsx";

// Section Components
import Hero from "./sections/Hero.jsx";
import Features from "./sections/Features.jsx";
import About from "./sections/About.jsx";
import Blog from "./sections/Blog.jsx";

// Auth Pages
import LoginPage from "./pages/LoginPage.jsx";
import GetStartedPage from "./pages/GetStartedPage.jsx";
import VerifySuccessPage from "./pages/VerifySuccessPage.jsx";
import "./pages/loginpage.css";
import "./pages/getstarted.css";

// Service Pages
import AIMMEDPage from "./pages/AIMMEDPage.jsx";
import MarketBoostPage from "./pages/MarketBoostPage.jsx";

// Blog Detail
import BlogDetailPage from "./pages/BlogDetailPage.jsx";

// Demo Request
import DemoRequestPage from "./pages/DemoRequestPage.jsx";

/* ------------------------------------------
   Scroll Behavior & Animation Reset on Route
------------------------------------------- */
function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    // Re-arm animations on route change
    rearmReveal();
  }, [pathname, hash]);

  return null;
}

/* ------------------------------------------
   Main App
------------------------------------------- */
export default function App() {
  useEffect(() => {
    // Initialize AOS (once)
    AOS.init({
      once: true,
      offset: 80,
      duration: 900,
      easing: "ease-in-out",
    });

    // Initialize custom reveal animations
    initReveal();
  }, []);

  return (
    <>
      <Navbar />
      <RouteEffects />

      {/* Lazy loading wrapper for smoother transitions */}
      <Suspense fallback={<div className="loading-screen">Loading...</div>}>
        <Routes>
          {/* Home */}
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

          {/* Blog Detail */}
          <Route path="/blog/:id" element={<BlogDetailPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/verify-success" element={<VerifySuccessPage />} />

          {/* Services */}
          <Route path="/aimmed" element={<AIMMEDPage />} />
          <Route path="/marketboost" element={<MarketBoostPage />} />

          {/* Demo */}
          <Route path="/demo" element={<DemoRequestPage />} />

          {/* 404 fallback → redirect to home sections */}
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
      </Suspense>
    </>
  );
}
