/* Private Sector pages: send direct visits through the landing page first. */
(function () {
  "use strict";
  var ok = false;
  try { ok = sessionStorage.getItem("tic-private") === "1"; } catch (e) { ok = false; }
  if (!ok) location.replace("/private/");
})();
