'use strict';

/* =========================================================
 フェードイン（スクロール演出）
========================================================= */
const fadeTargets = document.querySelectorAll('.fade');
fadeTargets.forEach((el, i) => el.classList.add(i % 2 === 0 ? 'from-left' : 'from-right'));

let lastY = window.scrollY;
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const el = entry.target;
    const rect = entry.boundingClientRect;
    const scrollingDown = window.scrollY > lastY;
    const scrollingUp   = window.scrollY < lastY;

    if (entry.isIntersecting) {
      el.classList.add("is-visible");
      el.classList.remove("is-leave");
    } else {
      const leftBelow  = scrollingDown && rect.top >= window.innerHeight;
      const leftAbove  = scrollingUp   && rect.bottom <= 0;
      if (leftBelow || leftAbove) {
        el.classList.remove("is-visible");
        el.classList.add("is-leave");
      }
    }
  });
  lastY = window.scrollY;
}, { threshold: 0, rootMargin: "-10% 0px -10% 0px" });

fadeTargets.forEach(el => io.observe(el));

/* =========================================================
モーダルの DOM 取得
========================================================= */
const modal = document.getElementById("modal");
const modalImg = document.querySelector(".modal-img");
const modalClose = document.querySelector(".modal-close");
const modalBg = document.querySelector(".modal-bg");
const modalThumbs = document.querySelector(".modal-thumbs");


/* =========================================================
モーダルを開く（メイン画像＋サムネ生成）
========================================================= */
document.querySelectorAll(".open-modal").forEach(section => {
  section.addEventListener("click", e => {
    e.preventDefault();

    // メイン画像取得
    const mainImgEl =
      section.querySelector(".section-img") ||
      section.querySelector(".wide-section1-img") ||
      section.querySelector(".wide-section2-img") ||
      section.querySelector(".long-section1-img") ||
      section.querySelector(".long-section2-img");

    const bg = getComputedStyle(mainImgEl).backgroundImage;
    const mainUrl = bg.slice(5, -2);
    modalImg.src = mainUrl;

    // サムネ生成
    modalThumbs.innerHTML = "";
    const thumbs = section.querySelectorAll(".thumb-img");

    // 最初に main を追加
    const firstT = document.createElement("img");
    firstT.src = mainUrl;
    firstT.className = "modal-thumb active";
    firstT.addEventListener("click", () => switchTo(firstT));
    modalThumbs.appendChild(firstT);

    // 追加サムネ
    thumbs.forEach((thumb) => {
      const t = document.createElement("img");
      t.src = thumb.src;
      t.className = "modal-thumb";
      t.addEventListener("click", () => switchTo(t));
      modalThumbs.appendChild(t);
    });

    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
  });
});


/* =========================================================
サムネ切り替え共通関数
========================================================= */
function switchTo(t) {
  modalImg.classList.add("fade-change");
  setTimeout(() => {
    modalImg.src = t.src;
    modalImg.classList.remove("fade-change");
  }, 160);

  document.querySelectorAll(".modal-thumb").forEach(x => x.classList.remove("active"));
  t.classList.add("active");
}


/* =========================================================
モーダル閉じる（ESC対応あり）
========================================================= */
const closeModal = () => {
  modal.classList.add("hide");
  setTimeout(() => {
    modal.classList.remove("show", "hide");
    document.body.style.overflow = "";
  }, 400);
};

modalClose.addEventListener("click", closeModal);
modalBg.addEventListener("click", closeModal);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal.classList.contains("show")) {
    closeModal();
  }
});


/* =========================================================
画像切替：キーボード & スワイプ
========================================================= */
function switchToIndex(index) {
  const thumbs = Array.from(document.querySelectorAll(".modal-thumb"));
  if (!thumbs.length) return;
  switchTo(thumbs[index]);
}

/* ← → キー */
document.addEventListener("keydown", e => {
  if (!modal.classList.contains("show")) return;
  const thumbs = Array.from(document.querySelectorAll(".modal-thumb"));
  const current = thumbs.findIndex(t => t.classList.contains("active"));
  if (current < 0) return;
  if (e.key === "ArrowLeft")  switchToIndex((current - 1 + thumbs.length) % thumbs.length);
  if (e.key === "ArrowRight") switchToIndex((current + 1) % thumbs.length);
});

/* スワイプ */
let startX = 0;
let endX = 0;
modalImg.addEventListener("touchstart", e => startX = e.touches[0].clientX);
modalImg.addEventListener("touchend", e => {
  endX = e.changedTouches[0].clientX;
  const dist = endX - startX;
  const thumbs = Array.from(document.querySelectorAll(".modal-thumb"));
  const current = thumbs.findIndex(t => t.classList.contains("active"));
  if (current < 0) return;

  if (dist > 40) switchToIndex((current - 1 + thumbs.length) % thumbs.length);
  if (dist < -40) switchToIndex((current + 1) % thumbs.length);
});

/* =========================================================
背景・タイトル：fadein
========================================================= */
window.addEventListener("load", () => {
  document.querySelector(".page-bg")?.classList.add("visible");
  document.querySelector(".title")?.classList.add("visible");
});
/* =========================================================
SCROLL
========================================================= */
let lastScrollY = window.scrollY;
const scrollEl = document.querySelector(".scroll-pulse");
window.addEventListener("scroll", () => {
  if (!scrollEl) return;
  const currentY = window.scrollY;

  if (currentY > lastScrollY && currentY > 40) {
    scrollEl.style.opacity = "0";
    scrollEl.style.filter = "blur(6px)";
    scrollEl.style.transition = "opacity .7s ease, filter .7s ease";
  }
  if (currentY < lastScrollY) {
    scrollEl.style.opacity = "1";
    scrollEl.style.filter = "blur(0)";
    scrollEl.style.transition = "opacity .6s ease, filter .6s ease";
  }
  lastScrollY = currentY;
});
/* =========================================================
CURSOR
========================================================= */
const cursor = document.querySelector(".cursor");
const cursorText = document.querySelector(".cursor-text");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
  cursorText.style.left = `${e.clientX}px`;
  cursorText.style.top = `${e.clientY}px`;
});

document.querySelectorAll(".cursor-hover").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("active");
    cursorText.classList.add("active");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("active");
    cursorText.classList.remove("active");
  });
});

document.addEventListener("scroll", () => {
  cursor.style.opacity = "1";
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