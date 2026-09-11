const data = window.CV_DATA || {};
const typewriterWords = data.typewriterWords || [
  "Digital Transformation Expert.",
  "Creative Mind.",
  "Speaker.",
];

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
};

const create = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

setText("[data-brand-initials]", data.initials);
setText("[data-brand-name]", data.name);
setText("[data-footer-name]", data.name);
setText("[data-availability]", data.availability);
setText("[data-hero-title]", data.name);
setText("[data-hero-role]", data.role);
setText("[data-hero-summary]", data.summary);
setText("[data-current-focus]", data.currentFocus);
setText("[data-location]", data.location);
setText("[data-profile-heading]", data.profileHeading);
setText("[data-profile-body]", data.profileBody);
setText("[data-work-style]", data.workStyle);
setText("[data-contact-heading]", data.contactHeading);
setText("[data-contact-copy]", data.contactCopy);

const image = document.querySelector("[data-profile-image]");
if (image && data.image) image.src = data.image;

const cvLink = document.querySelector("[data-cv-link]");
if (cvLink && data.cvDownload && data.cvDownload !== "#") {
  cvLink.href = data.cvDownload;
} else if (cvLink) {
  cvLink.removeAttribute("download");
  cvLink.href = "#kontakt";
  cvLink.textContent = "Kontakt aufnehmen";
}

const stats = document.querySelector("[data-stats]");
(data.stats || []).forEach((item) => {
  const card = create("article", "stat-card reveal");
  card.append(create("strong", "", item.value));
  card.append(create("span", "", item.label));
  stats?.append(card);
});

const experience = document.querySelector("[data-experience]");
(data.experience || []).forEach((item) => {
  const article = create("article", "timeline-item reveal");
  article.append(create("span", "period", item.period));
  const body = create("div", "timeline-body");
  body.append(create("h3", "", item.title));
  body.append(create("p", "company", item.company));
  body.append(create("p", "", item.text));

  if (item.highlights?.length) {
    const list = create("ul", "highlight-list");
    item.highlights.forEach((highlight) => list.append(create("li", "", highlight)));
    body.append(list);
  }

  article.append(body);
  experience?.append(article);
});

const skills = document.querySelector("[data-skills]");
(data.skills || []).forEach((skill) => skills?.append(create("span", "", skill)));

const projects = document.querySelector("[data-projects]");
(data.projects || []).forEach((project, index) => {
  const article = create("article", "project-card reveal");
  article.append(create("span", "project-number", String(index + 1).padStart(2, "0")));
  article.append(create("p", "project-tag", project.tag));
  article.append(create("h3", "", project.name));
  article.append(create("p", "", project.text));
  projects?.append(article);
});

const education = document.querySelector("[data-education]");
(data.education || []).forEach((item) => {
  const article = create("article", "education-item reveal");
  article.append(create("span", "period", item.period));
  const body = create("div", "");
  body.append(create("h3", "", item.title));
  body.append(create("p", "", item.institution));
  article.append(body);
  education?.append(article);
});

const contactLinks = document.querySelector("[data-contact-links]");
(data.contactLinks || []).forEach((link) => {
  const anchor = create("a", `button ${link.type === "primary" ? "primary" : "secondary"}`, link.label);
  anchor.href = link.href;
  if (link.href?.startsWith("http")) {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }
  contactLinks?.append(anchor);
});

const header = document.querySelector("[data-header]");
const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const setupI18n = () => {
  const dict = window.I18N || {};
  const root = document.documentElement;
  const STORAGE_KEY = "lang";

  const getLang = () => localStorage.getItem(STORAGE_KEY) || "en";
  const t = (lang, key) => (dict[lang] && dict[lang][key]) || (dict.en && dict.en[key]) || key;

  const apply = (lang) => {
    root.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(lang, el.getAttribute("data-i18n"));
    });
    // for the rare string that needs inline markup (e.g. a <strong>) inside
    // it - translations are all authored by us, never user input, so
    // innerHTML here carries no injection risk
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(lang, el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(lang, el.getAttribute("data-i18n-aria")));
    });
    // <meta content="..."> tags (description, og:title, og:description) -
    // meta elements have no text content model, so the content attribute
    // has to be set directly instead of textContent
    document.querySelectorAll("[data-i18n-content]").forEach((el) => {
      el.setAttribute("content", t(lang, el.getAttribute("data-i18n-content")));
    });
    // full href swap (e.g. a mailto: link whose ?subject= is language-
    // specific) - the dictionary value is the complete href, not a fragment
    document.querySelectorAll("[data-i18n-href]").forEach((el) => {
      el.setAttribute("href", t(lang, el.getAttribute("data-i18n-href")));
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      el.setAttribute("alt", t(lang, el.getAttribute("data-i18n-alt")));
    });
    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      const next = lang === "en" ? "de" : "en";
      button.textContent = next.toUpperCase();
      button.setAttribute("aria-label", t(lang, lang === "en" ? "aria.langToDe" : "aria.langToEn"));
    });
    // other UI (e.g. the theme toggle's dynamic aria-label) reacts to this
    // instead of setupI18n reaching into unrelated setup functions directly
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  };

  apply(getLang());

  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = getLang() === "en" ? "de" : "en";
      localStorage.setItem(STORAGE_KEY, next);
      apply(next);
    });
  });
};

setupI18n();

