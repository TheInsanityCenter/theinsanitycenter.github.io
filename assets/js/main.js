/* The Insanity Center - interactions
   Nav toggle, scroll reveals (IntersectionObserver only), copy-to-clipboard,
   gallery 3D trigger. No window scroll listeners. */
(function () {
  "use strict";

  /* ---- mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
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
      ta.style.position = "fixed";
      ta.style.opacity = "0";
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
