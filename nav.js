document.addEventListener("DOMContentLoaded", function () {
  // =============================================================
  // 1.  INITIALIZE AOS
  // =============================================================
  AOS.init({
    once: false,
    mirror: true,
    duration: 700,
    easing: "ease-out-cubic",
  });

  // =============================================================
  // 2.  DOM REFS
  // =============================================================
  const hamburger = document.getElementById("hamburgerToggle");
  const overlay = document.getElementById("navOverlay");
  const closeBtn = document.getElementById("overlayCloseBtn");
  const overlayLinks = document.querySelectorAll(".nav-link-overlay");
  const body = document.body;

  // =============================================================
  // 3.  GSAP TIMELINE (reusable)
  // =============================================================
  let menuTl = null;

  function animateMenuOpen() {
    if (menuTl) menuTl.kill();
    menuTl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.5 },
    });

    // Overlay fades in
    menuTl.to(
      overlay,
      {
        opacity: 1,
        visibility: "visible",
        duration: 0.3,
        ease: "power2.out",
      },
      0,
    );

    // Inner panel slides in from left
    menuTl.to(
      ".nav-overlay-inner",
      {
        x: "0%",
        duration: 0.6,
        ease: "power3.out",
      },
      0.05,
    );

    // Stagger links (GSAP handles them, but we also have CSS transitions as fallback)
    menuTl.fromTo(
      ".overlay-nav-list li",
      {
        opacity: 0,
        x: -30,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.07,
        ease: "power2.out",
      },
      0.15,
    );

    // Login button fade-up
    menuTl.fromTo(
      ".overlay-login-wrap",
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      0.35,
    );

    // Footer fade
    menuTl.fromTo(
      ".overlay-footer",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.3,
        ease: "power1.out",
      },
      0.45,
    );

    return menuTl;
  }

  function animateMenuClose() {
    if (menuTl) menuTl.kill();
    menuTl = gsap.timeline({
      defaults: { ease: "power3.in", duration: 0.35 },
    });

    // Inner panel slides out
    menuTl.to(
      ".nav-overlay-inner",
      {
        x: "-100%",
        duration: 0.4,
        ease: "power3.in",
      },
      0,
    );

    // Overlay fades out
    menuTl.to(
      overlay,
      {
        opacity: 0,
        visibility: "hidden",
        duration: 0.25,
        ease: "power2.in",
      },
      0.2,
    );

    return menuTl;
  }

  // =============================================================
  // 4.  OPEN / CLOSE FUNCTIONS
  // =============================================================
  function openMenu() {
    if (overlay.classList.contains("open")) return;
    overlay.classList.add("open");
    hamburger.classList.add("active");
    body.style.overflow = "hidden";
    animateMenuOpen();
  }

  function closeMenu() {
    if (!overlay.classList.contains("open")) return;
    // First animate out
    animateMenuClose().then(() => {
      overlay.classList.remove("open");
      hamburger.classList.remove("active");
      body.style.overflow = "";
    });
    // Fallback: remove classes after animation
    setTimeout(() => {
      overlay.classList.remove("open");
      hamburger.classList.remove("active");
      body.style.overflow = "";
    }, 500);
  }

  // =============================================================
  // 5.  EVENT LISTENERS
  // =============================================================

  // Toggle hamburger
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    if (overlay.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close button
  closeBtn.addEventListener("click", closeMenu);

  // Click on overlay background (outside inner panel) to close
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeMenu();
    }
  });

  // Close when a nav link is clicked (navigation)
  overlayLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      // Allow the link to navigate, but close the menu first
      const href = link.getAttribute("href");
      if (href && !href.startsWith("#")) {
        e.preventDefault();
        closeMenu();
        // Navigate after close animation
        setTimeout(function () {
          window.location.href = href;
        }, 450);
      } else {
        closeMenu();
      }
    });
  });

  // =============================================================
  // 6.  ACTIVE LINK HIGHLIGHT
  // =============================================================
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  document
    .querySelectorAll(".nav-link, .nav-link-overlay")
    .forEach(function (el) {
      const href = el.getAttribute("href");
      if (href === currentPath) {
        el.classList.add("active");
      } else if (currentPath === "" && href === "index.html") {
        el.classList.add("active");
      }
      // Remove active from others if needed (Bootstrap handles this)
    });

  // =============================================================
  // 7.  GSAP NAVBAR SCROLL EFFECT (subtle)
  // =============================================================
  const navbar = document.getElementById("mainNavbar");
  let lastScroll = 0;

  window.addEventListener("scroll", function () {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 80) {
      navbar.style.boxShadow = "0 8px 40px rgba(27,42,74,0.4)";
      navbar.style.padding = "0.4rem 1.5rem";
    } else {
      navbar.style.boxShadow = "0 4px 30px rgba(27,42,74,0.3)";
      navbar.style.padding = "0.75rem 1.5rem";
    }
    if (currentScroll > 120) {
      navbar.style.background = "rgba(27,42,74,0.94)";
      navbar.style.backdropFilter = "blur(12px)";
    } else {
      navbar.style.background = "var(--navy)";
      navbar.style.backdropFilter = "none";
    }
    lastScroll = currentScroll;
  });

  // =============================================================
  // 8.  LOGO IMAGE FALLBACK (if src fails, show text)
  // =============================================================
  const logoImg = document.getElementById("brandLogo");
  logoImg.addEventListener("error", function () {
    this.style.display = "none";
    const parent = this.closest(".navbar-brand");
    if (parent) {
      const fallback = document.createElement("span");
      fallback.className = "fw-bold fs-4";
      fallback.style.color = "var(--orange)";
      fallback.textContent = "TH";
      parent.prepend(fallback);
    }
  });

  // Small logo fallback
  const logoImgSm = document.querySelector(".logo-img-sm");
  if (logoImgSm) {
    logoImgSm.addEventListener("error", function () {
      this.style.display = "none";
    });
  }

  console.log("✅ Navbar initialized with Tailwind + Bootstrap + GSAP + AOS");
  console.log("🎨 Color palette: Navy #1B2A4A | Orange #FF6B35");
  console.log(
    "📱 Mobile-first | Full-screen overlay with left-aligned content",
  );
});
