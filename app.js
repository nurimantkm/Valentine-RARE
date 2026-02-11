// Valentine Book - Realistic Page Flip

document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const intro = document.getElementById('intro');
    const bookContainer = document.getElementById('bookContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    
    let currentSpread = 0;
    const spreads = document.querySelectorAll('.page-spread');
    const totalSpreads = spreads.length;

    // Initialize - hide all spreads except first
    spreads.forEach((spread, index) => {
        if (index !== 0) {
            spread.classList.add('hidden');
        }
    });

    // Yes button - open the book
    yesBtn.addEventListener('click', () => {
        intro.classList.add('hidden');
        setTimeout(() => {
            intro.style.display = 'none';
            bookContainer.style.display = 'block';
            bookContainer.style.opacity = '0';
            setTimeout(() => {
                bookContainer.style.transition = 'opacity 1.2s ease';
                bookContainer.style.opacity = '1';
            }, 50);
        }, 1000);
    });

    // No button - playful escape
    let noClickCount = 0;
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        noClickCount++;
        
        if (noClickCount >= 3) {
            // After 3 clicks, just say yes
            yesBtn.click();
            return;
        }
        
        // Move button to random position
        const maxX = window.innerWidth - noBtn.offsetWidth - 100;
        const maxY = window.innerHeight - noBtn.offsetHeight - 100;
        
        const randomX = Math.max(50, Math.random() * maxX);
        const randomY = Math.max(50, Math.random() * maxY);
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
        noBtn.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        // Shake intro
        const bookPreview = document.querySelector('.book-preview');
        bookPreview.style.animation = 'shake 0.5s';
        setTimeout(() => {
            bookPreview.style.animation = '';
        }, 500);
    });

    // Next page
    nextBtn.addEventListener('click', () => {
        if (currentSpread < totalSpreads - 1) {
            flipToSpread(currentSpread + 1);
        }
    });

    // Previous page
    prevBtn.addEventListener('click', () => {
        if (currentSpread > 0) {
            flipToSpread(currentSpread - 1);
        }
    });

    function flipToSpread(targetSpread) {
        if (targetSpread === currentSpread) return;
        
        const isForward = targetSpread > currentSpread;
        
        if (isForward) {
            // Flip current spread away
            spreads[currentSpread].classList.add('flipped');
            
            // Show next spread after a delay
            setTimeout(() => {
                spreads[currentSpread].classList.add('hidden');
                spreads[targetSpread].classList.remove('hidden');
                spreads[targetSpread].classList.remove('flipped');
            }, 700);
        } else {
            // Going backward
            spreads[targetSpread].classList.remove('hidden');
            spreads[targetSpread].classList.add('flipped');
            
            setTimeout(() => {
                spreads[targetSpread].classList.remove('flipped');
                spreads[currentSpread].classList.add('hidden');
                spreads[currentSpread].classList.remove('flipped');
            }, 50);
        }
        
        currentSpread = targetSpread;
        updateNavigation();
        addPageFlipSound();
        
        // Add rain effect on last spread
        if (currentSpread === totalSpreads - 2) {
            createRainEffect();
        }
    }

    function updateNavigation() {
        prevBtn.disabled = currentSpread === 0;
        nextBtn.disabled = currentSpread === totalSpreads - 1;
        pageIndicator.textContent = `${currentSpread + 1} / ${totalSpreads}`;
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (bookContainer.style.display === 'none') return;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextBtn.click();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            prevBtn.click();
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    bookContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    bookContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const horizontalDiff = touchEndX - touchStartX;
        const verticalDiff = Math.abs(touchEndY - touchStartY);
        
        // Only register horizontal swipes
        if (verticalDiff < 100) {
            if (horizontalDiff < -swipeThreshold) {
                nextBtn.click();
            } else if (horizontalDiff > swipeThreshold) {
                prevBtn.click();
            }
        }
    }

    // Page flip sound effect (visual feedback)
    function addPageFlipSound() {
        // Create a subtle visual ripple effect
        const book = document.querySelector('.book');
        book.style.transform = book.style.transform.includes('scale') 
            ? 'rotateY(0deg)' 
            : 'rotateY(0deg) scale(1.02)';
        
        setTimeout(() => {
            book.style.transform = 'rotateY(-5deg)';
        }, 200);
    }

    // Rain effect for the kiss scene
    let rainCreated = false;
    function createRainEffect() {
        if (rainCreated) return;
        rainCreated = true;
        
        const rainContainer = document.createElement('div');
        rainContainer.className = 'rain-effect';
        rainContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 50;
        `;
        
        for (let i = 0; i < 60; i++) {
            const drop = document.createElement('div');
            drop.style.cssText = `
                position: absolute;
                width: 2px;
                height: 20px;
                background: linear-gradient(transparent, rgba(255, 255, 255, 0.5));
                left: ${Math.random() * 100}%;
                top: -20px;
                animation: fall ${2 + Math.random() * 2}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
                opacity: ${0.3 + Math.random() * 0.4};
            `;
            rainContainer.appendChild(drop);
        }
        
        document.body.appendChild(rainContainer);
    }

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh);
                opacity: 0;
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateY(0px) rotateY(-15deg); }
            25% { transform: translateY(0px) rotateY(-18deg) translateX(-5px); }
            75% { transform: translateY(0px) rotateY(-12deg) translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // Initialize navigation
    updateNavigation();
});
