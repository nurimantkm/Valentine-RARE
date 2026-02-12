let currentSpread = 1;
const totalSpreads = 16;
let noButtonEscapes = 0;

// Update page counter
function updatePageCounter() {
    document.getElementById('currentPage').textContent = currentSpread;
    document.getElementById('totalPages').textContent = totalSpreads;
}

// Show specific spread
function showSpread(spreadNum) {
    const spreads = document.querySelectorAll('.page-spread');
    spreads.forEach((spread, index) => {
        if (index + 1 === spreadNum) {
            spread.classList.add('active');
        } else {
            spread.classList.remove('active');
        }
    });
    
    currentSpread = spreadNum;
    updatePageCounter();
    
    // Update navigation buttons
    document.getElementById('prevBtn').style.display = currentSpread === 1 ? 'none' : 'flex';
    document.getElementById('nextBtn').style.display = currentSpread === totalSpreads ? 'none' : 'flex';
    
    // Show rain on page 15 (kiss scene)
    const rainContainer = document.querySelector('.rain-container');
    if (currentSpread === 15) {
        rainContainer.classList.add('active');
    } else {
        rainContainer.classList.remove('active');
    }
}

// Navigation
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentSpread > 1) {
        showSpread(currentSpread - 1);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentSpread < totalSpreads) {
        showSpread(currentSpread + 1);
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentSpread > 1) {
        showSpread(currentSpread - 1);
    } else if (e.key === 'ArrowRight' && currentSpread < totalSpreads) {
        showSpread(currentSpread + 1);
    }
});

// Intro screen buttons
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const introScreen = document.getElementById('introScreen');
const bookContainer = document.getElementById('bookContainer');

yesBtn.addEventListener('click', () => {
    introScreen.classList.add('hidden');
    bookContainer.classList.add('visible');
    showSpread(1);
});

// Playful "No" button that runs away on hover
noBtn.addEventListener('mouseover', () => {
    if (noButtonEscapes < 3) {
        const randomX = Math.random() * (window.innerWidth - 150);
        const randomY = Math.random() * (window.innerHeight - 60);
        noBtn.style.position = 'fixed';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
        noButtonEscapes++;
    } else {
        // After 3 escapes, auto-click Yes
        introScreen.classList.add('hidden');
        bookContainer.classList.add('visible');
        showSpread(1);
    }
});

// Initialize
updatePageCounter();
