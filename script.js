(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Smooth scroll for [data-scroll] and in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href");
      if (targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* ---------- FAQ accordion ---------- */
  var accordion = document.getElementById("accordion");
  if (accordion) {
    var triggers = accordion.querySelectorAll(".accordion-trigger");
    triggers.forEach(function (trigger) {
      var panel = trigger.closest(".accordion-item").querySelector(".accordion-panel");
      panel.style.maxHeight = "0px";

      trigger.addEventListener("click", function () {
        var isOpen = trigger.getAttribute("aria-expanded") === "true";

        // close all
        triggers.forEach(function (t) {
          t.setAttribute("aria-expanded", "false");
          var p = t.closest(".accordion-item").querySelector(".accordion-panel");
          p.style.maxHeight = "0px";
        });

        if (!isOpen) {
          trigger.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + 20 + "px";
        }
      });
    });
  }

  /* ---------- Testimonial carousel ---------- */
  (function () {
    var track = document.getElementById("testimonial-track");
    var prevBtn = document.getElementById("testimonial-prev");
    var nextBtn = document.getElementById("testimonial-next");
    var dotsWrap = document.getElementById("testimonial-dots");
    if (!track) return;

    var slides = Array.prototype.slice.call(track.children);
    var index = 0;
    var autoplayId = null;
    var isPointerDown = false;
    var startX = 0;

    function slidesPerView() {
      var w = window.innerWidth;
      if (w <= 720) return 1;
      if (w <= 980) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, slides.length - slidesPerView());
    }

    function buildDots() {
      dotsWrap.innerHTML = "";
      var count = maxIndex() + 1;
      for (var i = 0; i < count; i++) {
        var dot = document.createElement("button");
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Go to testimonial group " + (i + 1));
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
        (function (i) {
          dot.addEventListener("click", function () {
            goTo(i);
            restartAutoplay();
          });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    }

    function goTo(i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      var slideWidth = slides[0].getBoundingClientRect().width;
      var gap = 20;
      track.scrollTo({ left: index * (slideWidth + gap), behavior: "smooth" });
      updateDots();
    }

    function next() {
      goTo(index >= maxIndex() ? 0 : index + 1);
    }
    function prev() {
      goTo(index <= 0 ? maxIndex() : index - 1);
    }

    function startAutoplay() {
      autoplayId = setInterval(next, 5000);
    }
    function stopAutoplay() {
      if (autoplayId) clearInterval(autoplayId);
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restartAutoplay(); });

    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", startAutoplay);
    track.addEventListener("focusin", stopAutoplay);
    track.addEventListener("focusout", startAutoplay);

    /* touch/swipe */
    track.addEventListener("pointerdown", function (e) {
      isPointerDown = true;
      startX = e.clientX;
      stopAutoplay();
    });
    track.addEventListener("pointerup", function (e) {
      if (!isPointerDown) return;
      isPointerDown = false;
      var delta = e.clientX - startX;
      if (delta > 40) prev();
      else if (delta < -40) next();
      restartAutoplay();
    });

    window.addEventListener("resize", function () {
      buildDots();
      goTo(index);
    });

    buildDots();
    startAutoplay();
  })();

  /* ---------- Flyer lightbox ---------- */
  (function () {
    var grid = document.getElementById("flyer-grid");
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightbox-img");
    var closeBtn = document.getElementById("lightbox-close");
    var prevBtn = document.getElementById("lightbox-prev");
    var nextBtn = document.getElementById("lightbox-next");
    if (!grid || !lightbox) return;

    var items = Array.prototype.slice.call(grid.querySelectorAll(".flyer-item"));
    var current = 0;

    function open(i) {
      current = i;
      var full = items[current].getAttribute("data-full");
      lightboxImg.src = full;
      lightboxImg.alt = "DarviX Algo training flyer, enlarged view";
      lightbox.hidden = false;
      closeBtn.focus();
      document.body.style.overflow = "hidden";
    }

    function close() {
      lightbox.hidden = true;
      lightboxImg.src = "";
      document.body.style.overflow = "";
    }

    function show(delta) {
      current = (current + delta + items.length) % items.length;
      lightboxImg.src = items[current].getAttribute("data-full");
    }

    items.forEach(function (item, i) {
      item.addEventListener("click", function () {
        if (item.classList.contains("flyer-placeholder")) return;
        open(i);
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (nextBtn) nextBtn.addEventListener("click", function () { show(1); });
    if (prevBtn) prevBtn.addEventListener("click", function () { show(-1); });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(1);
      if (e.key === "ArrowLeft") show(-1);
    });
  })();
})();
