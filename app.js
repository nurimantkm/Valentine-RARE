// Valentine Book - Fixed Version
document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const introScreen = document.getElementById('introScreen');
    const bookContainer = document.getElementById('bookContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    
    let currentSpread = 1;
    const spreads = document.querySelectorAll('.page-spread');
    const totalSpreads = spreads.length;

    // Yes button - open the book with animation
    yesBtn.addEventListener('click', () => {
        // Hide intro screen
        introScreen.classList.add('hidden');
        
        setTimeout(() => {
            introScreen.style.display = 'none';
            bookContainer.style.display = 'block';
            
            // Trigger book opening animation
            setTimeout(() => {
                bookContainer.classList.add('visible');
            }, 100);
        }, 1200);
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
        
        // Shake intro card
        const introCard = document.querySelector('.intro-card');
        introCard.style.animation = 'shake 0.5s';
        setTimeout(() => {
            introCard.style.animation = '';
        }, 500);
    });

    // Next page
    nextBtn.addEventListener('click', () => {
        if (currentSpread < totalSpreads) {
            goToSpread(currentSpread + 1);
        }
    });

    // Previous page
    prevBtn.addEventListener('click', () => {
        if (currentSpread > 1) {
            goToSpread(currentSpread - 1);
        }
    });

    function goToSpread(targetSpread) {
        if (targetSpread === currentSpread || targetSpread < 1 || targetSpread > totalSpreads) {
            return;
        }
        
        const currentElement = spreads[currentSpread - 1];
        const targetElement = spreads[targetSpread - 1];
        
        // Remove active from current
        currentElement.classList.remove('active');
        currentElement.classList.add('flipping-out');
        
        // Show target after a delay
        setTimeout(() => {
            currentElement.classList.remove('flipping-out');
            currentElement.style.opacity = '0';
            
            targetElement.classList.add('active');
            targetElement.classList.add('flipping-in');
            
            setTimeout(() => {
                targetElement.classList.remove('flipping-in');
            }, 1200);
        }, 600);
        
        currentSpread = targetSpread;
        updateNavigation();
        
        // Add rain effect on kiss scene
        if (currentSpread === 9) {
            createRainEffect();
        }
    }

    function updateNavigation() {
        prevBtn.disabled = currentSpread === 1;
        nextBtn.disabled = currentSpread === totalSpreads;
        pageIndicator.textContent = `${currentSpread} / ${totalSpreads}`;
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
        
        for (let i = 0; i < 80; i++) {
            const drop = document.createElement('div');
            drop.style.cssText = `
                position: absolute;
                width: 2px;
                height: 20px;
                background: linear-gradient(transparent, rgba(255, 255, 255, 0.6));
                left: ${Math.random() * 100}%;
                top: -20px;
                animation: fall ${2 + Math.random() * 2}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
                opacity: ${0.3 + Math.random() * 0.5};
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
            0%, 100% { transform: translateY(0px); }
            25% { transform: translateY(0px) translateX(-8px) rotate(-2deg); }
            75% { transform: translateY(0px) translateX(8px) rotate(2deg); }
        }
    `;
    document.head.appendChild(style);

    // Initialize navigation
    updateNavigation();
});
