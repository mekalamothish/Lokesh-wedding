// Slow, staggered button entrances. State lasts only until this page is refreshed.
(() => {
  const DURATION = 1800;
  const STAGGER = 160;
  const START_DELAY = 180;
  const selector = 'button, a[href], [role="button"]';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !Element.prototype.animate) return;

  const played = new WeakSet();
  const running = new Map();
  let framePending = false;

  function visible(element) {
    return element.getClientRects().length > 0;
  }

  function revealButtons() {
    framePending = false;
    if (preference.matches) return;

    // Finish a disappearing control rather than resuming a partial bounce later.
    for (const [element, animation] of running) {
      if (!visible(element)) animation.cancel();
    }
    const pending = [...document.querySelectorAll(selector)]
      .filter(element => !played.has(element) && visible(element));

    pending.forEach((element, index) => {
      played.add(element);
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

  function scheduleReveal() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(revealButtons);
  }

  const observer = new MutationObserver(scheduleReveal);
  function start() {
    // Only screen visibility changes matter; text, hover and language changes
    // do not restart the animation. No animation state is stored in localStorage.
    observer.observe(document.body, {
      subtree: true, attributes: true, attributeFilter: ['hidden', 'open']
    });
    scheduleReveal();
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