const setupThemeToggle = () => {
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  if (!buttons.length) return;

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const applyState = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const lang = localStorage.getItem("lang") || "en";
    const dict = (window.I18N && window.I18N[lang]) || {};
    buttons.forEach((button) => {
      button.classList.toggle("is-dark", isDark);
      button.setAttribute(
        "aria-label",
        isDark ? dict["aria.themeToLight"] || "Switch to light theme" : dict["aria.themeToDark"] || "Switch to dark theme",
      );
    });
  };

  applyState();
  document.addEventListener("langchange", applyState);

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

      const applyTheme = () => {
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        applyState();
      };

      if (!document.startViewTransition || reduceMotion) {
        applyTheme();
        return;
      }

      const x = event.clientX;
      const y = event.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const transition = document.startViewTransition(applyTheme);
      transition.ready.then(() => {
        root.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
          },
          {
            duration: 650,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    });
  });
};

setupThemeToggle();

const setupBentoGlow = () => {
  const cards = document.querySelectorAll(".bento-card, .content-card, .feature-card, .journey-deck-card, .cert-card, .career-body");
  if (!cards.length) return;
  if (window.matchMedia("(hover: none)").matches) return;

  // Proximity zone (px) beyond the card's own edge that still counts as
  // "near", inactive zone (0-1, share of the card's half-size) around the
  // center that stays off, and how many degrees/frame the angle eases by.
  const PROXIMITY = 64;
  const INACTIVE_ZONE = 0.01;
  const EASE = 0.15;

  const instances = Array.from(cards).map((card) => {
    const glow = document.createElement("span");
    glow.className = "bento-card-glow";
    glow.setAttribute("aria-hidden", "true");
    card.appendChild(glow);
    return { card, glow, current: 0, target: 0, active: false };
  });

  let lastX = 0;
  let lastY = 0;

  const updateInstance = (instance) => {
    const rect = instance.card.getBoundingClientRect();
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;
    const distanceFromCenter = Math.hypot(lastX - centerX, lastY - centerY);
    const inactiveRadius = 0.5 * Math.min(rect.width, rect.height) * INACTIVE_ZONE;

    if (distanceFromCenter < inactiveRadius) {
      instance.active = false;
      return;
    }

    instance.active =
      lastX > rect.left - PROXIMITY &&
      lastX < rect.left + rect.width + PROXIMITY &&
      lastY > rect.top - PROXIMITY &&
      lastY < rect.top + rect.height + PROXIMITY;

    if (!instance.active) return;

    instance.target = (180 * Math.atan2(lastY - centerY, lastX - centerX)) / Math.PI + 90;
  };

  const tick = () => {
    instances.forEach((instance) => {
      updateInstance(instance);
      instance.glow.style.setProperty("--active", instance.active ? "1" : "0");

      if (instance.active) {
        const diff = ((instance.target - instance.current + 180) % 360) - 180;
        instance.current += diff * EASE;
        instance.glow.style.setProperty("--start", String(instance.current));
      }
    });
    window.requestAnimationFrame(tick);
  };

  document.body.addEventListener(
    "pointermove",
    (event) => {
      lastX = event.clientX;
      lastY = event.clientY;
    },
    { passive: true },
  );

  window.requestAnimationFrame(tick);
};

setupBentoGlow();

// Living Bento (content-bento-grid): the coordinated 15.5s cinematic
// sequence is pure CSS (see styles.css) - one shared --bento-cycle drives
// every card's scene and its focus-ring, staggered by keyframe percentage
// so the "spotlight" moves Keynote -> Workshops -> Video -> Panels ->
// Behind-the-scenes in a fixed order. This controller only does two things:
// (1) gate playback with .is-playing via animation-play-state, which
// freezes a CSS animation exactly where it is and resumes from that same
// point - nothing to desync scrolling away and back - and (2) let
// hovering/focusing a single card replay just that card's own scene
// without touching the other four or restarting the master sequence.
const setupLivingBento = () => {
  const grid = document.querySelector(".content-bento-grid");
  if (!grid) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => grid.classList.toggle("is-playing", entry.isIntersecting));
    },
    { threshold: 0.35 },
  );
  io.observe(grid);

  const replayScene = (scene) => {
    const targets = [scene, ...scene.querySelectorAll("*")];
    targets.forEach((el) => {
      el.style.animation = "none";
    });
    // reading offsetHeight forces layout, flushing the "none" above before
    // it's cleared - otherwise the browser coalesces both writes and the
    // restart never happens
    void scene.offsetHeight;
    targets.forEach((el) => {
      el.style.animation = "";
    });
  };

  grid.querySelectorAll("[data-bento-role]").forEach((card) => {
    const scene = card.querySelector(".bento-scene");
    if (!scene) return;
    const replay = () => replayScene(scene);
    card.addEventListener("mouseenter", replay);
    card.addEventListener("focusin", replay);
  });
};

setupLivingBento();

const setupWordRotator = () => {
  const rotators = document.querySelectorAll("[data-word-rotator]");
  if (!rotators.length) return;

  const CYCLE = 2200; // ms between word swaps
  const FADE = 350; // ms, must match .next-word-display transition duration in styles.css
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  rotators.forEach((rotator) => {
    const display = rotator.querySelector("[data-word-display]");
    const sources = Array.from(rotator.querySelectorAll("[data-i18n]"));
    if (!display || sources.length < 2) return;

    let index = 0;

    // keeps the visible word in sync when the language toggle rewrites the
    // hidden source spans mid-rotation, so it never shows a stale-language word
    document.addEventListener("langchange", () => {
      display.textContent = sources[index].textContent;
    });

    if (reduceMotion) return;

    const advance = () => {
      display.classList.remove("is-visible");
      window.setTimeout(() => {
        index = (index + 1) % sources.length;
        display.textContent = sources[index].textContent;
        display.classList.remove("color-0", "color-1", "color-2");
        display.classList.add(`color-${index}`);
        void display.offsetWidth;
        display.classList.add("is-visible");
      }, FADE);
    };

    const outro = rotator.closest(".hyper-outro");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setInterval(advance, CYCLE);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(outro || rotator);
  });
};

setupWordRotator();

