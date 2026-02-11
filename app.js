// ===== Background: Stars + Rain =====
const starsCanvas = document.getElementById("stars");
const rainCanvas = document.getElementById("rain");
const storyEl = document.getElementById("story");

const ctxS = starsCanvas.getContext("2d");
const ctxR = rainCanvas.getContext("2d");

let W = 0, H = 0;
function resize() {
  W = starsCanvas.width = rainCanvas.width = window.innerWidth;
  H = starsCanvas.height = rainCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Stars with subtle parallax
const stars = Array.from({ length: 140 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.6 + 0.2,
  a: Math.random() * 0.6 + 0.2,
  tw: Math.random() * 0.02 + 0.005,
  depth: Math.random() * 0.5 + 0.5, // for parallax
}));

let scrollOffset = 0;

function drawStars(t) {
  ctxS.clearRect(0, 0, W, H);
  for (const s of stars) {
    const tw = Math.sin(t * 0.001 + s.x * 10) * s.tw;
    ctxS.globalAlpha = Math.max(0, Math.min(1, s.a + tw));
    ctxS.beginPath();
    // Parallax effect based on scroll
    const parallaxY = s.y * H + (scrollOffset * s.depth * 0.3);
    ctxS.arc(s.x * W, parallaxY % H, s.r, 0, Math.PI * 2);
    ctxS.fillStyle = "#EAF0FF";
    ctxS.fill();
  }
  ctxS.globalAlpha = 1;
}

// Rain
let rainIntensity = 0.55;
let drops = [];

function resetRain() {
  drops = Array.from({ length: Math.floor(240 * rainIntensity) }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    l: Math.random() * 18 + 10,
    v: Math.random() * 7 + 6,
    a: Math.random() * 0.25 + 0.08,
  }));
}
resetRain();

function drawRain() {
  ctxR.clearRect(0, 0, W, H);
  ctxR.lineWidth = 1;
  ctxR.strokeStyle = "rgba(234,240,255,0.6)";

  for (const d of drops) {
    ctxR.globalAlpha = d.a;
    ctxR.beginPath();
    ctxR.moveTo(d.x, d.y);
    ctxR.lineTo(d.x, d.y + d.l);
    ctxR.stroke();

    d.y += d.v;
    d.x += 0.6;

    if (d.y > H) {
      d.y = -d.l;
      d.x = Math.random() * W;
    }
    if (d.x > W) d.x = 0;
  }
  ctxR.globalAlpha = 1;
}

// Animation loop
function tick(t) {
  drawStars(t);
  drawRain();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// ===== Gate logic (Yes unlocks story) =====
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

function unlockStory() {
  const lockedPages = document.querySelectorAll(".page.locked");
  
  // Unlock with staggered animation
  lockedPages.forEach((el, index) => {
    setTimeout(() => {
      el.classList.remove("locked");
    }, index * 80);
  });
  
  // jump to first story page nicely
  setTimeout(() => {
    const p1 = document.getElementById("p1");
    if (p1) p1.scrollIntoView({ behavior: "smooth" });
  }, 400);
}

yesBtn.addEventListener("click", () => {
  unlockStory();
});

noBtn.addEventListener("mouseenter", () => {
  // playful "run away" button
  const maxX = Math.max(0, yesBtn.parentElement.clientWidth - noBtn.offsetWidth);
  const maxY = 0;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
});

noBtn.addEventListener("click", () => {
  // gentle tease
  alert("Nice try 😌");
});

// ===== Illustrations: load from data-img =====
function wireIllustrations() {
  document.querySelectorAll(".page[data-img]").forEach((page) => {
    const imgPath = page.getAttribute("data-img");
    const imgEl = page.querySelector("img.ill");
    if (!imgEl) return;
    imgEl.dataset.src = `./${imgPath}`;
  });
}
wireIllustrations();

// ===== Page Turn Effect =====
let lastScrollTop = 0;
let currentPageIndex = 0;
const pages = Array.from(document.querySelectorAll(".page"));

function updatePageTurnEffect() {
  const scrollTop = storyEl.scrollTop;
  scrollOffset = scrollTop; // for star parallax
  
  const scrollHeight = storyEl.scrollHeight - storyEl.clientHeight;
  const scrollProgress = scrollTop / scrollHeight;
  
  pages.forEach((page, index) => {
    const pageTop = page.offsetTop;
    const pageHeight = page.offsetHeight;
    const pageCenter = pageTop + pageHeight / 2;
    const viewportCenter = scrollTop + storyEl.clientHeight / 2;
    
    const distanceFromCenter = viewportCenter - pageCenter;
    const normalizedDistance = distanceFromCenter / pageHeight;
    
    // Remove all turn classes first
    page.classList.remove('turning-out', 'turned', 'turning-in');
    
    if (normalizedDistance > 0.8) {
      // Page is above viewport - fully turned
      page.classList.add('turned');
    } else if (normalizedDistance > 0.3) {
      // Page is leaving viewport - turning out
      page.classList.add('turning-out');
    } else if (normalizedDistance < -0.3) {
      // Page is entering viewport - turning in
      page.classList.add('turning-in');
    }
  });
  
  lastScrollTop = scrollTop;
}

// Lazy load + page fade-in with enhanced intersection observer
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      const page = e.target;
      if (e.isIntersecting) {
        page.classList.add("in-view");
        // Load illustration
        const img = page.querySelector("img.ill");
        if (img && !img.src && img.dataset.src) {
          img.src = img.dataset.src;
        }
      } else {
        // Optional: remove in-view when scrolled past
        // page.classList.remove("in-view");
      }
    }
  },
  { root: storyEl, threshold: [0, 0.25, 0.5, 0.75, 1] }
);

pages.forEach((p) => io.observe(p));

// ===== Rain intensity bump on kiss page + Page turn effect =====
storyEl.addEventListener("scroll", () => {
  const current = getCurrentPage();
  
  // Make rain stronger around page 12 (kiss)
  const target = current >= 12 ? 0.95 : 0.55;
  rainIntensity += (target - rainIntensity) * 0.06;
  if (drops.length !== Math.floor(240 * rainIntensity)) {
    resetRain();
  }
  
  // Update page turn effect
  requestAnimationFrame(updatePageTurnEffect);
});

function getCurrentPage() {
  // pick the page closest to center of viewport
  let best = 0;
  let bestDist = Infinity;
  const viewportCenter = storyEl.scrollTop + storyEl.clientHeight / 2;
  
  for (const p of pages) {
    const pageCenter = p.offsetTop + p.offsetHeight / 2;
    const dist = Math.abs(viewportCenter - pageCenter);
    if (dist < bestDist) {
      bestDist = dist;
      best = parseInt(p.dataset.page || "0", 10);
    }
  }
  return best;
}

// ===== Mouse parallax effect on cards (subtle 3D tilt) =====
if (window.matchMedia("(min-width: 861px)").matches) {
  pages.forEach(page => {
    const card = page.querySelector('.card');
    if (!card) return;
    
    page.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -3; // max 3deg
      const rotateY = (x - centerX) / centerX * 3;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    page.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Initial page turn state
updatePageTurnEffect();

