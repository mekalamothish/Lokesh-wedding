// Bounce each control only when it first enters the viewport, once per refresh.
(() => {
  const DURATION = 1800;
  const STAGGER = 160;
  const START_DELAY = 180;
  const MIN_VISIBLE = .6;
  const selector = 'button, a[href], [role="button"]';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !Element.prototype.animate || !('IntersectionObserver' in window)) return;

  const played = new WeakSet();
  const running = new Map();
  function revealButtons(entries) {
    if (preference.matches) return;
    // Layout visibility alone is not enough: below-the-fold controls must wait
    // until at least 60% is inside the viewport, with room below to see the bounce.
    const pending = entries
      .filter(entry => entry.isIntersecting && entry.intersectionRatio >= MIN_VISIBLE && !played.has(entry.target))
      .map(entry => entry.target)
      .sort((a, b) => {
        const first = a.getBoundingClientRect(), second = b.getBoundingClientRect();
        return first.top - second.top || first.left - second.left;
      });

    pending.forEach((element, index) => {
      played.add(element);
      observer.unobserve(element);
      try {
        // Individual translate/scale preserve existing transforms, including
        // the envelope seal's translate(-50%, -50%) centering and hover styles.
        const animation = element.animate([
          {opacity: 0, translate: '0 24px', scale: '.94', offset: 0,
            easing: 'cubic-bezier(.16,1,.3,1)'},
          {opacity: 1, translate: '0 -9px', scale: '1.025', offset: .52,
            easing: 'cubic-bezier(.4,0,.6,1)'},
          {opacity: 1, translate: '0 3px', scale: '.995', offset: .74,
            easing: 'cubic-bezier(.4,0,.6,1)'},
          {opacity: 1, translate: '0 -1px', scale: '1.003', offset: .9,
            easing: 'ease-out'},
          {opacity: 1, translate: '0 0', scale: '1', offset: 1}
        ], {
          duration: DURATION,
          delay: START_DELAY + index * STAGGER,
          iterations: 1,
          fill: 'backwards'
        });
        running.set(element, animation);
        const cleanup = () => {
          if (running.get(element) === animation) running.delete(element);
        };
        animation.finished.then(cleanup, cleanup);
      } catch {
        // Unsupported animation properties leave the original usable control.
      }
    });
  }

  const observer = new IntersectionObserver(revealButtons, {
    threshold: MIN_VISIBLE,
    rootMargin: '0px 0px -24px 0px'
  });
  function start() {
    // The observer also handles controls inside initially hidden invitation
    // screens. A control is unobserved after its first reveal, so scrolling
    // back, changing language, hovering, or returning to a screen never replays it.
    document.querySelectorAll(selector).forEach(element => observer.observe(element));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, {once: true});
  } else {
    start();
  }

  // Keep a control steady as soon as a guest clicks or focuses it.
  function settleInteractedControl(event) {
    const control = event.target.closest?.(selector);
    running.get(control)?.cancel();
  }
  document.addEventListener('pointerdown', settleInteractedControl, {capture: true, passive: true});
  document.addEventListener('focusin', settleInteractedControl);
  preference.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    running.forEach(animation => animation.cancel());
    running.clear();
  });
})();
