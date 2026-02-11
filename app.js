// Valentine Book - Smooth Page Curl Animation
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

    // No button - playful escape
    let noClickCount = 0;
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        noClickCount++;
        
        if (noClickCount >= 3) {
            yesBtn.click();
            return;
        }
        
        const maxX = window.innerWidth - noBtn.offsetWidth - 100;
        const maxY = window.innerHeight - noBtn.offsetHeight - 100;
        
        const randomX = Math.max(50, Math.random() * maxX);
        const randomY = Math.max(50, Math.random() * maxY);
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
        noBtn.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    });

    // Next page
    nextBtn.addEventListener('click', () => {
        if (currentSpread < totalSpreads - 1) {
            flipToNext();
        }
    });

    // Previous page
    prevBtn.addEventListener('click', () => {
        if (currentSpread > 0) {
            flipToPrevious();
        }
    });

    function flipToNext() {
        const current = spreads[currentSpread];
        const next = spreads[currentSpread + 1];
        
        // Flip current page away
        current.classList.remove('current');
        current.classList.add('flipping-out');
        
        setTimeout(() => {
            current.classList.remove('flipping-out');
            current.classList.add('flipped');
            next.classList.add('current');
            
            currentSpread++;
            updateNavigation();
            checkRainEffect();
        }, 800);
    }

    function flipToPrevious() {
        const current = spreads[currentSpread];
        const previous = spreads[currentSpread - 1];
        
        // Flip previous page back
        previous.classList.remove('flipped');
        previous.classList.add('flipping-out');
        
        // Reverse animation
        setTimeout(() => {
            previous.style.animation = 'pageFlipIn 0.8s ease-in-out forwards';
            
            setTimeout(() => {
                previous.style.animation = '';
                previous.classList.remove('flipping-out');
                previous.classList.add('current');
                current.classList.remove('current');
                
                currentSpread--;
                updateNavigation();
                checkRainEffect();
            }, 800);
        }, 50);
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
            nextBtn.click();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            prevBtn.click();
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
        
        if (diff < -swipeThreshold) {
            nextBtn.click();
        } else if (diff > swipeThreshold) {
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

    // Add page flip in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pageFlipIn {
            0% { transform: rotateY(-180deg); }
            100% { transform: rotateY(0deg); }
        }
    `;
    document.head.appendChild(style);

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
