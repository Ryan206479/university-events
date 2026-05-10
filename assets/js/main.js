/* ==========================================================================
   دليل فعاليات الجامعة - السكربت الرئيسي
   يشمل: الوضع الليلي، الفلترة، التحقق من الفورم، Scroll-to-top
   ========================================================================== */

(function () {
  'use strict';

  /* ====== 1) الوضع الليلي مع حفظه في localStorage ====== */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('ue-theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('ue-theme', isDark ? 'dark' : 'light');
      themeToggle.innerHTML = isDark
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-stars-fill"></i>';
    });
  }

  /* ====== 2) Navbar shadow on scroll ====== */
  const navbar = document.querySelector('.navbar-custom');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  /* ====== 3) زر العودة للأعلى ====== */
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ====== 4) فلترة الفعاليات (search + category + month) ====== */
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const monthFilter = document.getElementById('monthFilter');
  const eventCards = document.querySelectorAll('[data-event-card]');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const cat = categoryFilter?.value || '';
    const mon = monthFilter?.value || '';
    let visible = 0;

    eventCards.forEach(card => {
      const title = (card.dataset.title || '').toLowerCase();
      const desc = (card.dataset.desc || '').toLowerCase();
      const category = card.dataset.category || '';
      const month = card.dataset.month || '';

      const matchQ = !q || title.includes(q) || desc.includes(q);
      const matchCat = !cat || category === cat;
      const matchMon = !mon || month === mon;

      const show = matchQ && matchCat && matchMon;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  [searchInput, categoryFilter, monthFilter].forEach(el => {
    if (el) el.addEventListener('input', applyFilters);
    if (el) el.addEventListener('change', applyFilters);
  });

  // فلترة عبر روابط التصنيفات في الصفحة الرئيسية
  document.querySelectorAll('[data-category-link]').forEach(link => {
    link.addEventListener('click', e => {
      const cat = link.dataset.categoryLink;
      sessionStorage.setItem('ue-filter-cat', cat);
    });
  });

  // تطبيق الفلتر المحفوظ من الصفحة الرئيسية
  if (categoryFilter) {
    const stored = sessionStorage.getItem('ue-filter-cat');
    if (stored) {
      categoryFilter.value = stored;
      sessionStorage.removeItem('ue-filter-cat');
      applyFilters();
    }
  }

  /* ====== 5) التحقق من نموذج الاتصال ====== */
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const subject = contactForm.querySelector('#subject');
      const message = contactForm.querySelector('#message');

      let valid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // الاسم: مطلوب، حرفان فأكثر
      if (!name.value.trim() || name.value.trim().length < 2) {
        name.classList.add('is-invalid'); name.classList.remove('is-valid');
        valid = false;
      } else { name.classList.add('is-valid'); name.classList.remove('is-invalid'); }

      // البريد
      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('is-invalid'); email.classList.remove('is-valid');
        valid = false;
      } else { email.classList.add('is-valid'); email.classList.remove('is-invalid'); }

      // الموضوع
      if (!subject.value.trim() || subject.value.trim().length < 3) {
        subject.classList.add('is-invalid'); subject.classList.remove('is-valid');
        valid = false;
      } else { subject.classList.add('is-valid'); subject.classList.remove('is-invalid'); }

      // الرسالة
      if (!message.value.trim() || message.value.trim().length < 10) {
        message.classList.add('is-invalid'); message.classList.remove('is-valid');
        valid = false;
      } else { message.classList.add('is-valid'); message.classList.remove('is-invalid'); }

      if (!formAlert) return;
      formAlert.style.display = 'block';
      if (valid) {
        formAlert.className = 'alert alert-success mt-3';
        formAlert.innerHTML = '<i class="bi bi-check-circle-fill"></i> تم إرسال رسالتك بنجاح، سنتواصل معك قريباً.';
        contactForm.reset();
        contactForm.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
      } else {
        formAlert.className = 'alert alert-danger mt-3';
        formAlert.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> يرجى تصحيح الحقول المظللة قبل الإرسال.';
      }

      setTimeout(() => { formAlert.style.display = 'none'; }, 6000);
    });
  }

  /* ====== 6) أضف للتقويم (.ics) ====== */
  const addCalBtn = document.getElementById('addToCalendar');
  if (addCalBtn) {
    addCalBtn.addEventListener('click', () => {
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
        'SUMMARY:هاكاثون الذكاء الاصطناعي 2025',
        'DTSTART:20250615T090000', 'DTEND:20250616T180000',
        'LOCATION:قاعة المؤتمرات الكبرى - الجامعة',
        'DESCRIPTION:هاكاثون لمدة 24 ساعة لتطوير حلول AI',
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n');
      const blob = new Blob([ics], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'event.ics'; a.click();
      URL.revokeObjectURL(url);
    });
  }

  /* ====== 7) إبراز الرابط النشط ====== */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('active');
  });

})();
