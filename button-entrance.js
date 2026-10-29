// Repeating attention effects for the invitation's primary actions only.
(() => {
  const selector = '#wed-open-btn, #wed-to-session-3, a[data-i18n="map"], .wed-mute-btn';
  function start() {
    const controls = [...document.querySelectorAll(selector)];
    controls.forEach((element, index) => {
      element.classList.add('wedding-attention', 'animate-pulse', 'animate-bounce');
      element.style.setProperty('--attention-delay', `${(index % 4) * 160}ms`);
    });
    if (!('IntersectionObserver' in window)) {
      controls.forEach(element => element.classList.add('is-attention-visible'));
      return;
    }
    // Keep observing: coming back into view starts the repeating effect again.
    // The margin exceeds the bounce height to avoid boundary flicker.
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-attention-visible', entry.isIntersecting));
    }, {threshold: 0, rootMargin: '24px 0px 24px 0px'});
    controls.forEach(element => observer.observe(element));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
