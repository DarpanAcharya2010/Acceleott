import React, { useEffect, useRef, useState } from "react";
import "./hero.css";

/**
 * Typewriter effect component
 * Cycles through the given words with typing and deleting animations
 */
function Typewriter({ words = [], speed = 90, pause = 1200 }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [direction, setDirection] = useState(1); // 1 = typing, -1 = deleting

  useEffect(() => {
    if (!words.length) return;

    const currentWord = words[index % words.length];
    let timeout;

    if (direction === 1 && text.length < currentWord.length) {
      // Typing forward
      timeout = setTimeout(() => setText(currentWord.slice(0, text.length + 1)), speed);
    } else if (direction === 1) {
      // Pause before deleting
      timeout = setTimeout(() => setDirection(-1), pause);
    } else if (direction === -1 && text.length > 0) {
      // Deleting backward
      timeout = setTimeout(() => setText(currentWord.slice(0, text.length - 1)), speed * 0.6);
    } else {
      // Move to next word
      setDirection(1);
      setIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [text, direction, index, words, speed, pause]);

  return (
    <span className="typewriter" aria-label={text}>
      {text}
      <span className="caret">|</span>
    </span>
  );
}

/**
 * Hero section of the Acceleott landing page
 * Includes a parallax background, slogan, typed animation, and CTA buttons
 */
export default function Hero() {
  const heroRef = useRef(null);

  // Parallax background effect
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const handleScroll = () => {
      const y = window.scrollY * 0.35;
      el.style.backgroundPosition = `center calc(60% + ${y}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="home" className="hero" ref={heroRef} role="banner">
      <div className="hero-overlay" />
      <div className="hero-inner">
        {/* Company name */}
        <h1 className="company reveal fade-down" aria-label="Acceleott">
          ACCELEOTT
        </h1>

        {/* Slogan + Typewriter */}
        <p className="slogan reveal fade-in">
          FROM&nbsp;MANUAL&nbsp;TO&nbsp;MAGICAL
        </p>

        <div className="typed reveal fade-in" style={{ animationDelay: ".12s" }}>
          <Typewriter words={["Healthcare.", "Marketing.", "Automation."]} />
        </div>

        {/* Tagline */}
        <p className="tagline reveal fade-up">
          Acceleott partners with businesses to streamline operations,
          centralise information, and improve collaboration. Our platform focuses on
          clean UX, reliable data handling, and effortless sharing — laying a solid
          foundation for deeper automation features as we expand.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta reveal zoom-in">
          <a href="#features" className="cta-btn ghost">
            Explore Features
          </a>
          <a href="#contact" className="cta-btn ghost">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
