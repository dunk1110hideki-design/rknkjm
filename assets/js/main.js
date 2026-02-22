'use strict';
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector("nav").classList.add("show");
  }, 1700);
});
/* ============================
   Page Transition
============================ */
const transitionEl = document.getElementById("page-transition");
window.onload = () => {
    transitionEl.classList.remove("active");
};
document.querySelectorAll("a").forEach(link => {
    const url = link.getAttribute("href");
    if (!url || url.startsWith("#") || url.startsWith("javascript")) return;

    link.addEventListener("click", e => {
        e.preventDefault();
        transitionEl.classList.add("active");

        setTimeout(() => {
            window.location.href = url;
        }, 600);
    });
});