const typewriter = document.querySelector("#typewriter");
let typewriterIndex = 0;
let typewriterTimer;

const typeWord = () => {
  if (!typewriter || !typewriterWords.length) return;
  const letters = typewriterWords[typewriterIndex].split("");

  const loop = () => {
    if (letters.length > 0) {
      typewriter.textContent += letters.shift();
      typewriterTimer = window.setTimeout(loop, 80);
      return;
    }

    typewriterTimer = window.setTimeout(deleteWord, 2500);
  };

  loop();
};

const deleteWord = () => {
  if (!typewriter || !typewriterWords.length) return;
  const letters = typewriterWords[typewriterIndex].split("");

  const loop = () => {
    if (letters.length > 0) {
      letters.pop();
      typewriter.textContent = letters.join("");
      typewriterTimer = window.setTimeout(loop, 30);
      return;
    }

    typewriterIndex = typewriterIndex + 1 < typewriterWords.length ? typewriterIndex + 1 : 0;
    typeWord();
  };

  loop();
};

typeWord();

// scroll-driven card stack: cards pile up in order, each earlier one
// staying visible (dimmed) behind the current one. Used by both the AI
// journey section and any other .journey-stack on the page (e.g. the
// impact pillars) - each instance gets its own independent setup/state.
const setupJourneyStack = (stack) => {
  const cards = Array.from(stack.querySelectorAll(".journey-deck-card"));
  const n = cards.length;
  if (!n) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // wrap each word of the title in its own span so it can blur-reveal in,
  // staggered - only the title, so the effect stays snappy on longer text
  cards.forEach((card, i) => {
    card.style.setProperty("--stack-i", i);
    const h3 = card.querySelector("h3");
    if (!h3) return;
    const words = h3.textContent.trim().split(/\s+/);
    h3.textContent = "";
    words.forEach((word, wi) => {
      const span = document.createElement("span");
      span.className = "journey-word";
      span.textContent = word;
      span.style.animationDelay = `${wi * 45}ms`;
      h3.appendChild(span);
      if (wi < words.length - 1) h3.appendChild(document.createTextNode(" "));
    });
  });

  // each card replays its word-reveal the moment it becomes the active,
  // topmost card in the stack - remove+reflow+re-add so it retriggers
  // every time, not just the first time it scrolls into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        card.classList.remove("is-front");
        void card.offsetHeight;
        card.classList.add("is-front");
      });
    },
    { threshold: 0.6 },
  );
  cards.forEach((card) => io.observe(card));

  if (reduceMotion) return;

  // every card sticks at the same top offset (var(--stack-base) in CSS) -
  // a single shared sticky offset is far more reliable across browsers
  // than giving each sibling its own, which was found to release early.
  // The peeking stack look comes from a per-card translateY here: all
  // cards stay full-size (no scale-down, text stays readable) and simply
  // pile up, each one dimming slightly once the next card has arrived on
  // top of it - by the end all 5 are visible, just at reduced opacity
  // except the current, fully-arrived one. Tied to real geometry (each
  // card's natural height and its resting translateY offset), not a
  // global scroll fraction split evenly across cards - the cards have
  // different content lengths/heights, so an even split made shorter
  // cards get buried under the next one before it was even close, and
  // let taller cards vanish under the one after them almost instantly.
  const contents = cards.map((card) => card.querySelector(".journey-deck-content"));
  let naturalHeights = [];
  let translateOffsets = [];
  let absoluteRestTops = [];

  // one snap marker per card, positioned at its own arrival point, instead
  // of relying on scroll-snap-align/stop on the cards themselves - they're
  // position:sticky siblings that visually overlap each other throughout
  // the peek-stack transition, and Safari in particular doesn't reliably
  // stop scroll-snap-stop:always on that kind of ambiguous, overlapping
  // target - a fast scroll can blow straight through several cards at
  // once. A plain, non-overlapping marker at each card's own flow position
  // (computed from natural heights, not live sticky rects - unreliable on
  // an actively-stuck sticky element, the same lesson learned elsewhere in
  // this stack) gives the browser something unambiguous to land on.
  const markers = cards.map(() => {
    const marker = document.createElement("span");
    marker.setAttribute("aria-hidden", "true");
    // scroll-snap-stop:normal (not always) - "always" forces a hard full
    // stop at every single marker regardless of scroll speed, which reads
    // as mechanical/abrupt; "normal" lets a fast gesture glide across
    // several cards and only snaps once the scroll is actually slowing
    // down near one, feeling considerably smoother while still landing
    // cleanly once the user stops
    marker.style.cssText = "position:absolute; left:0; width:1px; height:1px; scroll-snap-align:start; scroll-snap-stop:normal;";
    stack.appendChild(marker);
    return marker;
  });

  const measure = () => {
    const stackStyle = getComputedStyle(stack);
    const stackBase = parseFloat(stackStyle.getPropertyValue("--stack-base")) || 84;
    const stackStep = parseFloat(stackStyle.getPropertyValue("--stack-step")) || 104;
    naturalHeights = cards.map((card) => card.offsetHeight);
    translateOffsets = cards.map((_, i) => i * stackStep);
    absoluteRestTops = cards.map((_, i) => stackBase + i * stackStep);

    const cardMarginTop = n > 1 ? parseFloat(getComputedStyle(cards[1]).marginTop) || 0 : 0;
    let flowTop = 0;
    cards.forEach((card, i) => {
      markers[i].style.top = `${Math.max(0, flowTop - stackBase)}px`;
      flowTop += naturalHeights[i] + cardMarginTop;
    });
  };
  measure();

  let ticking = false;

  // opacity a covered card settles at once the next one has fully arrived
  // on top of it - dim, but still clearly readable, never disappears
  const COVERED_OPACITY = 0.55;

  const coverProgress = (i) => {
    const next = cards[i + 1];
    if (!next) return 0;
    const touchStart = absoluteRestTops[i] + naturalHeights[i];
    const restNext = absoluteRestTops[i + 1];
    const liveNextTop = next.getBoundingClientRect().top;
    const span = touchStart - restNext;
    return span > 0 ? Math.min(1, Math.max(0, (touchStart - liveNextTop) / span)) : 0;
  };

  // Chrome releases several simultaneous position:sticky siblings sharing
  // one containing block at slightly different scroll points instead of
  // together - an earlier card can let go before a later one, briefly
  // uncovering whatever was stacked behind it. Once the last card (the one
  // genuinely driving the stuck/release lifecycle) is observed starting to
  // release, every card switches from sticky to static-in-flow in the same
  // frame, with a compensating translateY so nothing jumps - from then on
  // they're plain document flow and scroll away together as one rigid
  // unit, which is inherently impossible to desync.
  let released = false;
  let releaseScrollY = null;

  const triggerRelease = () => {
    if (released) return;
    released = true;
    releaseScrollY = window.scrollY;
    // target every card against the last card's actual current position
    // (not its idealized rest spot) - by the time this fires, a scroll
    // event or two may already have carried it a few px past the trigger
    // threshold, and targeting the idealized rest position rather than
    // where it truly is right now left a small but visible hop
    const stackStepPx = translateOffsets[1] - translateOffsets[0];
    const referenceTop = cards[n - 1].getBoundingClientRect().top;
    cards.forEach((card, i) => {
      const target = referenceTop - (n - 1 - i) * stackStepPx;
      // measure this card's real plain-flow position directly, right after
      // switching it, instead of predicting it - switching an earlier
      // sibling to position:static shifts how later ones in the same loop
      // actually lay out, in a way a pre-computed prediction didn't catch
      card.style.transform = "none";
      card.style.position = "static";
      const actualTop = card.getBoundingClientRect().top;
      card.style.transform = `translateY(${target - actualTop}px)`;
    });
  };

  // scrolling back up past the point where release happened needs to hand
  // control back to the normal sticky/peek logic, or the cards just sit
  // there static (scrolled away, off-screen) instead of re-stacking
  const resetRelease = () => {
    released = false;
    releaseScrollY = null;
    cards.forEach((card) => {
      card.style.position = "";
      card.style.transform = "";
    });
  };

  const update = () => {
    ticking = false;

    if (released) {
      // generous hysteresis - mandatory scroll-snap (especially Safari)
      // corrects programmatic/settling scroll positions by a lot more
      // than a few px, and a tight threshold here was re-triggering
      // release/reset on every little snap correction
      if (window.scrollY < releaseScrollY - 150) {
        resetRelease();
      } else {
        return;
      }
    }

    if (cards[n - 1].getBoundingClientRect().top < absoluteRestTops[n - 1] - 1) {
      triggerRelease();
      return;
    }

    cards.forEach((card, i) => {
      const hasNext = i + 1 < n;
      const t = hasNext ? coverProgress(i) : 0;
      const opacity = hasNext ? 1 - t * (1 - COVERED_OPACITY) : 1;
      card.style.transform = `translateY(${translateOffsets[i]}px)`;
      contents[i].style.opacity = hasNext ? opacity.toFixed(3) : "";
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  const onResize = () => {
    resetRelease();
    measure();
    update();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  update();
};

document.querySelectorAll(".journey-stack").forEach(setupJourneyStack);

// quiet step-rail alongside the AI-journey stack: a small sticky dot-and-
// line indicator so it's always obvious which of the 5 steps is currently
// active. Entirely independent of setupJourneyStack above (own, separate
// IntersectionObserver, same 0.6 threshold as its "is-front" trigger so
// the two stay in sync) - purely a readout, never touches the peeking-
// stack mechanics.
const setupJourneyRail = (stack) => {
  const body = stack.closest(".journey-body");
  const rail = body ? body.querySelector(".journey-rail") : null;
  const cards = Array.from(stack.querySelectorAll(".journey-deck-card"));
  const dots = rail ? Array.from(rail.querySelectorAll(".journey-rail-dot")) : [];
  if (!rail || !dots.length || !cards.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = cards.indexOf(entry.target);
        if (index === -1) return;
        dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
      });
    },
    { threshold: 0.6 },
  );
  cards.forEach((card) => io.observe(card));
};

