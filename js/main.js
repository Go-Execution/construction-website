/**
 * Clifton Constructions - Interactive & Animation Scripts
 * - Scroll-reveal animations (IntersectionObserver)
 * - Stat counters count-up
 * - Live cost estimation calculator
 * - Portfolio category filters
 * - FAQ accordion
 * - Mobile menu & Back to Top button
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Scroll-Reveal Animations (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Trigger only once for performance
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // --- 2. Interactive Animated Stat Counters ---
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.textContent.includes('+') ? '+' : '';
      let count = 0;
      const step = Math.ceil(target / 45);

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = `${target}${suffix}`;
          clearInterval(timer);
        } else {
          counter.textContent = `${count}${suffix}`;
        }
      }, 35);
    });
  }

  // Trigger counters after slight delay on hero load
  setTimeout(() => {
    runCounters();
  }, 400);

  // --- 3. Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- 4. Header Scroll State & Back to Top Button ---
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header shadow
    if (scrollPos > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Active Navigation Link Spy
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollPos > sectionTop && scrollPos <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 5. Portfolio Filtering with Smooth Animation ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 6. Quick Construction Estimator ---
  const calcType = document.getElementById('calcType');
  const calcSqft = document.getElementById('calcSqft');
  const sqftDisplay = document.getElementById('sqftDisplay');
  const calcResultDisplay = document.getElementById('calcResultDisplay');
  const useEstimateBtn = document.getElementById('useEstimateBtn');

  const baseRates = {
    commercial: [240, 350],
    residential: [280, 420],
    renovation: [150, 260]
  };

  function updateEstimate() {
    if (!calcType || !calcSqft || !calcResultDisplay) return;

    const type = calcType.value;
    const sqft = parseInt(calcSqft.value, 10);
    sqftDisplay.textContent = `${sqft.toLocaleString()} sq ft`;

    const [low, high] = baseRates[type] || [200, 300];
    const totalLow = Math.round((sqft * low) / 1000) * 1000;
    const totalHigh = Math.round((sqft * high) / 1000) * 1000;

    calcResultDisplay.textContent = `$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}`;
  }

  if (calcType && calcSqft) {
    calcType.addEventListener('change', updateEstimate);
    calcSqft.addEventListener('input', updateEstimate);
    updateEstimate();
  }

  if (useEstimateBtn) {
    useEstimateBtn.addEventListener('click', () => {
      const type = calcType.value;
      const sqft = calcSqft.value;
      const estimateText = calcResultDisplay.textContent;

      const contactTypeSelect = document.getElementById('projectTypeSelect');
      if (contactTypeSelect) {
        contactTypeSelect.value = type;
      }

      const scopeTextarea = document.getElementById('projectScope');
      if (scopeTextarea) {
        scopeTextarea.value = `[Estimator: ${parseInt(sqft, 10).toLocaleString()} sq ft, ${type.toUpperCase()}, Range: ${estimateText}]. Requesting formal site review.`;
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- 7. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const btn = other.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', String(!isActive));
    });
  });

  // --- 8. Contact Form Handling ---
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const submitFormBtn = document.getElementById('submitFormBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('emailAddr').value.trim();
      const phone = document.getElementById('phoneNum').value.trim();
      const scope = document.getElementById('projectScope').value.trim();

      if (!name || !email || !phone || !scope) {
        alert('Please fill out all required fields.');
        return;
      }

      submitFormBtn.disabled = true;
      submitFormBtn.textContent = 'Sending...';

      setTimeout(() => {
        contactForm.reset();
        submitFormBtn.disabled = false;
        submitFormBtn.textContent = 'Send Request';
        if (formSuccessMessage) {
          formSuccessMessage.style.display = 'block';
          setTimeout(() => {
            formSuccessMessage.style.display = 'none';
          }, 6000);
        }
      }, 700);
    });
  }

});
