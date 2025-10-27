import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import { AuthContext } from "../context/AuthContext"; // ✅ Context for auth

const SECTIONS = ["features", "about", "contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);
  const [servicesOpen, setServicesOpen] = useState(false);

  const location = useLocation();
  const headerRef = useRef(null);
  const navCenterId = "nav-center";

  // ✅ Access authentication state from context
  const { isAuthenticated, setIsAuthenticated, logout, loading } = useContext(AuthContext);

  // ✅ Don’t render navbar until auth is loaded
  if (loading) return null;

  // --- Logout handler ---
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // --- Scroll progress bar ---
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const sh = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(sh > 0 ? (sy / sh) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- Active link highlight ---
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.5 }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [location]);

  // --- Maintain nav height variable ---
  useEffect(() => {
    const setNavHeightVar = () => {
      const el = headerRef.current;
      if (!el) return;
      document.documentElement.style.setProperty("--nav-h", el.offsetHeight + "px");
    };
    setNavHeightVar();
    window.addEventListener("resize", setNavHeightVar);
    return () => window.removeEventListener("resize", setNavHeightVar);
  }, []);

  // --- Navbar scroll style change ---
  useEffect(() => {
    const nav = headerRef.current;
    const hero = document.querySelector(".hero");

    const update = () => {
      if (!nav) return;
      if (!hero) {
        nav.classList.add("nav-scrolled");
        return;
      }
      const heroBottom = hero.getBoundingClientRect().bottom;
      const navH = nav.offsetHeight || 64;
      const transparentOverHero = heroBottom > navH + 1;
      nav.classList.toggle("nav-scrolled", !transparentOverHero);
    };

    const ro = hero ? new ResizeObserver(update) : null;
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    if (ro && hero) ro.observe(hero);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (ro) ro.disconnect();
    };
  }, [location.pathname]);

  // --- Close menus on route change ---
  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [location]);

  // --- Close dropdowns when clicking outside ---
  useEffect(() => {
    const onDocClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpen(false);
        setServicesOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setServicesOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header ref={headerRef} className="nav-wrapper">
      <div className="scroll-progress" style={{ width: `${progress}%` }} />

      <nav className="nav" role="navigation" aria-label="Primary">
        <div className="nav-left">
          <Link to="/" className="brand">
            ACCELEOTT
          </Link>
        </div>

        <div
          id={navCenterId}
          className={`nav-center ${open ? "show" : ""}`}
          aria-hidden={!open}
        >
          <div className={`nav-item dropdown ${servicesOpen ? "open" : ""}`}>
            <button
              className={`nav-link ${active === "services" ? "active" : ""}`}
              onClick={() => setServicesOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
            >
              Services ▾
            </button>
            {servicesOpen && (
              <div className="dropdown-menu" role="menu">
                <Link
                  to="/aimmed"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => setServicesOpen(false)}
                >
                  AIMMED
                </Link>
                <Link
                  to="/marketboost"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => setServicesOpen(false)}
                >
                  MarketBoost
                </Link>
              </div>
            )}
          </div>

          <a
            href="#features"
            className={`nav-link ${active === "features" ? "active" : ""}`}
          >
            Features
          </a>
          <a
            href="#about"
            className={`nav-link ${active === "about" ? "active" : ""}`}
          >
            About Us
          </a>
          <a
            href="#contact"
            className={`nav-link ${active === "contact" ? "active" : ""}`}
          >
            Contact
          </a>
        </div>

        <div className="nav-right">
          {/* ✅ Hide Login/Get Started when logged in */}
          {!isAuthenticated ? (
            <>
              <Link className="btn btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/get-started">
                Get Started
              </Link>
            </>
          ) : (
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          )}

          <button
            className="hamburger"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-controls={navCenterId}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
}
