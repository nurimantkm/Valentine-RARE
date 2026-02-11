// Valentine Book - Complete Fixed Version
document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const intro = document.getElementById('introScreen');
    const bookContainer = document.getElementById('bookContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    
    let currentSpread = 0;
    const spreads = document.querySelectorAll('.page-spread');
    const totalSpreads = spreads.length;

    // Initialize - show first spread
    if (spreads.length > 0) {
        spreads[0].classList.add('current');
    }

    // Yes button - open the book with animation
    yesBtn.addEventListener('click', () => {
        intro.classList.add('hidden');
        
        setTimeout(() => {
            bookContainer.classList.add('visible');
            currentSpread = 0;
            updateNavigation();
        }, 800);
    });

    // No button - runs away on hover (not click)
    let noEscapeCount = 0;
    
    noBtn.addEventListener('mouseenter', (e) => {
        noEscapeCount++;
        
        // After 3 escapes, automatically click Yes
        if (noEscapeCount >= 3) {
            yesBtn.click();
            return;
        }
        
        // Calculate safe movement area
        const card = noBtn.closest('.intro-card');
        const cardRect = card.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();
        
        // Random direction
        const directions = [
            { x: 80, y: 0 },     // Right
            { x: -80, y: 0 },    // Left
            { x: 0, y: 60 },     // Down
            { x: 0, y: -60 },    // Up
            { x: 60, y: 60 },    // Diagonal down-right
            { x: -60, y: 60 },   // Diagonal down-left
        ];
        
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        
        noBtn.style.setProperty('--move-x', randomDir.x + 'px');
        noBtn.style.setProperty('--move-y', randomDir.y + 'px');
        noBtn.classList.add('escaped');
        
        setTimeout(() => {
            noBtn.classList.remove('escaped');
        }, 300);
    });
    
    // Reset position when mouse leaves the card area
    noBtn.closest('.intro-card').addEventListener('mouseleave', () => {
        noBtn.style.setProperty('--move-x', '0px');
        noBtn.style.setProperty('--move-y', '0px');
    });

    // Next page with smooth forward flip
    nextBtn.addEventListener('click', () => {
        if (currentSpread < totalSpreads - 1) {
            flipToNext();
        }
    });

    // Previous page with smooth backward flip
    prevBtn.addEventListener('click', () => {
        if (currentSpread > 0) {
            flipToPrevious();
        }
    });

    function flipToNext() {
        const current = spreads[currentSpread];
        const next = spreads[currentSpread + 1];
        
        // Disable buttons during animation
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        
        // Flip current page forward
        current.classList.remove('current');
        current.classList.add('flipping-forward');
        
        setTimeout(() => {
            current.classList.remove('flipping-forward');
            next.classList.add('current');
            
            currentSpread++;
            updateNavigation();
            checkRainEffect();
        }, 800);
    }

    function flipToPrevious() {
        const current = spreads[currentSpread];
        const previous = spreads[currentSpread - 1];
        
        // Disable buttons during animation
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        
        // Flip back to previous page
        current.classList.remove('current');
        previous.classList.add('flipping-backward');
        
        setTimeout(() => {
            previous.classList.remove('flipping-backward');
            previous.classList.add('current');
            
            currentSpread--;
            updateNavigation();
            checkRainEffect();
        }, 800);
    }

    function updateNavigation() {
        prevBtn.disabled = currentSpread === 0;
        nextBtn.disabled = currentSpread === totalSpreads - 1;
        pageIndicator.textContent = `${currentSpread + 1} / ${totalSpreads}`;
    }

    function checkRainEffect() {
        const rain = document.querySelector('.rain');
        if (currentSpread === 8) { // Kiss scene (Chapter 9)
            if (!rain) {
                createRainEffect();
            } else {
                rain.classList.add('active');
            }
        } else if (rain) {
            rain.classList.remove('active');
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!bookContainer.classList.contains('visible')) return;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            if (!nextBtn.disabled) nextBtn.click();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            if (!prevBtn.disabled) prevBtn.click();
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    bookContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    bookContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        
        if (diff < -swipeThreshold && !nextBtn.disabled) {
            nextBtn.click();
        } else if (diff > swipeThreshold && !prevBtn.disabled) {
            prevBtn.click();
        }
    }

    // Rain effect for the kiss scene
    function createRainEffect() {
        const rain = document.createElement('div');
        rain.className = 'rain active';
        
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (1 + Math.random()) + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            rain.appendChild(drop);
        }
        
        document.body.appendChild(rain);
    }

    // Floating particles
    createFloatingParticles();
    
    function createFloatingParticles() {
        const particles = document.querySelector('.particles');
        if (!particles) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            particles.appendChild(particle);
        }
    }
});
