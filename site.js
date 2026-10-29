(() => {
  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) menu.open = false;
    });
  }

  const brief = document.getElementById('project-brief');
  if (brief) {
    const status = document.getElementById('brief-status');
    const button = document.getElementById('brief-send');
    brief.addEventListener('submit', async event => {
      event.preventDefault();
      if (!brief.reportValidity() || button.disabled) return;
      const form = new FormData(brief);
      const payload = {name:form.get('name'),email:form.get('email'),company:form.get('company'),message:form.get('message'),source:form.get('source'),website:form.get('website'),services:form.getAll('scope')};
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      button.disabled = true;
      status.textContent = 'Sending your inquiry…';
      try {
        const response = await fetch('https://flappyware-site-contact.flappyware-llc.workers.dev/', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || 'Please try again or email brandon@flappyware.com.');
        window.location.assign('/inquiry-received/');
      } catch (error) {
        status.textContent = error.name === 'AbortError' || error instanceof TypeError ? 'We could not confirm delivery. Please email brandon@flappyware.com.' : error.message;
        button.disabled = false;
      } finally { clearTimeout(timeout); }
    });
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