document.querySelectorAll(".journey-stack").forEach(setupJourneyRail);

// each employer card in the career timeline is a normal, non-overlapping
// block (unlike the AI-journey stack's peeking cards) - a single scroll
// gesture with typical momentum can carry straight past several of them
// at once, landing at the very bottom of the section, since there's
// nothing for mandatory scroll-snap to catch in between the section's own
// start and whatever comes after it. One marker per employer card gives
// it real places to land - same fix as the AI-journey stack and
// feature-carousel elsewhere in this file.
const setupCareerSnap = (timeline) => {
  const items = Array.from(timeline.querySelectorAll(".career-item"));
  if (items.length < 2) return;

  const markers = items.map(() => {
    const marker = document.createElement("span");
    marker.setAttribute("aria-hidden", "true");
    marker.style.cssText =
      "position:absolute; left:0; width:1px; height:1px; scroll-snap-align:start; scroll-snap-stop:always;";
    timeline.appendChild(marker);
    return marker;
  });

  const measure = () => {
    items.forEach((item, i) => {
      markers[i].style.top = `${item.offsetTop}px`;
    });
  };
  measure();
  window.addEventListener("resize", measure);
};

document.querySelectorAll(".career-timeline").forEach(setupCareerSnap);

// feature-carousel (impact pillars): plain horizontally-scrollable row,
// same .content-carousel-track drag/swipe/wheel behavior as any other
// carousel on the site - no vertical scroll-jacking. Apple product-page
// style: quiet prev/next arrows flank the dots below the row, or just
// swipe/drag the row directly, or click a dot to jump straight to it.
// Each dot fills in as a progress bar over its card's on-screen dwell,
// then the carousel advances itself.
const setupFeatureCarousel = (carousel) => {
  const group = carousel.closest(".feature-pin-group");
  const track = carousel.querySelector("[data-carousel-track]");
  const prevBtn = group ? group.querySelector("[data-carousel-prev]") : null;
  const nextBtn = group ? group.querySelector("[data-carousel-next]") : null;
  const pauseBtn = group ? group.querySelector("[data-carousel-pause]") : null;
  const pauseIcon = pauseBtn ? pauseBtn.querySelector("[data-pause-icon]") : null;
  const swipeHint = carousel.querySelector("[data-swipe-hint]");
  if (!group || !track) return;

  const progressDots = Array.from(group.querySelectorAll(".feature-progress-dot"));
  const cards = Array.from(track.children);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AUTOPLAY_MS = 10000;
  progressDots.forEach((dot) => dot.style.setProperty("--dot-fill-duration", `${AUTOPLAY_MS}ms`));

  // belt-and-braces: force the true, flush 0 rest position on load. The
  // track's own negative-margin/padding bleed (see .content-carousel-
  // track) is supposed to naturally rest exactly there, but browser
  // scroll-anchoring or bfcache restore can nudge it a little off that
  // before this even runs, which - since nothing else visibly marks
  // where "flush" is - reads as the first card missing a sliver off its
  // left edge.
  track.scrollLeft = 0;

  const dismissSwipeHint = () => swipeHint && swipeHint.classList.add("is-dismissed");
  if (swipeHint) {
    // any real, user-initiated gesture on the row - not the programmatic
    // scrollIntoView a dot click or autoplay itself triggers - dismisses
    // the hint for good, same session.
    track.addEventListener("pointerdown", dismissSwipeHint, { once: true });
    track.addEventListener("wheel", dismissSwipeHint, { once: true, passive: true });
  }

  const closestIndex = () => {
    // the last card can't scroll flush with the track's own left edge -
    // there's no more room after it - so it can only ever get partway
    // there and would lose the proximity check below to whichever card
    // is currently closest, never registering as "active" itself. Maxed-
    // out scroll unambiguously means the last card either way.
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 2) return cards.length - 1;
    const trackLeft = track.getBoundingClientRect().left;
    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  };

  const goTo = (index) => {
    const clamped = Math.max(0, Math.min(cards.length - 1, index));
    // scrollIntoView (even with block:"nearest") still scrolls the page
    // vertically whenever the card isn't already fully in view - which
    // it usually isn't once someone's scrolled on past Skills, so
    // autoplay firing later would yank the whole page back up to it.
    // Scrolling the track's own scrollLeft only moves the row
    // horizontally, never the page.
    track.scrollTo({ left: cards[clamped].offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
  };

  progressDots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      dismissSwipeHint();
      goTo(i);
    }),
  );
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      dismissSwipeHint();
      goTo(closestIndex() - 1);
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      dismissSwipeHint();
      goTo(closestIndex() + 1);
    });

  // Apple-product-page style: each card gets its own dwell (the active
  // dot's fill sweeping across it) before the carousel moves on by
  // itself, looping back to the first once it's through the last.
  // Pausing on hover/focus - and never starting at all under prefers-
  // reduced-motion - means it never fights someone actually reading a
  // card or clicking a dot by hand.
  let autoplayTimer = null;

  const scheduleAutoplay = () => {
    if (reduceMotion) return;
    clearTimeout(autoplayTimer);
    autoplayTimer = setTimeout(() => goTo((closestIndex() + 1) % cards.length), AUTOPLAY_MS);
  };

  let lastIndex = -1;

  const update = () => {
    const index = closestIndex();
    progressDots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= cards.length - 1;
    carousel.classList.toggle("is-at-end", index >= cards.length - 1);
    if (index !== lastIndex) {
      lastIndex = index;
      // restart the fill from 0 on the new active dot - remove/reflow/
      // re-add rather than just re-adding, since the class may already
      // be present (e.g. looping back to dot 0) and re-adding an
      // already-present class doesn't retrigger its animation.
      progressDots.forEach((dot) => dot.classList.remove("is-filling"));
      if (!reduceMotion) {
        const activeDot = progressDots[index];
        if (activeDot) {
          void activeDot.offsetWidth;
          activeDot.classList.add("is-filling");
        }
      }
      scheduleAutoplay();
    }
  };

  let ticking = false;
  track.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    },
    { passive: true },
  );

  if (!reduceMotion) {
    // hovering/focusing pauses same as before - but that's a temporary,
    // "I'm looking at it right now" pause that should let go the moment
    // the pointer leaves. The pause button is a deliberate, sticky
    // pause instead: once clicked, hovering off shouldn't quietly
    // restart it behind the visitor's back.
    let manuallyPaused = false;

    const pause = () => {
      clearTimeout(autoplayTimer);
      const activeDot = progressDots[lastIndex];
      if (activeDot) activeDot.style.animationPlayState = "paused";
    };
    const resume = () => {
      if (manuallyPaused) return;
      const activeDot = progressDots[lastIndex];
      if (activeDot) activeDot.style.animationPlayState = "running";
      scheduleAutoplay();
    };
    carousel.addEventListener("mouseenter", pause);
    carousel.addEventListener("mouseleave", resume);
    carousel.addEventListener("focusin", pause);
    carousel.addEventListener("focusout", resume);

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        manuallyPaused = !manuallyPaused;
        if (manuallyPaused) {
          pause();
        } else {
          resume();
        }
        pauseBtn.classList.toggle("is-paused", manuallyPaused);
        const key = manuallyPaused ? "aria.carouselPlay" : "aria.carouselPause";
        pauseBtn.setAttribute("data-i18n-aria", key);
        const lang = localStorage.getItem("lang") || "en";
        const dict = window.I18N || {};
        pauseBtn.setAttribute("aria-label", (dict[lang] && dict[lang][key]) || (dict.en && dict.en[key]) || key);
        if (pauseIcon) pauseIcon.textContent = manuallyPaused ? "play_arrow" : "pause";
      });
    }
  }

  window.addEventListener("resize", update);
  update();
};

