/* Private Sector landing: remember for this tab that the visitor chose to enter. */
(function () {
  "use strict";
  var enter = document.getElementById("gate-enter");
  if (!enter) return;
  enter.addEventListener("click", function () {
    try { sessionStorage.setItem("tic-private", "1"); } catch (e) { /* storage blocked: link still works */ }
  });
})();
