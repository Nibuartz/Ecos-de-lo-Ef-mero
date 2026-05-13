const spreads = document.querySelectorAll('.page-spread');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const zoomBtn = document.getElementById('zoomBtn');
const flipSound = document.getElementById('flipSound');
const currentSpreadSpan = document.getElementById('currentSpread');
const totalSpreadsSpan = document.getElementById('totalSpreads');

// Modal elementos
const modal = document.getElementById('zoomModal');
const modalImg = document.getElementById('zoomedImage');
const closeModal = document.querySelector('.close-modal');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentIndex = 0;
const totalSpreads = spreads.length;

totalSpreadsSpan.textContent = totalSpreads;

function getCurrentImage() {
    const currentSpread = spreads[currentIndex];
    const img = currentSpread.querySelector('img');
    return img ? img.src : '';
}

function updateSpread(animate = true) {
    spreads.forEach((spread, index) => {
        if (index === currentIndex) {
            spread.classList.add('active');
            if (animate) {
                spread.style.animation = 'none';
                spread.offsetHeight;
                spread.style.animation = 'pageReveal 0.6s ease-out forwards';
            }
        } else {
            spread.classList.remove('active');
        }
    });
    currentSpreadSpan.textContent = currentIndex + 1;
}

function playFlipSound() {
    if (flipSound) {
        flipSound.currentTime = 0;
        flipSound.play().catch(e => console.log("Audio:", e));
    }
}

// Función GLOBAL para navegar desde los botones de los relatos
window.goToPageInBook = function(pageIndex) {
    if (pageIndex >= 0 && pageIndex < totalSpreads) {
        playFlipSound();
        currentIndex = pageIndex;
        updateSpread(true);
        
        // Pequeña animación de scroll al libro
        const bookElement = document.querySelector('.book');
        if (bookElement) {
            bookElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

// Navegación por botones
nextBtn.addEventListener('click', () => {
    if (currentIndex < totalSpreads - 1) {
        playFlipSound();
        currentIndex++;
        updateSpread(true);
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        playFlipSound();
        currentIndex--;
        updateSpread(true);
    }
});

// Zoom
zoomBtn.addEventListener('click', () => {
    const imgSrc = getCurrentImage();
    if (imgSrc) {
        modalImg.src = imgSrc;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

modalPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSpread(true);
        modalImg.src = getCurrentImage();
        playFlipSound();
    }
});

modalNext.addEventListener('click', () => {
    if (currentIndex < totalSpreads - 1) {
        currentIndex++;
        updateSpread(true);
        modalImg.src = getCurrentImage();
        playFlipSound();
    }
});

// Teclado
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            modalPrev.click();
        } else if (e.key === 'ArrowRight') {
            modalNext.click();
        } else if (e.key === 'Escape') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    } else {
        if (e.key === 'ArrowRight') {
            nextBtn.click();
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        }
    }
});

updateSpread(true);