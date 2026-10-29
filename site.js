(() => {
  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) menu.open = false;
    });
  }

  const brief = document.getElementById('project-brief');
  if (brief) {
    const email = document.getElementById('brief-email');
    const details = document.getElementById('brief-details');
    const updateDraft = () => {
      const areas = [...brief.querySelectorAll('input[name="scope"]:checked')].map(input => input.value);
      const message = details.value.trim();
      const body = ['Hello Flappyware,', '', ...(areas.length ? ['I would like to discuss:', ...areas.map(area => `- ${area}`), ''] : []), ...(message ? [message, ''] : []), 'Thank you.'].join('\n');
      email.href = `mailto:brandon@flappyware.com?subject=${encodeURIComponent('Infrastructure project inquiry')}&body=${encodeURIComponent(body)}`;
    };
    brief.addEventListener('change', updateDraft);
    details.addEventListener('input', updateDraft);
    updateDraft();
    brief.hidden = false;
  }

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('arrive');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.hero-media img, .hero-copy h1, .hero-intro, .section-intro > div, .service-image, .service-row, .work-intro > *, .work-photo img, .work-copy > *, .approach-layout > *, .about-title, .about-copy, .contact-layout > *, .page-hero-layout > *, .page-photo img, .detail-layout > *, .examples-layout > *, .case-heading > *, .case-list article').forEach(element => observer.observe(element));
  }
})();

