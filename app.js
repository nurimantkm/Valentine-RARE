// ===== INTRO SCREEN =====
const introScreen = document.getElementById('introScreen');
const bookContainer = document.getElementById('bookContainer');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

let noClickCount = 0;

// No button runs away on hover
noBtn.addEventListener('mouseenter', () => {
    if (noClickCount < 3) {
        const maxX = window.innerWidth - noBtn.offsetWidth - 100;
        const maxY = window.innerHeight - noBtn.offsetHeight - 100;
        
        const randomX = Math.random() * maxX - maxX / 2;
        const randomY = Math.random() * maxY - maxY / 2;
        
        noBtn.style.setProperty('--move-x', `${randomX}px`);
        noBtn.style.setProperty('--move-y', `${randomY}px`);
        
        noClickCount++;
    }
});

// After 3 attempts, No becomes Yes
noBtn.addEventListener('click', () => {
    if (noClickCount >= 3) {
        openBook();
    }
});

// Yes button opens the book
yesBtn.addEventListener('click', openBook);

function openBook() {
    introScreen.classList.add('hidden');
    setTimeout(() => {
        bookContainer.classList.remove('hidden');
    }, 500);
}

// ===== PAGE NAVIGATION =====
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageCounter = document.getElementById('pageCounter');
const totalPages = 13;
let currentPage = 1;

// Checkboxes
const checkboxes = [
    null, // index 0 unused
    document.getElementById('page1_check'),
    document.getElementById('page2_check'),
    document.getElementById('page3_check'),
    document.getElementById('page4_check'),
    document.getElementById('page5_check'),
    document.getElementById('page6_check'),
    document.getElementById('page7_check'),
    document.getElementById('page8_check'),
    document.getElementById('page9_check'),
    document.getElementById('page10_check')
];

function updatePageCounter() {
    pageCounter.textContent = `${currentPage} / ${totalPages}`;
}

function updateButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

function goToPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;
    
    // Each page flip shows 2 pages (front and back)
    // Page 1 = page1 front
    // Page 2 = page1 back
    // Page 3 = page2 front
    // etc.
    
    const checkboxIndex = Math.ceil(pageNum / 2);
    
    // Update checkboxes
    for (let i = 1; i <= 10; i++) {
        if (checkboxes[i]) {
            checkboxes[i].checked = i < checkboxIndex;
        }
    }
    
    currentPage = pageNum;
    updatePageCounter();
    updateButtons();
    
    // Trigger rain on kiss scene (page 12)
    if (currentPage === 12) {
        startRain();
    } else {
        stopRain();
    }
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (bookContainer.classList.contains('hidden')) return;
    
    if (e.key === 'ArrowLeft') {
        prevBtn.click();
    } else if (e.key === 'ArrowRight') {
        nextBtn.click();
    }
});

// Initialize
updatePageCounter();
updateButtons();

// ===== RAIN EFFECT =====
const rainCanvas = document.getElementById('rainCanvas');
const ctx = rainCanvas.getContext('2d');

let rainActive = false;
let raindrops = [];

function resizeCanvas() {
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Raindrop {
    constructor() {
        this.x = Math.random() * rainCanvas.width;
        this.y = Math.random() * rainCanvas.height - rainCanvas.height;
        this.length = Math.random() * 20 + 10;
        this.speed = Math.random() * 5 + 5;
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    
    update() {
        this.y += this.speed;
        if (this.y > rainCanvas.height) {
            this.y = -this.length;
            this.x = Math.random() * rainCanvas.width;
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.strokeStyle = `rgba(174, 194, 224, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function initRain() {
    raindrops = [];
    for (let i = 0; i < 200; i++) {
        raindrops.push(new Raindrop());
    }
}

function animateRain() {
    if (!rainActive) return;
    
    ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    
    raindrops.forEach(drop => {
        drop.update();
        drop.draw();
    });
    
    requestAnimationFrame(animateRain);
}

function startRain() {
    if (rainActive) return;
    rainActive = true;
    rainCanvas.classList.add('active');
    initRain();
    animateRain();
}

function stopRain() {
    rainActive = false;
    rainCanvas.classList.remove('active');
}
