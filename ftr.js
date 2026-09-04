document.addEventListener("DOMContentLoaded", function () {
  // ===== AOS init =====
  AOS.init({
    duration: 700,
    easing: "ease-out-cubic",
    once: true,
    offset: 40,
    disable: window.innerWidth < 576 ? true : false,
  });

  // ===== Newsletter form submission → ./404.html =====
  const newsletterForm = document.querySelector(".newsletter-wrap form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "./404.html";
    });
  }

  // ===== All other links with href go to ./404.html (except #top) =====
  // document
  //   .querySelectorAll(
  //     'a[href]:not([href="#top"]):not([href^="#"]):not([href^="javascript:"])',
  //   )
  //   .forEach(function (el) {
  //     el.addEventListener("click", function (e) {
  //       e.preventDefault();
  //       window.location.href = "./404.html";
  //     });
  //   });

  // ===== "Back to top" smooth scroll =====
  const backBtn = document.querySelector('a[href="#top"]');
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  console.log("✅ STACKLY Footer ready.");
});
