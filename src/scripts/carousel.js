/**
 * Shared logic for horizontal scroll-snap carousels (Paths on tablet/mobile,
 * Contributors everywhere).
 *
 * The layout itself is plain CSS: a track with `overflow-x: auto` and
 * `scroll-snap-type: x mandatory`, and slides with `scroll-snap-align: start`.
 * Swiping already works without any JavaScript. This module adds:
 *
 *   - prev/next buttons that move exactly one page
 *   - indicator buttons (one per page), rebuilt when cards-per-page changes
 *   - active page tracking from the scroll position
 *   - Left/Right arrow keys (one card), mouse drag-to-scroll
 *   - a polite live-region announcement after button, dot or key navigation
 *
 * Vocabulary:
 *   first    index of the first card in view (the card snapped to the start edge)
 *   perPage  how many cards fit in one view at the current screen size
 *   page     which "page" that is: pages = ceil(cards / perPage)
 *
 * @typedef {{ first: number, last: number, page: number, pages: number, perPage: number, count: number }} CarouselState
 *
 * @param {object} options
 * @param {HTMLElement} options.track             The scroll container (must be position: relative).
 * @param {HTMLElement[]} options.slides          The cards, in order.
 * @param {HTMLButtonElement} [options.prev]
 * @param {HTMLButtonElement} [options.next]
 * @param {HTMLElement} [options.indicators]      Empty container; one <button> per page is rendered into it.
 * @param {string} [options.indicatorClass]       Class for each indicator button.
 * @param {(page: number, pages: number) => string} [options.indicatorLabel]  aria-label per indicator.
 * @param {Record<number, number>} [options.perPage]  { minWidthPx: cardsPerPage }, e.g. { 0: 1, 1024: 2 }.
 * @param {HTMLElement} [options.live]            aria-live element for announcements.
 * @param {(state: CarouselState) => string} [options.announce]  Text to announce.
 * @param {(state: CarouselState) => void} [options.onChange]    Called when the first card in view changes.
 * @param {() => boolean} [options.isEnabled]     Return false to pause all handling (e.g. Paths on desktop).
 */
export function createCarousel({
  track,
  slides,
  prev,
  next,
  indicators,
  indicatorClass = 'carousel-dot',
  indicatorLabel = (page) => `Go to page ${page + 1}`,
  perPage = { 0: 1 },
  live,
  announce,
  onChange = () => {},
  isEnabled = () => true,
}) {
  const count = slides.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // perPage {0: 1, 1024: 2} -> media queries, widest first, so the first match wins.
  const breakpoints = Object.entries(perPage)
    .map(([min, n]) => ({ min: Number(min), n, mq: window.matchMedia(`(min-width: ${min}px)`) }))
    .sort((a, b) => b.min - a.min);
  const cardsPerPage = () =>
    Math.min(count, (breakpoints.find((b) => b.mq.matches) ?? breakpoints[breakpoints.length - 1]).n);

  let per = cardsPerPage();
  let pages = 0;
  let first = -1;
  /** @type {HTMLButtonElement[]} */
  let dots = [];
  let lockUntil = 0; // while a button/dot scroll animates, ignore in-between scroll positions

  // ---------- Geometry ----------
  const maxFirst = () => Math.max(0, count - per); // the last card that can start a page
  const pageOf = (i) => (i >= maxFirst() ? pages - 1 : Math.floor(i / per));
  const padStart = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;
  const maxScroll = () => track.scrollWidth - track.clientWidth;
  // Distance from one card's start to the next: card width + gap.
  const stride = () => (count > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);

  // Which card is at the start edge right now? At the very end of the track the
  // last cards may not be able to reach the start edge, so treat "scrolled to
  // the end" as the last page.
  const readScroll = () => {
    if (track.scrollLeft >= maxScroll() - 2) return maxFirst();
    return Math.round(track.scrollLeft / stride());
  };

  const state = () => ({
    first,
    last: Math.min(count, first + per) - 1,
    page: pageOf(first),
    pages,
    perPage: per,
    count,
  });

  // ---------- Indicators: one button per page ----------
  function buildIndicators() {
    pages = Math.ceil(count / per);
    if (!indicators) return;
    dots = Array.from({ length: pages }, (_, p) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = indicatorClass;
      b.setAttribute('aria-label', indicatorLabel(p, pages));
      b.addEventListener('click', () => isEnabled() && goTo(p * per));
      return b;
    });
    indicators.replaceChildren(...dots);
  }

  // ---------- Render: update indicators, buttons, callback, announcement ----------
  function render(i, { announceIt = false, force = false } = {}) {
    const target = Math.max(0, Math.min(maxFirst(), i));
    if (target !== first || force) {
      first = target;
      const s = state();
      dots.forEach((d, p) => (p === s.page ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
      onChange(s);
    }
    if (prev) prev.disabled = first <= 0;
    if (next) next.disabled = first >= maxFirst();
    if (announceIt && live && announce) live.textContent = announce(state());
  }

  // ---------- Navigation ----------
  // Scroll so card i sits at the start edge (respecting the track's padding).
  function goTo(i, announceIt = true) {
    const target = Math.max(0, Math.min(maxFirst(), i));
    const left = Math.min(slides[target].offsetLeft - padStart(), maxScroll());
    lockUntil = performance.now() + 1000;
    track.scrollTo({ left, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    render(target, { announceIt });
  }

  // One page = perPage cards.
  prev?.addEventListener('click', () => isEnabled() && goTo(first - per));
  next?.addEventListener('click', () => isEnabled() && goTo(first + per));

  // Arrow keys move one card.
  track.addEventListener('keydown', (e) => {
    if (!isEnabled()) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(first + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(first - 1); }
  });

  // Swipes, trackpads, drag: follow the scroll position (once per frame).
  let ticking = false;
  track.addEventListener(
    'scroll',
    () => {
      if (ticking || !isEnabled()) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (performance.now() >= lockUntil) render(readScroll());
      });
    },
    { passive: true },
  );
  track.addEventListener('scrollend', () => {
    lockUntil = 0;
    if (isEnabled()) render(readScroll());
  });

  // ---------- Mouse drag-to-scroll (touch already scrolls natively) ----------
  /** @type {{ x: number, left: number, id: number, moved: boolean } | null} */
  let drag = null;
  track.addEventListener('pointerdown', (e) => {
    if (!isEnabled() || e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, id: e.pointerId, moved: false };
  });
  track.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 4) {
      // Past 4px it's a drag, not a click: capture the pointer, turn snapping off.
      drag.moved = true;
      track.setPointerCapture(drag.id);
      track.classList.add('is-dragging');
    }
    if (drag.moved) track.scrollLeft = drag.left - dx;
  });
  const endDrag = () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (!moved) return;
    track.classList.remove('is-dragging');
    goTo(readScroll(), false); // settle on the nearest card
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // ---------- Resize: cards-per-page may change, so rebuild the indicators ----------
  new ResizeObserver(() => {
    if (!isEnabled()) return;
    const n = cardsPerPage();
    if (n !== per) {
      per = n;
      buildIndicators();
    }
    render(readScroll(), { force: true });
  }).observe(track);

  // Back to the first card (also used when a layout switches into carousel mode).
  function reset() {
    per = cardsPerPage();
    buildIndicators();
    track.scrollLeft = 0;
    render(0, { force: true });
  }

  reset();
  return { goTo, reset, state };
}
