/**
 * Apex Build & Construction Group - Main Interactive Scripts
 * Handles mobile nav, smooth interactions, portfolio filtering, 
 * live cost estimation calculator, and FAQ accordions.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Menu Toggle ---
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

    // Close mobile nav when clicking any link
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- 2. Header Scroll Effect & Active Navigation Link Spy ---
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy for Nav Links
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  });

  // --- 3. Portfolio Category Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // --- 4. Interactive Construction Cost Calculator ---
  const calcType = document.getElementById('calcType');
  const calcSqft = document.getElementById('calcSqft');
  const sqftDisplay = document.getElementById('sqftDisplay');
  const calcResultDisplay = document.getElementById('calcResultDisplay');
  const finishGradeInputs = document.querySelectorAll('input[name="finishGrade"]');
  const useEstimateBtn = document.getElementById('useEstimateBtn');

  // Pricing model matrices (Base cost per sq. ft. [Low, High])
  const baseRates = {
    commercial: [240, 350],
    residential: [280, 420],
    renovation: [150, 260],
    industrial: [130, 210]
  };

  // Grade multipliers
  const gradeMultipliers = {
    standard: 0.90,
    premium: 1.05,
    luxury: 1.30
  };

  function updateEstimate() {
    if (!calcType || !calcSqft || !calcResultDisplay) return;

    const type = calcType.value;
    const sqft = parseInt(calcSqft.value, 10);
    sqftDisplay.textContent = `${sqft.toLocaleString()} sq ft`;

    let selectedGrade = 'premium';
    finishGradeInputs.forEach(input => {
      if (input.checked) selectedGrade = input.value;
    });

    const [lowRate, highRate] = baseRates[type] || [200, 300];
    const multiplier = gradeMultipliers[selectedGrade] || 1;

    const totalLow = Math.round((sqft * lowRate * multiplier) / 1000) * 1000;
    const totalHigh = Math.round((sqft * highRate * multiplier) / 1000) * 1000;

    calcResultDisplay.textContent = `$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}`;
  }

  if (calcType && calcSqft) {
    calcType.addEventListener('change', updateEstimate);
    calcSqft.addEventListener('input', updateEstimate);
    finishGradeInputs.forEach(radio => radio.addEventListener('change', updateEstimate));
    updateEstimate(); // Initialize
  }

  // Prepopulate Contact Form with Calculator Result
  if (useEstimateBtn) {
    useEstimateBtn.addEventListener('click', () => {
      const type = calcType.value;
      const sqft = calcSqft.value;
      const estimateText = calcResultDisplay.textContent;

      // Map to contact select
      const contactTypeSelect = document.getElementById('projectTypeSelect');
      if (contactTypeSelect) {
        contactTypeSelect.value = type;
      }

      const scopeTextarea = document.getElementById('projectScope');
      if (scopeTextarea) {
        scopeTextarea.value = `[Applied from Estimator]: Looking to build approximately ${parseInt(sqft, 10).toLocaleString()} sq. ft. (${type.toUpperCase()}). Estimated calculator budget is ${estimateText}. Please prepare a formal feasibility review.`;
      }

      // Smooth scroll to contact
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- 5. FAQ Accordion Toggle ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const btn = otherItem.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', String(!isActive));
    });
  });

  // --- 6. Contact Form Validation & Submission ---
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
        alert('Please fill out all required fields marked with *');
        return;
      }

      // Simulate sending
      submitFormBtn.disabled = true;
      submitFormBtn.textContent = 'Submitting Request...';

      setTimeout(() => {
        contactForm.reset();
        submitFormBtn.disabled = false;
        submitFormBtn.textContent = 'Submit Proposal Request';
        if (formSuccessMessage) {
          formSuccessMessage.style.display = 'block';
          setTimeout(() => {
            formSuccessMessage.style.display = 'none';
          }, 8000);
        }
      }, 900);
    });
  }

});
