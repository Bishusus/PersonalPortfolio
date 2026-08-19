/* ============================================================
   BISHESH PRADHANANGA — ADVANCED INTERACTIVE PORTFOLIO JS
   Features:
   1. Web Audio API Sound FX Synthesizer (procedural soft blips)
   2. Real Interactive CLI Command Terminal (help, skills, projects...)
   3. Live Accent Theme Picker (Orange, Cyan, Purple, Mint)
   4. Interactive Project Overview Glassmorphic Modal Popup
   5. Skill Progress Bar Animations with Intersection Observer
   6. Confetti Explosion Blast on Form Submit
   7. Typewriter Hero Headline Loop
   8. 3D Perspective Tilt on Project Cards
   9. Magnetic Button Effect with Advanced Physics
   10. Interactive Particle Canvas with Mouse Physics
   11. Custom Dual Ring Cursor with Smooth Tracking
   12. Scroll Progress Bar & Smooth Scroll
   13. Advanced Theme Persistence (LocalStorage)
   14. Performance Optimizations (Debouncing, Throttling, RAF)
   15. Lazy Loading & Intersection Observer API
   16. Advanced CSS Filters & Transforms
   17. Staggered Animation Effects
   18. Request Animation Frame Loop Optimization
   ============================================================ */

/* UTILITY: Debounce & Throttle Functions */
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* UTILITY: Smooth Easing Functions */
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* UTILITY: LocalStorage Preference Manager */
const PreferenceManager = {
  set: (key, value) =>
    localStorage.setItem(`bp-portfolio-${key}`, JSON.stringify(value)),
  get: (key, defaultValue) => {
    const stored = localStorage.getItem(`bp-portfolio-${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  },
  remove: (key) => localStorage.removeItem(`bp-portfolio-${key}`),
};

document.addEventListener("DOMContentLoaded", () => {
  /* ─── 1. WEB AUDIO API SYNTHESIZER (NO EXTERNAL AUDIO FILES) ──── */
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSound(type = "click") {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const now = audioCtx.currentTime;

      if (type === "click") {
        // Cartoon Bubble Pop / "Plop!"
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "hover") {
        // Cartoon Whistle Slide
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === "funnySubmit" || type === "success") {
        // 1. Hilarious Cartoon Spring "BOING!" Sound
        const boingOsc = audioCtx.createOscillator();
        const boingGain = audioCtx.createGain();
        boingOsc.connect(boingGain);
        boingGain.connect(audioCtx.destination);
        boingOsc.type = "sawtooth";
        boingOsc.frequency.setValueAtTime(150, now);
        boingOsc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
        boingOsc.frequency.exponentialRampToValueAtTime(300, now + 0.25);
        boingGain.gain.setValueAtTime(0.25, now);
        boingGain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        boingOsc.start(now);
        boingOsc.stop(now + 0.28);

        // 2. Hilarious 8-Bit Arcade Fanfare Melody
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "square";
          const startTime = now + 0.2 + idx * 0.07;
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.1, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);
          osc.start(startTime);
          osc.stop(startTime + 0.07);
        });
      }
    } catch (e) {
      // Audio API fallback
    }
  }

  // Sound toggle button
  const soundToggleBtn = document.getElementById("soundToggle");
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      const statusSpan = soundToggleBtn.querySelector(".sound-status");
      if (soundEnabled) {
        statusSpan.textContent = "Sound ON";
        soundToggleBtn.style.opacity = "1";
        playSound("success");
      } else {
        statusSpan.textContent = "Sound OFF";
        soundToggleBtn.style.opacity = "0.6";
      }
    });
  }

  /* ─── 2. LIVE ACCENT THEME PALETTE SWITCHER WITH PERSISTENCE ───────────────── */
  const themeDots = document.querySelectorAll(".theme-dot");
  const THEMES = {
    orange: {
      orange: "#ea580c",
      gold: "#d97706",
      pink: "#db2777",
      border: "rgba(234,88,12,0.3)",
    },
    cyan: {
      orange: "#0284c7",
      gold: "#0369a1",
      pink: "#06b6d4",
      border: "rgba(2,132,199,0.3)",
    },
    purple: {
      orange: "#7c3aed",
      gold: "#9333ea",
      pink: "#c084fc",
      border: "rgba(124,58,237,0.3)",
    },
    mint: {
      orange: "#059669",
      gold: "#047857",
      pink: "#10b981",
      border: "rgba(5,150,105,0.3)",
    },
  };

  // Load saved theme preference
  const savedTheme = PreferenceManager.get("theme", "orange");
  const applyTheme = (themeKey) => {
    const theme = THEMES[themeKey] || THEMES.orange;
    document.documentElement.style.setProperty("--accent-orange", theme.orange);
    document.documentElement.style.setProperty("--accent-gold", theme.gold);
    document.documentElement.style.setProperty("--accent-pink", theme.pink);
    document.documentElement.style.setProperty("--border-glow", theme.border);
    document
      .querySelectorAll(".theme-dot")
      .forEach((d) => d.classList.remove("active"));
    document
      .querySelector(`[data-accent="${themeKey}"]`)
      ?.classList.add("active");
  };

  applyTheme(savedTheme);

  themeDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      playSound("click");
      const themeKey = dot.getAttribute("data-accent");
      PreferenceManager.set("theme", themeKey);
      applyTheme(themeKey);
    });
  });

  /* ─── 3. REAL INTERACTIVE TERMINAL CLI ────────────────────── */
  const cliInput = document.getElementById("terminalCliInput");
  const cliOutput = document.getElementById("cliOutput");

  if (cliInput && cliOutput) {
    const COMMANDS = {
      help: "Available commands:\n  help      - List all commands\n  whoami    - About Bishesh\n  skills    - View technical stack\n  projects  - List featured projects\n  contact   - Get contact email\n  time      - Display local Kathmandu time\n  clear     - Clear terminal screen\n  quote     - Get developer motivation quote",
      whoami:
        "Bishesh Pradhananga | Full-Stack Engineer & Systems Programmer\nPassionate about high-efficiency web architecture, data structures & clean algorithms.",
      skills:
        "Frontend:  HTML5, CSS3, Flexbox/Grid, JavaScript (ES6+)\nBackend:   Python, Flask, Java, C++, SQLite\nCore CS:   Prefix Trees (Tries), Huffman Coding, Data Integrity",
      projects:
        "1. Fund Donation Website (Flask + SQLite + HTML5/CSS3)\n2. Huffman Compression Engine (Lossless Encoding)\n3. Trie Auto-Complete Data Structure (O(L) Prefix Lookup)\n4. Developer Analytics Dashboard (JavaScript + REST APIs)\n5. TaskFlow Collaboration App (Flask + JavaScript)\n6. Graph Route Optimizer (Java + Dijkstra)",
      contact:
        "Direct Email: bishesh.pradhananga@example.com\nLocation: Kathmandu, Nepal (Remote Available)",
      quote:
        '"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra',
      time: () =>
        `Current Time: ${new Date().toLocaleTimeString()} (Kathmandu, Nepal +05:45)`,
    };

    cliInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        playSound("click");
        const query = cliInput.value.trim().toLowerCase();
        cliInput.value = "";

        if (!query) return;

        cliOutput.style.display = "block";

        if (query === "clear") {
          cliOutput.textContent = "";
          cliOutput.style.display = "none";
          return;
        }

        let response = COMMANDS[query];
        if (typeof response === "function") response = response();
        if (!response)
          response = `Command not recognized: '${query}'. Type 'help' for available commands.`;

        cliOutput.textContent += `\n> ${query}\n${response}\n`;
        cliOutput.scrollTop = cliOutput.scrollHeight;
      }
    });
  }

  /* ─── 4. PROJECT OVERVIEW GLASSMORPHIC MODAL ──────────────── */
  const projectModal = document.getElementById("projectModal");
  const modalBody = document.getElementById("modalBody");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalBackdrop = document.getElementById("modalBackdrop");

  const PROJECT_DETAILS = {
    1: {
      title: "Fund Donation Website",
      category: "Full-Stack Web Application",
      desc: "An online fundraising and donation platform built with Flask, SQLite, and modern responsive frontend views.",
      highlights: [
        "Architecture: Flask REST API backend + SQLite database",
        "Features: Custom donation workflows, transactional records, category tagging",
        "Security: Prepared SQL queries preventing injection, input validation",
        "Performance: Optimized DB indexes and glassmorphism UI layout",
      ],
    },
    2: {
      title: "Huffman Compression Engine",
      category: "Algorithms & Information Theory",
      desc: "A lossless data compression system that builds character frequency binary trees to reduce file transmission size.",
      highlights: [
        "Data Structures: Priority Queues (Min-Heaps) & Binary Encoding Trees",
        "Efficiency: Variable-length bitwise prefix coding",
        "Capabilities: Lossless reconstruction for text and binary file formats",
        "Complexity: O(N log K) time complexity for frequency tree building",
      ],
    },
    3: {
      title: "Trie Data Structure Auto-Complete",
      category: "Data Structures & Search Systems",
      desc: "A prefix-tree (Trie) engine engineered for real-time word suggestion and fast auto-completion lookup.",
      highlights: [
        "Algorithm: Trie (Prefix Tree) node pointer hierarchy",
        "Speed: O(L) search time complexity where L is query length",
        "Features: Prefix matching, dictionary insertion, frequency sorting",
        "Use Case: Real-time search bars and auto-correct input systems",
      ],
    },
    4: {
      title: "Developer Analytics Dashboard",
      category: "Full-Stack Web Application",
      desc: "A responsive dashboard that turns application activity into useful engineering metrics and data summaries.",
      highlights: [
        "Frontend: Responsive JavaScript dashboard views",
        "Integration: REST API data fetching and state updates",
        "Storage: SQLite-backed activity and metric records",
        "Focus: Fast scanning and clear operational insights",
      ],
    },
    5: {
      title: "TaskFlow Collaboration App",
      category: "Full-Stack Web Application",
      desc: "A lightweight task management workspace for organizing team work, statuses, and searchable work items.",
      highlights: [
        "Backend: Flask routes with structured task operations",
        "Features: Status tracking, filtering, and search",
        "Frontend: Responsive JavaScript interactions",
        "Focus: Simple workflows for small development teams",
      ],
    },
    6: {
      title: "Graph Route Optimizer",
      category: "Algorithms & Data Structures",
      desc: "A weighted graph engine that compares connected paths and finds efficient routes with Dijkstra's algorithm.",
      highlights: [
        "Algorithm: Dijkstra shortest-path traversal",
        "Data Structures: Adjacency lists and priority queues",
        "Output: Lowest-cost route and total path weight",
        "Complexity: O((V + E) log V) with a binary heap",
      ],
    },
  };

  document.querySelectorAll(".modal-open-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      playSound("click");
      const id = btn.getAttribute("data-project");
      const data = PROJECT_DETAILS[id];
      if (data && projectModal && modalBody) {
        modalBody.innerHTML = `
          <h3>${data.title}</h3>
          <p><strong>Category:</strong> ${data.category}</p>
          <p>${data.desc}</p>
          <h4>Technical Highlights:</h4>
          <ul>
            ${data.highlights.map((h) => `<li>✓ ${h}</li>`).join("")}
          </ul>
        `;
        projectModal.classList.add("active");
        projectModal.setAttribute("aria-hidden", "false");
      }
    });
  });

  function closeModal() {
    if (projectModal) {
      projectModal.classList.remove("active");
      projectModal.setAttribute("aria-hidden", "true");
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

  /* ─── 5. CONFETTI CANVAS BLAST ────────────────────────────── */
  const confettiCanvas = document.getElementById("confettiCanvas");
  function launchConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext("2d");
    let W = (confettiCanvas.width = window.innerWidth);
    let H = (confettiCanvas.height = window.innerHeight);

    const pieces = Array.from({ length: 70 }, () => ({
      x: W / 2,
      y: H / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: ["#ea580c", "#d97706", "#db2777", "#7c3aed", "#10b981"][
        Math.floor(Math.random() * 5)
      ],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
    }));

    let frame = 0;
    function renderConfetti() {
      ctx.clearRect(0, 0, W, H);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // Gravity
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 120) requestAnimationFrame(renderConfetti);
      else ctx.clearRect(0, 0, W, H);
    }
    renderConfetti();
  }

  /* ─── 6. ADVANCED SKILL METERS ANIMATION WITH INTERSECTION OBSERVER ──────────────── */
  const skillMetersObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll(".meter-fill");
          fills.forEach((fill, index) => {
            setTimeout(() => {
              const progress = fill.getAttribute("data-progress");
              fill.style.width = progress;
              fill.classList.add("animated");
            }, index * 80); // Staggered animation
          });
          skillMetersObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "50px" },
  );

  document.querySelectorAll(".skill-category-card").forEach((card) => {
    skillMetersObserver.observe(card);
  });

  /* ─── 7. TYPEWRITER HERO HEADLINE ────────────────────────── */
  const headline = document.querySelector(".hero-headline");
  if (headline) {
    const phrases = [
      "Scalable Digital Solutions",
      "Elegant Algorithmic Systems",
      "High-Performance Web Apps",
      "Clean & Efficient Code",
    ];
    let phraseIdx = 0,
      charIdx = 0,
      isDeleting = false;

    const staticPart =
      'Crafting <span class="gradient-text">High-Performance</span> & ';
    const dynamicSpan = document.createElement("span");
    dynamicSpan.id = "typewriter";
    dynamicSpan.style.cssText =
      "border-right: 3px solid var(--accent-orange); padding-right: 4px;";
    headline.innerHTML = staticPart;
    headline.appendChild(dynamicSpan);

    function type() {
      const phrase = phrases[phraseIdx];
      charIdx += isDeleting ? -1 : 1;
      dynamicSpan.textContent = phrase.substring(0, charIdx);

      let delay = isDeleting ? 45 : 80;
      if (!isDeleting && charIdx === phrase.length) {
        delay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 300;
      }
      setTimeout(type, delay);
    }
    setTimeout(type, 1000);
  }

  /* ─── 8. ADVANCED 3D TILT ON PROJECT CARDS WITH SMOOTH PHYSICS ────────────────────────── */
  let cardTiltState = {};

  document.querySelectorAll(".project-card").forEach((card, idx) => {
    cardTiltState[idx] = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const animateTilt = () => {
      const state = cardTiltState[idx];
      state.x += (state.targetX - state.x) * 0.15;
      state.y += (state.targetY - state.y) * 0.15;

      card.style.transform = `perspective(1000px) rotateX(${state.y}deg) rotateY(${state.x}deg) translateZ(0px)`;

      if (
        Math.abs(state.targetX - state.x) > 0.1 ||
        Math.abs(state.targetY - state.y) > 0.1
      ) {
        requestAnimationFrame(animateTilt);
      }
    };

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      cardTiltState[idx].targetX = x * 15;
      cardTiltState[idx].targetY = -y * 15;

      animateTilt();
    });

    card.addEventListener("mouseleave", () => {
      cardTiltState[idx].targetX = 0;
      cardTiltState[idx].targetY = 0;
      card.style.transition = "transform 500ms cubic-bezier(0.23, 1, 0.320, 1)";
      animateTilt();

      setTimeout(() => {
        card.style.transition = "transform 80ms ease";
      }, 500);
    });

    card.addEventListener("mouseenter", () => playSound("hover"));
  });

  /* ─── 9. ADVANCED MAGNETIC BUTTON EFFECT WITH PHYSICS ───────────────────────── */
  const MagneticButton = {
    elements: document.querySelectorAll(".button--primary, .submit-button"),

    init() {
      this.elements.forEach((btn, idx) => {
        btn.dataset.magneticIndex = idx;
        btn.addEventListener(
          "mousemove",
          throttle((e) => this.handleMouseMove(e, btn), 16),
        );
        btn.addEventListener("mouseleave", (e) =>
          this.handleMouseLeave(e, btn),
        );
      });
    },

    handleMouseMove(e, btn) {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.35;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.35;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const scale = 1 + (Math.min(distance, 50) / 50) * 0.03;

      btn.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      btn.style.filter = `brightness(${1 + distance / 100})`;
    },

    handleMouseLeave(e, btn) {
      btn.style.transform = "translate(0, 0) scale(1)";
      btn.style.filter = "brightness(1)";
      btn.style.transition = "all 400ms cubic-bezier(0.23, 1, 0.320, 1)";

      setTimeout(() => {
        btn.style.transition = "transform 120ms ease, filter 120ms ease";
      }, 400);
    },
  };

  MagneticButton.init();

  /* ─── 10. ADVANCED WARM PARTICLE CANVAS WITH SMOOTH RAF LOOP ────────────────────────── */
  const bgCanvas = document.getElementById("bgCanvas");
  if (bgCanvas) {
    const ctx = bgCanvas.getContext("2d", { alpha: true });
    let W = (bgCanvas.width = window.innerWidth);
    let H = (bgCanvas.height = window.innerHeight);
    let animationFrameId = null;
    let isPageVisible = true;

    window.addEventListener(
      "resize",
      debounce(() => {
        W = bgCanvas.width = window.innerWidth;
        H = bgCanvas.height = window.innerHeight;
      }, 200),
      { passive: true },
    );

    let mx = -999,
      my = -999;
    const throttledMouseMove = throttle((e) => {
      mx = e.clientX;
      my = e.clientY;
    }, 16);
    document.addEventListener("mousemove", throttledMouseMove, {
      passive: true,
    });

    document.addEventListener("visibilitychange", () => {
      isPageVisible = !document.hidden;
    });

    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2.2 + 0.6,
      mass: Math.random() * 0.8 + 0.5,
      life: 1,
    }));

    function drawParticles() {
      if (!isPageVisible) {
        animationFrameId = requestAnimationFrame(drawParticles);
        return;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(234, 88, 12, 0.35)";
      ctx.strokeStyle = "rgba(234, 88, 12, 0.15)";
      ctx.lineWidth = 0.8;

      particles.forEach((p, i) => {
        const dxm = p.x - mx,
          dym = p.y - my;
        const distM = Math.sqrt(dxm * dxm + dym * dym);

        if (distM < 120) {
          const force = (1 - distM / 120) * 0.5;
          p.vx += (dxm / distM) * force * p.mass;
          p.vy += (dym / distM) * force * p.mass;
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -0.8;
        if (p.y < 0 || p.y > H) p.vy *= -0.8;
        p.x = Math.max(0, Math.min(W, p.x));
        p.y = Math.max(0, Math.min(H, p.y));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < Math.min(particles.length, i + 8); j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x,
            dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(234, 88, 12, ${0.15 * (1 - dist / 140)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    }

    drawParticles();

    window.addEventListener("beforeunload", () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });
  }

  /* ─── 11. ADVANCED SCROLL PROGRESS & ACTIVE NAV WITH THROTTLING ────────────── */
  const progressBar = document.getElementById("scrollProgress");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-list a");

  let lastScrollY = 0;

  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    if (progressBar) {
      progressBar.style.width = (scrollY / height) * 100 + "%";
    }

    sections.forEach((sec) => {
      const top = sec.offsetTop - 160;
      const link = document.querySelector(`.nav-list a[href*="#${sec.id}"]`);
      if (link && scrollY >= top && scrollY < top + sec.offsetHeight) {
        navLinks.forEach((l) => l.removeAttribute("aria-current"));
        link.setAttribute("aria-current", "page");
      }
    });

    lastScrollY = scrollY;
  }, 50);

  window.addEventListener("scroll", handleScroll, { passive: true });

  /* ─── 12. ADVANCED CONTACT FORM VALIDATION & CONFETTI ─────────────────────────── */
  const contactForm = document.getElementById("portfolioContactForm");
  if (contactForm) {
    const FormValidator = {
      rules: {
        name: {
          pattern: /^[a-zA-Z\s]{2,50}$/,
          message: "Name must be 2-50 letters",
        },
        email: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email format",
        },
        message: {
          pattern: /^.{10,500}$/,
          message: "Message must be 10-500 characters",
        },
      },

      validate(field) {
        const value = field.value.trim();
        const rule = this.rules[field.name];
        if (!rule) return true;

        const isValid = rule.pattern.test(value);
        const feedback = field.parentElement.querySelector(".field-feedback");

        if (!isValid && value) {
          field.style.borderColor = "var(--accent-pink)";
          if (feedback) feedback.textContent = rule.message;
        } else {
          field.style.borderColor = "";
          if (feedback) feedback.textContent = "";
        }

        return isValid;
      },

      validateAll() {
        const fields = contactForm.querySelectorAll("input, textarea");
        let isValid = true;
        fields.forEach((field) => {
          if (!this.validate(field)) isValid = false;
        });
        return isValid;
      },
    };

    // Add real-time validation
    contactForm.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("blur", () => FormValidator.validate(field));
      field.addEventListener(
        "input",
        debounce(() => FormValidator.validate(field), 300),
      );
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!FormValidator.validateAll()) {
        playSound("click");
        return;
      }

      playSound("click");
      const btn = contactForm.querySelector(".submit-button");
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = "<span>Transmitting...</span>";

      setTimeout(() => {
        playSound("funnySubmit");
        launchConfetti();
        btn.innerHTML = "<span>Message Dispatched! 🚀</span>";
        contactForm.reset();
        contactForm
          .querySelectorAll("input, textarea")
          .forEach((f) => (f.style.borderColor = ""));

        setTimeout(() => {
          btn.innerHTML = orig;
          btn.disabled = false;
        }, 3500);
      }, 700);
    });
  }

  /* ─── 13. SCROLL TO TOP ──────────────────────────────────── */
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      playSound("click");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
