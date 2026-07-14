const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const navItems = nav.querySelectorAll(".nav__item, .nav__item-link");
const heroArrow = document.querySelector(".hero__arrow");
const mobileQuery = window.matchMedia("(max-width: 375px)");

let menuOpen = false;
let menuTimeline = null;

function createMenuTimeline() {
  menuTimeline = gsap.timeline({
    paused: true,
    onReverseComplete: () => {
      nav.classList.remove("active");
      gsap.set(nav, { autoAlpha: 0, y: -24, scale: 0.96, pointerEvents: "none" });
      gsap.set(navItems, { autoAlpha: 0, y: 18 });
      gsap.set(heroArrow, { autoAlpha: 1 });
    },
  });

  menuTimeline
    .set(nav, { pointerEvents: "auto" })
    .fromTo(
      nav,
      { autoAlpha: 0, y: -24, scale: 0.96, xPercent: -50 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "power3.out",
      }
    )
    .fromTo(
      navItems,
      { y: 18, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.35,
        stagger: 0.08,
        ease: "power2.out",
      },
      "-=0.25"
    )
    .to(heroArrow, { autoAlpha: 0, duration: 0.25 }, 0);
}

function setupMobileMenu() {
  if (mobileQuery.matches) {
    gsap.set(nav, { xPercent: -50, autoAlpha: 0, y: -24, scale: 0.96, pointerEvents: "none" });
    gsap.set(navItems, { autoAlpha: 0, y: 18 });

    if (!menuTimeline) createMenuTimeline();
  } else {
    menuOpen = false;
    nav.classList.remove("active");
    menuTimeline?.kill();
    menuTimeline = null;
    gsap.set([nav, ...navItems, heroArrow], { clearProps: "all" });
  }
}

setupMobileMenu();
mobileQuery.addEventListener("change", setupMobileMenu);

burger.addEventListener("click", () => {
  if (!mobileQuery.matches) return;

  menuOpen = !menuOpen;
  nav.classList.toggle("active", menuOpen);

  gsap.to(burger, { scale: 0.88, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" });

  if (menuOpen) {
    menuTimeline.restart();
  } else {
    menuTimeline.reverse();
  }
});

// GSAP animasyonları
gsap.registerPlugin(ScrollTrigger);

// Hero ok — yukarı/aşağı hareket
gsap.set(".hero__arrow", { xPercent: -50, yPercent: -50 });
gsap.to(".hero__arrow", {
  y: 20,
  duration: 0.8,
  ease: "power1.inOut",
  repeat: -1,
  yoyo: true,
});

// Main bölümleri — scroll ile sayfaya girme
const scrollSections = gsap.utils.toArray(
  ".service, .feature, .testimonials, .gallery__item"
);

scrollSections.forEach((section) => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
      toggleActions: "play none none none",
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });
});