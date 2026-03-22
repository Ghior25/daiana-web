/**
 * Navegación móvil, scroll suave y revelado al entrar en viewport
 */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var navLinks = siteNav ? siteNav.querySelectorAll("a[href^='#']") : [];

  function closeMenu() {
    if (!header || !navToggle) return;
    header.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (!header || !navToggle) return;
    header.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function toggleMenu() {
    if (!header || !navToggle) return;
    var expanded = navToggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (navToggle && header) {
    navToggle.addEventListener("click", toggleMenu);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 899px)").matches) {
        closeMenu();
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header && header.classList.contains("is-open")) {
      closeMenu();
      if (navToggle) navToggle.focus();
    }
  });

  /* Scroll suave para enlaces internos (refuerzo) */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (history.replaceState) {
          history.replaceState(null, "", id);
        }
      }
    });
  });

  /* Año en footer */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Intersection Observer para .reveal */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length && !prefersReduced) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -40px 0px", threshold: 0.08 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
