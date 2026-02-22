/* =========================================
    基本要素
========================================= */
const fv = document.querySelector(".fv");
const container = document.querySelector(".other-container");
let thumbs = [...document.querySelectorAll(".other-container-img")];
let currentIndex = 0;

/* =========================================
    ❶ 背景画像を data-bg から適用
========================================= */
thumbs.forEach(t => {
    const url = t.dataset.bg;
    t.style.backgroundImage = `url(${url})`;
});

/* =========================================
    ❷ 初期表示（FVに最初の画像セット）
========================================= */
window.addEventListener("load", () => {
    thumbs.forEach(t => setTimeout(() => t.classList.add("loaded"), 50));

    if (thumbs[0]) {
        fv.style.backgroundImage = `url(${thumbs[0].dataset.bg})`;
        thumbs[0].classList.add("active");
    }
});

/* =========================================
    ❸ FV切り替え（クロスフェード）
========================================= */
function changeFV(index) {
    fv.classList.add("fade-out");

    setTimeout(() => {
        fv.style.backgroundImage = `url(${thumbs[index].dataset.bg})`;
        fv.classList.remove("fade-out");
    }, 250);

    thumbs.forEach(t => t.classList.remove("active"));
    thumbs[index].classList.add("active");

    scrollToActive(index);
    currentIndex = index;
}

/* =========================================
    ❹ サムネクリック → FV切り替え
========================================= */
thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => changeFV(index));
});

/* =========================================
    ❺ ←→キー操作
========================================= */
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        changeFV((currentIndex + 1) % thumbs.length);
    } else if (e.key === "ArrowLeft") {
        changeFV((currentIndex - 1 + thumbs.length) % thumbs.length);
    }
});

/* =========================================
    ❻ FVスワイプ（スマホ）
========================================= */
let touchStartX = 0;

fv.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
});

fv.addEventListener("touchend", e => {
    const move = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(move) < 40) return;

    move < 0
        ? changeFV((currentIndex + 1) % thumbs.length)
        : changeFV((currentIndex - 1 + thumbs.length) % thumbs.length);
});

/* =========================================
    ❼ ドラッグスクロール（PC）
========================================= */
let isDragging = false;
let dragStartX = 0;
let dragScrollLeft = 0;

container.addEventListener("mousedown", (e) => {
    isDragging = true;
    container.classList.add("dragging");
    dragStartX = e.pageX;
    dragScrollLeft = container.scrollLeft;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    container.classList.remove("dragging");
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    container.scrollLeft = dragScrollLeft - (e.pageX - dragStartX);
});

/* =========================================
    ❽ スマホスワイプでサムネイルスクロール
========================================= */
let swipeStartX = 0;
let swipeScrollLeft = 0;

container.addEventListener("touchstart", (e) => {
    swipeStartX = e.touches[0].clientX;
    swipeScrollLeft = container.scrollLeft;
});

container.addEventListener("touchmove", (e) => {
    container.scrollLeft = swipeScrollLeft - (e.touches[0].clientX - swipeStartX);
});

/* =========================================
    ❾ FV切り替え時にサムネ中央へ移動
========================================= */
function scrollToActive(index) {
    thumbs[index].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
    });
}

/* =========================================
    ❿ 絞り込み（複数選択可）
========================================= */
const filterTags = document.querySelectorAll(".filter-tag");
let selectedFilters = new Set();

filterTags.forEach(tag => {
    tag.addEventListener("click", () => {
        const filter = tag.dataset.filter;

        if (selectedFilters.has(filter)) {
            selectedFilters.delete(filter);
            tag.classList.remove("active");
        } else {
            selectedFilters.add(filter);
            tag.classList.add("active");
        }

        applyFilter();
    });
});

function applyFilter() {
    if (selectedFilters.size === 0) {
        thumbs.forEach(t => {
            t.style.display = "block";
            t.classList.add("loaded");
        });
        return;
    }

    thumbs.forEach(t => {
        const cat = t.dataset.cat;
        if (selectedFilters.has(cat)) {
            t.style.display = "block";
            t.classList.add("loaded");
        } else {
            t.style.display = "none";
            t.classList.remove("loaded");
        }
    });

    container.scrollLeft = 0;
}

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