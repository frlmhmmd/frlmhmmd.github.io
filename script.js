/* ==========================================================================
   MUHAMMAD FIRLY - PERSONAL PORTFOLIO JAVASCRIPT
   Modular vanilla logic for dark mode, lightbox, PDF viewer, smart navbar,
   smooth scroll-to-top, filtering & CTA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSmartNavbar();
  initMobileMenu();
  initScrollTop();
  initCertFilters();
  initNavScrollSpy();
  initKeyboardListeners();
});

/* ---------------- Theme Toggle (Dark / Light Mode) ---------------- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Retrieve saved preference or default to system
  const savedTheme = localStorage.getItem('firly_theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('firly_theme', newTheme);
    });
  }
}

/* ---------------- Smart Auto-Hide Navbar ---------------- */
function initSmartNavbar() {
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const navMenu = document.getElementById('navMenu');
  if (!navbarWrapper) return;

  let lastScrollY = window.pageYOffset;
  let isScrolling;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;

    // Add subtle shadow when scrolled
    if (currentScrollY > 20) {
      navbarWrapper.classList.add('navbar-scrolled');
    } else {
      navbarWrapper.classList.remove('navbar-scrolled');
    }

    // Do not auto-hide if mobile menu is currently open
    if (navMenu && navMenu.classList.contains('open')) {
      return;
    }

    // Scroll Down -> Hide Navbar (if scrolled past 80px)
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      navbarWrapper.classList.add('navbar-hidden');
    } 
    // Scroll Up -> Show Navbar
    else if (currentScrollY < lastScrollY) {
      navbarWrapper.classList.remove('navbar-hidden');
    }

    // At the very top -> Always Show
    if (currentScrollY <= 20) {
      navbarWrapper.classList.remove('navbar-hidden');
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  }, { passive: true });
}

/* ---------------- Mobile Menu & Backdrop ---------------- */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  const openMenu = () => {
    if (navMenu) navMenu.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('active');
    if (mobileBtn) mobileBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (navMenu) navMenu.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('active');
    if (mobileBtn) mobileBtn.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
    document.body.style.overflow = '';
  };

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when clicking outside on backdrop
    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMenu);
    }

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }
}

/* ---------------- Smooth Scroll to Top (Circular Floating Button & Logo) ---------------- */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const brandLogo = document.querySelector('.brand-logo');

  // Toggle floating button visibility
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 250) {
      if (scrollTopBtn) scrollTopBtn.classList.add('visible');
    } else {
      if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  const scrollToExactTop = (e) => {
    if (e) e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Remove hash without jumping
    if (window.history.pushState) {
      window.history.pushState(null, null, window.location.pathname);
    }
  };

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', scrollToExactTop);
  }

  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      const href = brandLogo.getAttribute('href');
      if (href === '#hero' || href === '#') {
        scrollToExactTop(e);
      }
    });
  }
}

/* ---------------- Scroll Spy for Navigation Active State ---------------- */
function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 180;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ---------------- Certifications Filter ---------------- */
function initCertFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      certCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ---------------- Lightbox Image Modal ---------------- */
function openImageModal(imgSrc, captionText) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');

  if (modal && modalImg) {
    modalImg.src = imgSrc;
    modalCaption.textContent = captionText || 'Dokumentasi Portofolio';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/* ---------------- PDF Viewer Modal (CV ATS) ---------------- */
const openCvModalBtn = document.getElementById('openCvModalBtn');
if (openCvModalBtn) {
  openCvModalBtn.addEventListener('click', openPdfModal);
}

function openPdfModal() {
  const modal = document.getElementById('pdfModal');
  const iframe = document.getElementById('pdfIframe');
  if (modal && iframe) {
    iframe.src = 'cv/CV_Muhammad_Firly_ATS.pdf#toolbar=1&navpanes=0';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closePdfModal() {
  const modal = document.getElementById('pdfModal');
  const iframe = document.getElementById('pdfIframe');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (iframe) {
      iframe.src = '';
    }
  }
}

/* ---------------- Keyboard Listener (Escape key) ---------------- */
function initKeyboardListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeImageModal();
      closePdfModal();
      const navMenu = document.getElementById('navMenu');
      const navBackdrop = document.getElementById('navBackdrop');
      const mobileBtn = document.getElementById('mobileMenuBtn');
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (navBackdrop) navBackdrop.classList.remove('active');
        if (mobileBtn) mobileBtn.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
        document.body.style.overflow = '';
      }
    }
  });
}

/* ---------------- Copy to Clipboard & Toast Alert ---------------- */
function copyText(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message || 'Teks berhasil disalin!');
  }).catch(err => {
    console.error('Gagal menyalin teks: ', err);
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(message || 'Teks berhasil disalin!');
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/* ---------------- Custom WhatsApp Message Generator ---------------- */
function sendCustomWhatsApp() {
  const nameInput = document.getElementById('recruiterName');
  const roleInput = document.getElementById('recruiterRole');

  const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Recruiter / Hiring Team';
  const role = roleInput && roleInput.value.trim() ? roleInput.value.trim() : 'Posisi Teknologi';

  const defaultMsg = `Halo Firly, saya ${name}. Saya telah melihat personal portfolio Anda dan tertarik untuk berdiskusi lebih lanjut terkait peluang kerja / posisi ${role}. Kapan ada waktu luang untuk sesi interview/diskusi?`;
  const encodedMsg = encodeURIComponent(defaultMsg);

  window.open(`https://wa.me/62881011057900?text=${encodedMsg}`, '_blank');
}
