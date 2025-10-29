import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import { AuthContext } from "../context/AuthContext";

const SECTIONS = ["features", "about", "contact"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, logout, loading } = useContext(AuthContext);

  // ✅ Don’t render navbar until auth state is known
  if (loading) return null;

  /* ------------------------------------------
    Logout Handler
  ------------------------------------------ */
  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  /* ------------------------------------------
    Scroll Progress Bar
  ------------------------------------------ */
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ------------------------------------------
    Active Section Tracking
  ------------------------------------------ */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  /* ------------------------------------------
    Nav Height CSS Var
  ------------------------------------------ */
  useEffect(() => {
    const setNavHeight = () => {
      const nav = headerRef.current;
      if (nav)
        document.documentElement.style.setProperty(
          "--nav-h",
          `${nav.offsetHeight}px`
        );
    };
    setNavHeight();
    window.addEventListener("resize", setNavHeight);
    return () => window.removeEventListener("resize", setNavHeight);
  }, []);

  /* ------------------------------------------
    Navbar Transparency
  ------------------------------------------ */
  useEffect(() => {
    const nav = headerRef.current;
    const hero = document.querySelector(".hero");

    const updateScrollState = () => {
      if (!nav) return;
      if (!hero) return nav.classList.add("nav-scrolled");

      const heroBottom = hero.getBoundingClientRect().bottom;
      const navHeight = nav.offsetHeight || 64;
      const transparent = heroBottom > navHeight + 1;
      nav.classList.toggle("nav-scrolled", !transparent);
    };

    const resizeObs = hero ? new ResizeObserver(updateScrollState) : null;
    updateScrollState();

    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    if (hero && resizeObs) resizeObs.observe(hero);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      if (resizeObs) resizeObs.disconnect();
    };
  }, [location.pathname]);

  /* ------------------------------------------
    Close Menus on Navigation or Outside Click
  ------------------------------------------ */
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [location]);

  useEffect(() => {
    const handleDocClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
        setServicesOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setServicesOpen(false);
      }
    };
    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* ------------------------------------------
    Render
  ------------------------------------------ */
  return (
    <header ref={headerRef} className="nav-wrapper">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <nav className="nav" role="navigation" aria-label="Primary Navigation">
        <div className="nav-left">
          <Link to="/" className="brand" aria-label="ACCELEOTT Home">
            ACCELEOTT
          </Link>
        </div>

        <div
          id="nav-center"
          className={`nav-center ${menuOpen ? "show" : ""}`}
          aria-hidden={!menuOpen}
        >
          <div className={`nav-item dropdown ${servicesOpen ? "open" : ""}`}>
            <button
              className={`nav-link ${active === "services" ? "active" : ""}`}
              onClick={() => setServicesOpen((prev) => !prev)}
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
                  onClick={() => setServicesOpen(false)}
                >
                  AIMMED
                </Link>
                <Link
                  to="/marketboost"
                  className="dropdown-item"
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

        {/* ✅ Auth Buttons */}
        <div className="nav-right">
          {!loading && (
            <>
              {isAuthenticated ? (
                <button className="btn btn-ghost" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <>
                  <Link className="btn btn-ghost" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-primary" to="/get-started">
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}

          <button
            className="hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-controls="nav-center"
            aria-expanded={menuOpen}
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