document.querySelectorAll(".feature-carousel").forEach(setupFeatureCarousel);

const setupMobileNav = () => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-mobile-nav]");
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    panel.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  };

  toggle.addEventListener("click", () => {
    setOpen(!panel.classList.contains("is-open"));
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
};

setupMobileNav();

// jumping straight to a section several sections away (e.g. clicking
// "Certifications" from the top) can get trapped mid-flight: the AI-journey
// stack owns several of its own mandatory scroll-snap points (see
// setupJourneyStack), and the page's own scroll-snap-type:y mandatory
// resolves the animated jump to the nearest of THOSE instead of carrying it
// through to the actual target. Disabling snap for the duration of a
// JS-driven jump sidesteps that entirely; also covers cross-page arrivals
// (e.g. contact.html -> /#skills), whose native browser jump is instant and
// happens before any of this runs, so it gets redone here with snap off.
// while a click-triggered jump is animating, the scrollspy in setupNavPill()
// would otherwise recompute "current section" from every intermediate
// scroll position along the way, visibly chasing the pill through whatever
// sections it passes over before settling on the actual target. Flagging
// the jump as in-progress lets that scroll listener skip its own recompute
// for the duration - the pill already jumped straight to the clicked link.
let navJumpActive = false;

// a not-yet-revealed .reveal/.reveal-fly/.reveal-opener still has its
// pre-visible transform applied (e.g. translateY+scale) until the
// IntersectionObserver below fires and its ~1s transition plays out. Any
// position:sticky descendant (like .career-period / .experience-intro in
// the Experience section) gets visually dragged along with that transform
// for the whole transition - on a normal scroll-into-view the reveal has
// long since finished by the time you'd notice, but a click-jump can land
// you there while it's still mid-animation, showing as the sticky element
// "settling into place" instead of already being pinned. Skipping straight
// to the finished state for whatever's inside the jump target avoids that.
const completeRevealsIn = (container) => {
  const targets = container.matches(".reveal, .reveal-fly, .reveal-opener")
    ? [container, ...container.querySelectorAll(".reveal, .reveal-fly, .reveal-opener")]
    : Array.from(container.querySelectorAll(".reveal, .reveal-fly, .reveal-opener"));
  if (!targets.length) return;
  // nested pieces (.opener-copy, .opener-slide, staggered delay-N children)
  // have their own transition-delay keyed off the root's class change, so
  // skipping only the root's own transition still leaves those playing out
  // on their normal schedule - disable transitions on every descendant too
  const allNodes = [container, ...container.querySelectorAll("*")];
  allNodes.forEach((el) => {
    el.style.transition = "none";
  });
  targets.forEach((el) => el.classList.add("is-visible", "active"));
  void container.offsetHeight;
  allNodes.forEach((el) => {
    el.style.transition = "";
  });
};

const jumpToSection = (id, { instant = false } = {}) => {
  const target = document.getElementById(id);
  if (!target) return false;

  completeRevealsIn(target);

  const root = document.documentElement;
  let restored = false;
  navJumpActive = true;
  const restore = () => {
    if (restored) return;
    restored = true;
    navJumpActive = false;
    root.style.scrollSnapType = "";
  };

  root.style.scrollSnapType = "none";
  target.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });

  // re-enabling snap on the browser's own "scrollend" event sounds right but
  // fires early/inconsistently across engines mid-animation, letting
  // mandatory snap grab the still-moving scroll and yank it toward a nearby
  // point before the real target - visible as a brief snap-back. Polling for
  // several consecutive stationary frames instead only restores once the
  // scroll has actually, truly stopped, regardless of how any given browser
  // times its own scrollend firing.
  let lastY = window.scrollY;
  let stableFrames = 0;
  const REQUIRED_STABLE_FRAMES = 6;
  const poll = () => {
    if (restored) return;
    const y = window.scrollY;
    if (Math.abs(y - lastY) < 0.5) {
      stableFrames += 1;
    } else {
      stableFrames = 0;
      lastY = y;
    }
    if (stableFrames >= REQUIRED_STABLE_FRAMES) {
      restore();
      return;
    }
    requestAnimationFrame(poll);
  };
  requestAnimationFrame(poll);
  setTimeout(restore, instant ? 200 : 3000);
  return true;
};

