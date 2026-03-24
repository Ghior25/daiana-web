/**
 * Interacciones globales:
 * - menú móvil
 * - navegación smooth
 * - reveal on scroll (IntersectionObserver)
 * - parallax hero
 * - slider de testimonios
 * - contador animado
 * - FAQ accordion
 * - estado sticky nav al scrollear
 */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var navLinks = siteNav ? siteNav.querySelectorAll("a[href^='#']") : [];
  var stickyCta = document.getElementById("sticky-cta");
  var contactSection = document.getElementById("contacto");
  var heroParallax = document.getElementById("hero-parallax");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      if (expanded) closeMenu();
      else openMenu();
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 899px)").matches) closeMenu();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header && header.classList.contains("is-open")) {
      closeMenu();
      if (navToggle) navToggle.focus();
    }
  });

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  // Año dinámico
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Sticky CTA hide in contacto
  if (stickyCta && contactSection && window.IntersectionObserver) {
    var stickyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          stickyCta.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );
    stickyObserver.observe(contactSection);
  }

  // Header class when scrolling
  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 80);
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && !prefersReduced && window.IntersectionObserver) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Parallax hero
  if (heroParallax && !prefersReduced) {
    var parallaxTicking = false;
    function applyParallax() {
      var y = window.scrollY * 0.25;
      heroParallax.style.setProperty("--parallaxY", y + "px");
      parallaxTicking = false;
    }
    window.addEventListener("scroll", function () {
      if (!parallaxTicking) {
        window.requestAnimationFrame(applyParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
    applyParallax();
  }

  // Testimonial slider
  var track = document.getElementById("testimonials-track");
  var dotsWrap = document.getElementById("testimonials-dots");
  var dots = dotsWrap ? dotsWrap.querySelectorAll(".dot") : [];
  var slideIndex = 0;
  var slideTimer = null;

  function goToSlide(index) {
    if (!track || !dots.length) return;
    var max = dots.length - 1;
    slideIndex = index < 0 ? max : index > max ? 0 : index;
    track.style.transform = "translateX(" + (-slideIndex * 100) + "%)";
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === slideIndex);
      dot.setAttribute("aria-current", i === slideIndex ? "true" : "false");
    });
  }

  function startSlider() {
    if (!track || prefersReduced) return;
    if (slideTimer) window.clearInterval(slideTimer);
    slideTimer = window.setInterval(function () { goToSlide(slideIndex + 1); }, 4000);
  }

  if (track && dots.length) {
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var idx = Number(dot.getAttribute("data-slide"));
        goToSlide(idx);
        startSlider();
      });
    });
    goToSlide(0);
    startSlider();
  }

  // Animated counters
  var counters = document.querySelectorAll(".counter");
  if (counters.length && window.IntersectionObserver) {
    var ran = false;
    var stats = document.getElementById("stats-grid");
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || ran) return;
        ran = true;
        counters.forEach(function (counter) {
          var target = Number(counter.getAttribute("data-target")) || 0;
          var current = 0;
          var step = Math.max(1, Math.ceil(target / 80));
          function tick() {
            current += step;
            if (current >= target) {
              counter.textContent = String(target);
              return;
            }
            counter.textContent = String(current);
            window.requestAnimationFrame(tick);
          }
          tick();
        });
      });
    }, { threshold: 0.35 });
    if (stats) counterObserver.observe(stats);
  }

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-question");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      item.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });
})();
