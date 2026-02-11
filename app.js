// Valentine Book Flip - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const intro = document.getElementById('intro');
    const book = document.getElementById('book');
    
    let currentPage = 0;
    const totalPages = 12;

    // Yes button - unlock the story
    yesBtn.addEventListener('click', () => {
        intro.classList.add('hidden');
        setTimeout(() => {
            intro.style.display = 'none';
            book.style.display = 'flex';
            // Add entrance animation
            book.style.opacity = '0';
            book.style.transform = 'scale(0.8)';
            setTimeout(() => {
                book.style.transition = 'opacity 1s ease, transform 1s ease';
                book.style.opacity = '1';
                book.style.transform = 'scale(1)';
            }, 50);
        }, 800);
    });

    // No button - playful interaction
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Move the button randomly
        const maxX = window.innerWidth - noBtn.offsetWidth - 100;
        const maxY = window.innerHeight - noBtn.offsetHeight - 100;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
        noBtn.style.transition = 'all 0.3s ease';
        
        // Shake the card
        const card = document.querySelector('.intro-card');
        card.style.animation = 'shake 0.5s';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (book.style.display === 'none') return;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            prevPage();
        }
    });

    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    book.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    book.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextPage();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            prevPage();
        }
    }

    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            document.getElementById(`page${currentPage}`).checked = true;
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage--;
            document.getElementById(`page${currentPage}`).checked = true;
        }
    }

    // Track page changes via radio buttons
    const radioInputs = document.querySelectorAll('input[name="page"]');
    radioInputs.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                currentPage = index;
                addPageFlipSound();
            }
        });
    });

    // Optional: Add subtle page flip sound effect
    function addPageFlipSound() {
        // You can add a subtle audio effect here if desired
        // const audio = new Audio('page-flip.mp3');
        // audio.volume = 0.3;
        // audio.play();
    }

    // Add rain effect on the last page
    function createRainEffect() {
        const rainContainer = document.createElement('div');
        rainContainer.className = 'rain-effect';
        rainContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        
        for (let i = 0; i < 50; i++) {
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
            `;
            rainContainer.appendChild(drop);
        }
        
        document.body.appendChild(rainContainer);
    }

    // Monitor when user reaches the kiss scene (page 11)
    document.getElementById('page11').addEventListener('change', (e) => {
        if (e.target.checked) {
            createRainEffect();
        }
    });

    // Add CSS animation for rain
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
});