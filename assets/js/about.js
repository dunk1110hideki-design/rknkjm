'use strict';
const svItems = document.querySelectorAll('.sv li');
const io_sv = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.35 });
svItems.forEach(item => io_sv.observe(item));

gsap.utils.toArray('.js-fadein').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});
gsap.utils.toArray('.slide-txt').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: "top 75%",
    onEnter: () => el.classList.add("is-active"),
    onLeaveBack: () => el.classList.remove("is-active")
  });
});
gsap.utils.toArray('.about-container').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    onEnter: () => el.classList.add('is-visible'),
    onLeaveBack: () => el.classList.remove('is-visible')
  });
});
if (window.innerWidth > 1024) {
  const navLinks = document.querySelectorAll('.sidebar__link');
  const sections = document.querySelectorAll('#about, #style, #contact');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));
  const fv = document.querySelector('.fv');
  if (fv) {
    const fvObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('is-active'));
        }
      });
    }, {
      rootMargin: "-10% 0px -80% 0px",
      threshold: 0
    });
    fvObserver.observe(fv);
  }
}

const sidenav = document.querySelector('.sidenav');
const about = document.querySelector('#about');
let lastScrollY = window.scrollY;
window.addEventListener("scroll", () => {
  const currentY = window.scrollY;
  if (window.innerWidth > 1024) {
    sidenav.classList.remove("hide");
    sidenav.style.transform = "";
    return;
  }
  if (currentY < about.offsetTop - 120) {
    sidenav.classList.add("hide");
    return;
  }
  if (currentY > lastScrollY) {
    sidenav.classList.add("hide");
  } else {
    sidenav.classList.remove("hide");
  }

  lastScrollY = currentY;
});



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

