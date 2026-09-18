(function () {
  const gallery = document.getElementById("shop-gallery");
  if (!gallery) return;

  const track = document.getElementById("shop-gallery-track");
  const dotsContainer = document.getElementById("shop-gallery-dots");
  const prevBtn = gallery.querySelector(".gallery-arrow--prev");
  const nextBtn = gallery.querySelector(".gallery-arrow--next");
  const slides = Array.from(track.children);

  if (slides.length <= 1) {
    if (prevBtn) prevBtn.hidden = true;
    if (nextBtn) nextBtn.hidden = true;
    return;
  }

  // Build dots
  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "shop-gallery-dot";
    dot.setAttribute("aria-label", "Go to image " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
    return dot;
  });

  function setActiveDot(index) {
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  }

  function currentIndex() {
    return Math.round(track.scrollLeft / track.clientWidth);
  }

  function goTo(index) {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  }

  prevBtn.addEventListener("click", () => goTo(currentIndex() - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex() + 1));

  let scrollRaf = null;
  track.addEventListener("scroll", () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      setActiveDot(currentIndex());
      scrollRaf = null;
    });
  });

  // Mouse drag-to-swipe (touch already works natively via scroll-snap)
  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return;
    isDown = true;
    startX = e.pageX;
    startScrollLeft = track.scrollLeft;
    track.classList.add("is-dragging");
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    track.scrollLeft = startScrollLeft - (e.pageX - startX);
  });

  function endDrag() {
    if (!isDown) return;
    isDown = false;
    track.classList.remove("is-dragging");
    goTo(currentIndex());
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("pointerleave", () => {
    if (isDown) endDrag();
  });

  setActiveDot(0);
})();
