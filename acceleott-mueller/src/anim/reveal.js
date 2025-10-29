/**
 * reveal.js
 * Handles scroll-based reveal animations using IntersectionObserver.
 * Automatically adds the "is-visible" class to elements with
 * `.reveal` or `.stagger` when they enter the viewport.
 *
 * Safe for production use in:
 *  - Vanilla JS sites
 *  - React / Next.js apps
 *  - Vue / Svelte single-page apps
 */

class RevealObserver {
  constructor() {
    this.io = null;
    this.initialized = false;
  }

  /**
   * Initialize the reveal observer.
   * Automatically observes elements with .reveal or .stagger classes.
   */
  init() {
    // Ensure browser supports IntersectionObserver
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    // Find all elements to observe
    const observed = document.querySelectorAll(".reveal, .stagger");
    if (observed.length === 0) return;

    // Create observer once
    if (!this.io) {
      this.io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add animation class
              requestAnimationFrame(() => {
                entry.target.classList.add("is-visible");
                this.io.unobserve(entry.target); // animate once per element
              });
            }
          });
        },
        {
          rootMargin: "0px 0px -10% 0px", // Trigger slightly before visible
          threshold: 0.12,
        }
      );
    }

    // Observe all elements
    observed.forEach((el) => this.io.observe(el));

    // Add a body class for CSS hooks
    if (!this.initialized) {
      document.body.classList.add("reveal-enabled");
      this.initialized = true;
    }
  }

  /**
   * Re-arm reveal animations (use after dynamic route/content updates).
   * Example: reveal.rearm();
   */
  rearm() {
    this.init();
  }

  /**
   * Disconnect the observer and clean up memory.
   * Recommended before unmounting or navigating in SPA environments.
   */
  cleanup() {
    if (this.io) {
      this.io.disconnect();
      this.io = null;
      this.initialized = false;
      document.body.classList.remove("reveal-enabled");
    }
  }
}

// Export a singleton instance
export const reveal = new RevealObserver();

/**
 * Utility export for direct function usage.
 * Re-initializes reveal animations manually.
 */
export function initReveal() {
  reveal.init();
}

/**
 * Manually re-triggers reveal animations on elements
 * with the [data-reveal] attribute.
 */
export function rearmReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  elements.forEach((el) => {
    el.classList.remove("revealed");
    // retrigger animation if needed
    setTimeout(() => el.classList.add("revealed"), 50);
  });
}
