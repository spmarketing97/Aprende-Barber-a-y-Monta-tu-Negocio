// Componente para el slider de beneficios
document.addEventListener('DOMContentLoaded', function() {
    setupBenefitsSlider();
});

function setupBenefitsSlider() {
    const benefitsSlider = document.querySelector('.benefits-slider');
    const benefitsSlides = document.querySelectorAll('.benefit-slide');
    const prevButton = document.querySelector('.benefits-prev');
    const nextButton = document.querySelector('.benefits-next');
    const dotsContainer = document.querySelector('.benefits-dots');
    
    if (!benefitsSlider || benefitsSlides.length === 0) return;
    
    let currentSlide = 0;
    
    // Crear indicadores de puntos para cada slide
    benefitsSlides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('benefits-dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    // Inicializar posicionamiento de los slides
    initSlides();
    
    // Función para inicializar la posición de los slides
    function initSlides() {
        benefitsSlides.forEach((slide, i) => {
            slide.style.transform = `translateX(${100 * i}%)`;
        });
    }
    
    // Mostrar slide actual
    function showSlide(index) {
        benefitsSlides.forEach((slide, i) => {
            slide.style.transform = `translateX(${100 * (i - index)}%)`;
            // Asegurar que todos los slides tengan visibilidad
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            slide.style.position = 'absolute';
            slide.style.width = '100%';
            slide.style.left = '0';
            
            // Ajustar z-index para que el slide actual esté por encima
            if (i === index) {
                slide.style.zIndex = '2';
            } else {
                slide.style.zIndex = '1';
            }
        });
        
        // Actualizar dots
        document.querySelectorAll('.benefits-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    // Ir a un slide específico
    function goToSlide(index) {
        // Asegurarse de que el índice esté dentro de los límites
        if (index < 0) index = benefitsSlides.length - 1;
        if (index >= benefitsSlides.length) index = 0;
        
        showSlide(index);
    }
    
    // Mostrar el primer slide inicialmente
    showSlide(0);
    
    // Event listeners para los botones
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }
    
    // Soporte para swipe en dispositivos móviles
    let touchStartX = 0;
    let touchEndX = 0;
    
    benefitsSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    benefitsSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe izquierda - siguiente slide
            goToSlide(currentSlide + 1);
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe derecha - slide anterior
            goToSlide(currentSlide - 1);
        }
    }
    
    // Autoplay opcional
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 7000); // Cambiar cada 7 segundos
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Iniciar autoplay
    startAutoplay();
    
    // Detener autoplay en interacción
    benefitsSlider.addEventListener('mouseenter', stopAutoplay);
    benefitsSlider.addEventListener('mouseleave', startAutoplay);
    benefitsSlider.addEventListener('touchstart', stopAutoplay, {passive: true});
    benefitsSlider.addEventListener('touchend', startAutoplay, {passive: true});
} 