document.querySelectorAll(".nav a, .mobile-nav a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const url = new URL(link.href, window.location.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;
    if (jumpToSection(url.hash.slice(1))) {
      event.preventDefault();
      history.pushState(null, "", url.hash);
    }
  });
});

if (window.location.hash) {
  requestAnimationFrame(() => jumpToSection(window.location.hash.slice(1), { instant: true }));
}

const setupNavPill = () => {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll("a"));
  if (!links.length) return;

  const pill = document.createElement("span");
  pill.className = "nav-pill";
  pill.setAttribute("aria-hidden", "true");
  nav.prepend(pill);

  // only links whose hash resolves to a section on THIS page take part in
  // scroll-tracking - on contact.html/disclaimer.html none of the
  // #skills-style hashes point at anything, so those pages fall back to
  // whichever link already carries aria-current="page"
  const scrollLinks = links
    .map((link) => {
      const hash = link.getAttribute("href").split("#")[1];
      const section = hash ? document.getElementById(hash) : null;
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  let activeLink = links.find((link) => link.hasAttribute("aria-current")) || null;

  const movePill = (link) => {
    if (!link) {
      pill.classList.remove("is-visible");
      return;
    }
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
    pill.style.width = `${link.offsetWidth}px`;
    pill.classList.add("is-visible");
  };

  const setActive = (link) => {
    if (link === activeLink) return;
    if (activeLink) activeLink.classList.remove("is-active");
    activeLink = link;
    if (link) link.classList.add("is-active");
    movePill(link);
  };

  if (activeLink) {
    activeLink.classList.add("is-active");
    requestAnimationFrame(() => movePill(activeLink));
  }

  if (scrollLinks.length) {
    // roughly the header height plus a little breathing room, same offset
    // convention used elsewhere in this file for section-based detection.
    // +4px tolerance: scrollIntoView's own scroll-padding-top math can land
    // a section's top a fraction of a px above the exact offset, which
    // would otherwise miss a strict <= comparison and leave the previous
    // section marked active after a nav click landed correctly.
    const HEADER_OFFSET = 104;

    let ticking = false;
    const update = () => {
      ticking = false;
      if (navJumpActive) return;
      let current = null;
      scrollLinks.forEach(({ link, section }) => {
        if (section.getBoundingClientRect().top <= HEADER_OFFSET) current = link;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const hash = link.getAttribute("href").split("#")[1];
      const section = hash ? document.getElementById(hash) : null;
      if (section) setActive(link);
    });
  });

  window.addEventListener("resize", () => movePill(activeLink));
};

setupNavPill();

const setupHeroScrollStory = () => {
  const hero = document.querySelector(".hero-editorial-compare");
  if (!hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const portrait = hero.querySelector(".editorial-portrait-wrap");
  const talk = hero.querySelector(".editorial-talk-line");
  const front = hero.querySelector(".editorial-frontline");
  const cloud = hero.querySelector(".editorial-role-cloud");
  if (!portrait || !talk || !front) return;

  const stage = hero.querySelector(".editorial-stage");

  let ticking = false;
  const update = () => {
    // tie the runway to the fixed-ratio stage, not the (viewport-tall) hero,
    // so the effect is equally visible on large displays
    const runway = (stage ? stage.offsetHeight : hero.offsetHeight) * 0.7 || 1;
    const raw = Math.min(1, Math.max(0, window.scrollY / runway));
    const p = raw * (2 - raw); // ease-out

    // each layer also rides up at its own vertical rate on top of its
    // existing scale - background (cloud) barely moves, foreground
    // (portrait) moves the most, same depth-cue logic as a parallax
    // layer stack, just folded into the transforms already here instead
    // of a second, competing scroll handler.
    portrait.style.transform = `translateX(50%) scale(${1 + p * 0.14}) translateY(${-p * 85}px)`;
    talk.style.transform = `translate(-50%, -6%) translateY(${-p * 60}px)`;
    // don't set talk's opacity directly - it would stomp the hero-sequence's
    // own opacity (hidden until typed), which uses a CSS custom property instead
    // so this scroll fade only ever multiplies an already-visible line, never
    // forces one on early
    talk.style.setProperty("--scroll-fade", String(1 - p * 0.85));
    front.style.transform = `translateY(${-p * 46}px)`;
    front.style.opacity = String(1 - p);
    if (cloud) {
      cloud.style.transform = `translateY(${-p * 28}px)`;
      cloud.style.opacity = String(1 - p * 1.5);
    }
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
};

setupHeroScrollStory();

const setupHeroSequence = () => {
  const wrap = document.querySelector(".editorial-portrait-wrap");
  const img = document.querySelector(".editorial-portrait");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // portrait now reveals last, after the text has typed in - hide it
  // immediately (before first paint) so it doesn't flash fully visible
  // during that wait. Skipped under reduced motion, since revealPortrait()
  // never runs there to bring it back.
  if (img && !reduceMotion) img.style.opacity = "0";

  // portrait reveals with a plain fade-in - the background role-word cloud
  // and the periodic glitch patches both wait until the portrait has
  // settled before starting.
  const start = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        img.style.opacity = "1";
      });
    });
    window.setTimeout(() => {
      startGlitchLoop();
      startRoleWordSequence();
    }, 4000);
  };

  // Every so often, once the portrait has settled, briefly "glitch out" one
  // small random patch of it - like a tile failed to load - then resolve it
  // back. Only ever one small spot at a time, well within the un-faded top
  // 70% of the image so it never fights the bottom mask fade.
  const startGlitchLoop = () => {
    const MIN_INTERVAL = 2200;
    const MAX_INTERVAL = 5500;

    const spawnGlitch = () => {
      const patch = document.createElement("div");
      patch.className = "portrait-glitch";
      const width = 10 + Math.random() * 12; // %
      const height = 8 + Math.random() * 10; // %
      patch.style.width = `${width}%`;
      patch.style.height = `${height}%`;
      patch.style.left = `${Math.random() * (100 - width)}%`;
      patch.style.top = `${Math.random() * (68 - height)}%`;
      wrap.appendChild(patch);

      // abrupt on/off/on flicker instead of a smooth fade - reads more like
      // a glitch than a gentle reveal
      const blink = (on, delay) =>
        window.setTimeout(() => patch.classList.toggle("is-visible", on), delay);

      blink(true, 0);
      blink(false, 90);
      blink(true, 160);
      blink(false, 260 + Math.random() * 200);

      window.setTimeout(() => patch.remove(), 700);
    };

    const scheduleNext = () => {
      window.setTimeout(() => {
        if (document.visibilityState === "visible") spawnGlitch();
        scheduleNext();
      }, MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL));
    };

    scheduleNext();
  };

  // "Let's talk digital" types in once, then - after a pause - the
  // background role words start their rotation. Runs once the portrait has
  // settled (or immediately if there's no portrait to wait for).
  const typeDigitalWord = (onDone) => {
    const line = document.querySelector(".editorial-talk-line");
    const word = document.querySelector(".hero-typed-word");
    if (!word) {
      onDone();
      return;
    }
    const CHAR_DURATION = 110; // ms per char
    const text = word.textContent;
    word.textContent = "";
    if (line) line.classList.add("is-active");
    let i = 0;
    const id = window.setInterval(() => {
      if (i < text.length) {
        word.textContent = text.substring(0, i + 1);
        i += 1;
      } else {
        window.clearInterval(id);
        onDone();
      }
    }, CHAR_DURATION);
  };

  // Background role words, one at a time: type in, hold, delete, then the
  // next word in the list starts - never more than one visible at once.
  const startRoleWordSequence = () => {
    const words = Array.from(document.querySelectorAll(".editorial-role-word"));
    if (!words.length) return;

    const CHAR_DURATION = 120; // ms per char, typing
    const DELETE_DURATION = 60; // ms per char, deleting
    const HOLD_DURATION = 1400; // ms, word stays fully typed before deleting
    const REST_DURATION = 450; // ms, pause before the next word starts

    const texts = words.map((word) => word.textContent);
    words.forEach((word) => {
      word.textContent = "";
    });

    // shuffled draw order, reshuffled once exhausted - true random() each
    // turn would happily repeat the same word/position back to back (and
    // in practice reads as "not very random" since a handful of positions
    // dominate); a shuffled bag guarantees every word gets its turn before
    // any repeats, while still never landing on the same left-right-left
    // pattern twice.
    let bag = [];
    let lastIndex = -1;

    const drawNext = () => {
      if (bag.length === 0) {
        bag = words.map((_, i) => i);
        for (let i = bag.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [bag[i], bag[j]] = [bag[j], bag[i]];
        }
        if (bag.length > 1 && bag[0] === lastIndex) {
          [bag[0], bag[1]] = [bag[1], bag[0]];
        }
      }
      lastIndex = bag.shift();
      return lastIndex;
    };

    const runNext = () => {
      const index = drawNext();
      const word = words[index];
      const text = texts[index];
      word.classList.add("is-active");
      let i = 0;
      const typeId = window.setInterval(() => {
        if (i < text.length) {
          word.textContent = text.substring(0, i + 1);
          i += 1;
        } else {
          window.clearInterval(typeId);
          window.setTimeout(() => {
            let j = text.length;
            const deleteId = window.setInterval(() => {
              if (j > 0) {
                j -= 1;
                word.textContent = text.substring(0, j);
              } else {
                window.clearInterval(deleteId);
                word.classList.remove("is-active");
                window.setTimeout(runNext, REST_DURATION);
              }
            }, DELETE_DURATION);
          }, HOLD_DURATION);
        }
      }, CHAR_DURATION);
    };

    runNext();
  };

  const revealPortrait = () => {
    if (!wrap || !img) {
      // nothing to wait on - let the role-word cloud start right away
      startRoleWordSequence();
      return;
    }
    if (img.complete && img.naturalWidth) {
      start();
    } else {
      img.addEventListener("load", start, { once: true });
    }
  };

  // "Moin, my name is Max." lights up word by word - each word sits as a
  // dim "ghost" copy (set once, always visible, so the line never jumps)
  // with a full-color copy fading in on top, staggered left to right.
  const revealFrontline = () => {
    const frontline = document.querySelector(".editorial-frontline");
    if (!frontline) return 0;

    const STAGGER = 220; // ms between each word's start
    const FADE = 700; // ms, must match .reveal-word-lit's transition duration in styles.css

    const words = [
      { text: "Moin," },
      { text: "my" },
      { text: "name" },
      { text: "is" },
      { text: "Max", className: "editorial-name-script" },
      { text: ".", noSpace: true },
    ];

    frontline.textContent = "";
    const litEls = [];
    words.forEach((word, i) => {
      if (i > 0 && !word.noSpace) frontline.appendChild(document.createTextNode(" "));
      const wrap = document.createElement("span");
      wrap.className = word.className ? `reveal-word-wrap ${word.className}` : "reveal-word-wrap";
      const ghost = document.createElement("span");
      ghost.className = "reveal-word-ghost";
      ghost.textContent = word.text;
      const lit = document.createElement("span");
      lit.className = "reveal-word-lit";
      lit.textContent = word.text;
      wrap.append(ghost, lit);
      frontline.appendChild(wrap);
      litEls.push(lit);
    });

    litEls.forEach((el, i) => {
      el.style.transitionDelay = `${i * STAGGER}ms`;
    });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        litEls.forEach((el) => el.classList.add("is-revealed"));
      });
    });

    return (litEls.length - 1) * STAGGER + FADE;
  };

  if (reduceMotion) return; // static HTML text stands, nothing animates

  // entrance order: "Moin, my name is Max." reveals first, then "Let's talk
  // digital" types in once that's settled, then the portrait fades in, and
  // only once that's settled does the background role-word cloud start
  const frontlineDuration = revealFrontline();

  window.setTimeout(() => {
    typeDigitalWord(() => {
      window.setTimeout(() => {
        revealPortrait();
      }, 1400);
    });
  }, frontlineDuration + 150);
};

setupHeroSequence();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05, rootMargin: "0px 0px 12% 0px" }
);

document.querySelectorAll(".reveal, .reveal-fly, .reveal-opener").forEach((element) => observer.observe(element));
