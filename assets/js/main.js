/* The Insanity Center - interactions
   Nav toggle, scroll reveals (IntersectionObserver only), copy-to-clipboard,
   gallery 3D trigger. No window scroll listeners. */
(function () {
  "use strict";

  /* ---- mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---- scroll reveals ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- current section in the menu (aria-current="location") ---- */
  var spyLinks = [];
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    var target = document.getElementById(a.getAttribute("href").slice(1));
    if (target) spyLinks.push({ link: a, target: target, seen: false });
  });
  if ("IntersectionObserver" in window && spyLinks.length) {
    var mark = function () {
      var current = null;
      /* menu order follows page order, so the last section crossing the band
         wins (a nested block like #contact beats its parent #help) */
      spyLinks.forEach(function (s) { if (s.seen) current = s; });
      spyLinks.forEach(function (s) {
        if (s === current) s.link.setAttribute("aria-current", "location");
        else s.link.removeAttribute("aria-current");
      });
    };
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          spyLinks.forEach(function (s) { if (s.target === entry.target) s.seen = entry.isIntersecting; });
        });
        mark();
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 }
    );
    spyLinks.forEach(function (s) { spy.observe(s.target); });
  }

  /* ---- copy-to-clipboard ---- */
  function copyText(text, btn) {
    function done() {
      var hint = btn.parentElement.querySelector(".copy-hint");
      btn.classList.add("copied");
      btn.textContent = "Copied";
      if (hint) hint.textContent = "Paste it into an email to theinsanitycenter@gmail.com";
      setTimeout(function () {
        btn.classList.remove("copied");
        btn.textContent = btn.getAttribute("data-label") || "Copy application";
      }, 2600);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.className = "copy-scratch";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { /* noop */ }
      document.body.removeChild(ta);
    }
  }

  document.querySelectorAll(".copy-btn[data-copy]").forEach(function (btn) {
    btn.setAttribute("data-label", btn.textContent);
    btn.addEventListener("click", function () {
      var src = document.querySelector('script[data-copy-src="' + btn.getAttribute("data-copy") + '"]');
      if (src) copyText(src.textContent.replace(/^\n+|\s+$/g, ""), btn);
    });
  });
})();
