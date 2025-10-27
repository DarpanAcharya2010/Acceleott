// src/anim/reveal.js
let io;

/** Initialize the reveal observer */
export function initReveal() {
  const observed = document.querySelectorAll(".reveal, .stagger");
  if (!("IntersectionObserver" in window) || observed.length === 0) return;

  // Create observer only once
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target); // animate once per element
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
  }

  // Observe current elements
  observed.forEach((el) => io.observe(el));

  // Enable reveal mode only after observers are set
  document.body.classList.add("reveal-enabled");
}

/** Re-arm reveal (e.g., after route change) */
export function rearmReveal() {
  initReveal();
}
