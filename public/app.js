// ---- Core elements
const story = document.getElementById("story");
const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const btnRow = document.getElementById("btnRow");
const psBtn  = document.getElementById("psBtn");
const psText = document.getElementById("psText");

// ---- "No" button dodge
let dodgeCount = 0;
const dodgePhrases = [
  "No",
  "Are you sure?",
  "Think again",
  "Nope 😌",
  "You’re lying",
  "Try harder",
  "😏",
  "Ok last chance",
  "Still no?",
  "👀"
];

function moveNoButton() {
  dodgeCount++;
  const rect = btnRow.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const maxX = rect.width - btnRect.width;
  const maxY = 60;

  const x = Math.max(0, Math.random() * maxX);
  const y = (Math.random() * maxY) - (maxY / 2);

  noBtn.style.position = "relative";
  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
  noBtn.textContent = dodgePhrases[Math.min(dodgeCount, dodgePhrases.length - 1)];
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton);

// ---- Yes action: scroll to next page
yesBtn.addEventListener("click", () => {
  const next = document.querySelector('.page[data-page="1"]');
  next?.scrollIntoView({ behavior: "smooth", block: "start" });
});

// ---- P.S. toggle
if (psBtn && psText) {
  psBtn.addEventListener("click", () => {
    psText.classList.toggle("hidden");
    psBtn.textContent = psText.classList.contains("hidden") ? "Show P.S." : "Hide P.S.";
  });
}

// =====================
// Ambient canvases
// =====================

const starsCanvas = document.getElementById("stars");
const rainCanvas  = document.getElementById("rain");
const sctx = starsCanvas.getContext("2d");
const rctx = rainCanvas.getContext("2d");

function resizeCanvases() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  [starsCanvas, rainCanvas].forEach((c) => {
    c.width  = Math.floor(window.innerWidth * dpr);
    c.height = Math.floor(window.innerHeight * dpr);
    c.style.width = "100%";
    c.style.height = "100%";
  });
  sctx.setTransform(dpr,0,0,dpr,0,0);
  rctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener("resize", resizeCanvases);
resizeCanvases();

// ---- Stars
const stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.6 + 0.2,
  a: Math.random() * 0.7 + 0.2,
  tw: Math.random() * 0.02 + 0.005
}));

function drawStars() {
  sctx.clearRect(0,0,window.innerWidth, window.innerHeight);
  const p = currentPage();

  // stronger stars after the Turkmen skywatch pages
  starsCanvas.style.opacity = (p === 0) ? "0.65" : (p >= 11 ? "1" : "0.9");

  for (const st of stars) {
    st.a += st.tw;
    if (st.a > 0.95 || st.a < 0.15) st.tw *= -1;

    sctx.beginPath();
    sctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
    sctx.fillStyle = `rgba(255,255,255,${st.a})`;
    sctx.fill();
  }
  requestAnimationFrame(drawStars);
}
drawStars();

// ---- Rain (soft drizzle normally, heavy on page 12)
let drops = Array.from({ length: 140 }, () => newDrop());
function newDrop() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    l: Math.random() * 16 + 8,
    v: Math.random() * 6 + 5,
    a: Math.random() * 0.35 + 0.15
  };
}

function drawRain() {
  rctx.clearRect(0,0,window.innerWidth, window.innerHeight);
  const p = currentPage();

  // heavy rain on kiss page (12)
  const intensity = (p === 12) ? 1 : 0.35;
  rainCanvas.style.opacity = (p >= 10 ? "0.75" : "0.0");

  rctx.lineWidth = 1;
  for (let i = 0; i < drops.length; i++) {
    const d = drops[i];
    rctx.beginPath();
    rctx.moveTo(d.x, d.y);
    rctx.lineTo(d.x, d.y + d.l * intensity);
    rctx.strokeStyle = `rgba(180,220,255,${d.a * intensity})`;
    rctx.stroke();

    d.y += d.v * intensity;
    d.x += 0.6 * intensity;

    if (d.y > window.innerHeight) drops[i] = newDrop();
  }
  requestAnimationFrame(drawRain);
}
drawRain();

// =====================
// Page utilities
// =====================
function currentPage() {
  const pages = Array.from(document.querySelectorAll(".page"));
  const centerY = window.innerHeight / 2;
  let best = { page: 0, dist: Infinity };

  for (const el of pages) {
    const rect = el.getBoundingClientRect();
    const elCenter = rect.top + rect.height / 2;
    const dist = Math.abs(elCenter - centerY);
    if (dist < best.dist) {
      best = { page: Number(el.dataset.page || 0), dist };
    }
  }
  return best.page;
}

// --- Book-like page entrance + image preloading ---
const pageEls = Array.from(document.querySelectorAll(".page"));
const pageIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) e.target.classList.add("in-view");
    else e.target.classList.remove("in-view");
  }
}, { threshold: 0.35 });

pageEls.forEach((p) => pageIO.observe(p));

const preload = (src) => {
  if (!src) return;
  const img = new Image();
  img.src = src;
};

const preloadAround = () => {
  const p = currentPage();
  const cur = document.querySelector(`.page[data-page="${p}"] img`);
  const nxt = document.querySelector(`.page[data-page="${p+1}"] img`);
  preload(cur?.getAttribute("src"));
  preload(nxt?.getAttribute("src"));
};

// run once and on scroll
preloadAround();
story?.addEventListener("scroll", preloadAround, { passive: true });
