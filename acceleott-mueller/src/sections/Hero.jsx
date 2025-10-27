import React, { useEffect, useRef, useState } from "react";
import "./hero.css";

function Typewriter({ words = [], speed = 90, pause = 1200 }) {
  const [i, setI] = useState(0);      // which word
  const [t, setT] = useState("");     // typed text
  const [dir, setDir] = useState(1);  // 1 typing, -1 deleting

  useEffect(() => {
    const word = words[i % words.length];
    let timeout;
    if (dir === 1 && t.length < word.length) {
      timeout = setTimeout(() => setT(word.slice(0, t.length + 1)), speed);
    } else if (dir === 1) {
      timeout = setTimeout(() => setDir(-1), pause);
    } else if (dir === -1 && t.length > 0) {
      timeout = setTimeout(() => setT(word.slice(0, t.length - 1)), speed * 0.6);
    } else {
      setDir(1);
      setI((v) => (v + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [t, dir, i, words, speed, pause]);

  return <span className="typewriter">{t}<span className="caret">|</span></span>;
}

export default function Hero() {
  const heroRef = useRef(null);

  // Parallax background (changes background-position on scroll)
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY * 0.35; // parallax strength
      el.style.backgroundPosition = `center calc(60% + ${y}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-overlay" />
      <div className="hero-inner">
        <h1 className="company reveal fade-down">ACCELEOTT</h1>

        {/* Slogan styled like wide-tracked “AUTOMATIONS” + typed line */}
        <div className="slogan reveal fade-in">FROM&nbsp;MANUAL&nbsp;TO&nbsp;MAGICAL</div>
        <div className="typed reveal fade-in" style={{ animationDelay: ".12s" }}>
          <Typewriter words={["Healthcare.", "Marketing.", "Automation."]} />
        </div>

        <p className="tagline reveal fade-up">
          Acceleott partners with businesses to streamline operations, centralise information,
          and improve collaboration. Our current toolset focuses on clean UX, reliable data
          handling, and effortless sharing, laying a solid foundation for deeper automation
          features as we expand.
        </p>

        <div className="hero-cta reveal zoom-in">
          <a href="#features" className="cta-btn ghost">Explore Features</a>
          <a href="#contact" className="cta-btn ghost">Contact Us</a>
        </div>
      </div>
    </section>
  );
}
