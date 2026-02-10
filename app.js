// ========= Mini helpers =========
const $ = (sel) => document.querySelector(sel);
const story = $("#story");

const yesBtn = $("#yesBtn");
const noBtn  = $("#noBtn");
const btnRow = $("#btnRow");

const psBtn  = $("#psBtn");
const psText = $("#psText");

// Scroll to specific page
function scrollToPage(n){
  const el = document.querySelector(`section[data-page="${n}"]`);
  if (el) el.scrollIntoView({behavior:"smooth", block:"start"});
}

// Yes -> scroll to Page 1
yesBtn?.addEventListener("click", () => scrollToPage(1));

// No button dodges (gentle + bounded)
noBtn?.addEventListener("mouseenter", dodgeNo);
noBtn?.addEventListener("touchstart", (e) => { e.preventDefault(); dodgeNo(); }, {passive:false});

function dodgeNo(){
  if (!btnRow || !noBtn) return;
  const rect = btnRow.getBoundingClientRect();

  const maxX = rect.width - noBtn.offsetWidth;
  const maxY = rect.height - noBtn.offsetHeight;

  const x = Math.max(0, Math.min(maxX, Math.random() * maxX));
  const y = Math.max(0, Math.min(maxY, Math.random() * maxY));

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

// PS easter egg
psBtn?.addEventListener("click", () => {
  psText.classList.toggle("hidden");
  psBtn.textContent = psText.classList.contains("hidden") ? "PS (tap)" : "PS (hide)";
});

// ========= Ambient Canvases =========
const starsCanvas = $("#stars");
const rainCanvas  = $("#rain");
const sctx = starsCanvas.getContext("2d");
const rctx = rainCanvas.getContext("2d");

function resize(){
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  [starsCanvas, rainCanvas].forEach(c => {
    c.width = Math.floor(window.innerWidth * dpr);
    c.height = Math.floor(window.innerHeight * dpr);
    c._dpr = dpr;
  });
}
window.addEventListener("resize", () => {
  resize();
  initStars();
  initRain();
});
resize();

// ----- Stars -----
let stars = [];
function initStars(){
  const w = starsCanvas.width, h = starsCanvas.height;
  const dpr = starsCanvas._dpr || 1;

  stars = Array.from({length: 140}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    r: (Math.random()*1.4 + 0.2) * dpr,
    a: Math.random()*0.7 + 0.2,
    tw: Math.random()*0.018 + 0.003
  }));
}
initStars();

function drawStars(){
  const w = starsCanvas.width, h = starsCanvas.height;
  sctx.clearRect(0,0,w,h);

  for(const st of stars){
    st.a += st.tw * (Math.random() > 0.5 ? 1 : -1);
    st.a = Math.max(0.15, Math.min(0.9, st.a));

    sctx.globalAlpha = st.a;
    sctx.beginPath();
    sctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
    sctx.fillStyle = "#FFFFFF";
    sctx.fill();
  }
  sctx.globalAlpha = 1;
  requestAnimationFrame(drawStars);
}
drawStars();

// ----- Rain (light) -----
let drops = [];
function initRain(){
  const w = rainCanvas.width, h = rainCanvas.height;
  const dpr = rainCanvas._dpr || 1;

  drops = Array.from({length: 180}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    len: (Math.random()*18 + 12) * dpr,
    spd: (Math.random()*7 + 6) * dpr,
    lw:  (Math.random()*1 + 0.6) * dpr,
    sl:  (Math.random()*1.6 + 1.2) * dpr
  }));
}
initRain();

function currentPage(){
  const pages = Array.from(document.querySelectorAll(".page"));
  let best = 0, bestDist = Infinity;
  for(const p of pages){
    const rect = p.getBoundingClientRect();
    const dist = Math.abs(rect.top);
    if (dist < bestDist){
      bestDist = dist;
      best = parseInt(p.dataset.page, 10) || 0;
    }
  }
  return best;
}

function drawRain(){
  const w = rainCanvas.width, h = rainCanvas.height;
  rctx.clearRect(0,0,w,h);

  // Intensify rain only on Page 9, keep subtle elsewhere
  const p = currentPage();
  const intensity = (p === 9) ? 1 : 0.35;

  rctx.globalAlpha = 0.38 * intensity;
  rctx.strokeStyle = "#BFEFFF";

  for(const d of drops){
    rctx.lineWidth = d.lw;
    rctx.beginPath();
    rctx.moveTo(d.x, d.y);
    rctx.lineTo(d.x - d.sl, d.y + d.len);
    rctx.stroke();

    d.y += d.spd;
    d.x -= d.sl * 0.12;

    if (d.y > h + 40) { d.y = -40; d.x = Math.random()*w; }
    if (d.x < -50) d.x = w + 50;
  }

  rctx.globalAlpha = 1;
  requestAnimationFrame(drawRain);
}
drawRain();

// Optional: soften stars on gate page, brighten on finale
story?.addEventListener("scroll", () => {
  const p = currentPage();
  starsCanvas.style.opacity = (p === 0) ? "0.65" : (p >= 8 ? "1" : "0.9");
});
