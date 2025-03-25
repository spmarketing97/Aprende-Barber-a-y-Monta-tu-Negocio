// Smooth scrolling para los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Sistema de pestañas para módulos
function setupModuleTabs() {
    const tabs = document.querySelectorAll('.module-tab');
    const tabContents = document.querySelectorAll('.module-tab-content');
    
    if (!tabs.length || !tabContents.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Desactivar todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activar la pestaña seleccionada
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Widget flotante - mostrar/ocultar basado en scroll
const floatingWidget = document.querySelector('.floating-widget');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Mostrar widget solo después de scrollear 300px
    if (scrollTop > 300) {
        floatingWidget.style.display = 'block';
        
        // Ocultar widget cuando se llega al CTA final
        const ctaFinal = document.getElementById('cta-final');
        const ctaRect = ctaFinal.getBoundingClientRect();
        
        if (ctaRect.top < window.innerHeight && ctaRect.bottom > 0) {
            floatingWidget.style.display = 'none';
        }
    } else {
        floatingWidget.style.display = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// Inicialmente ocultar el widget
document.addEventListener('DOMContentLoaded', () => {
    floatingWidget.style.display = 'none';
});

// Contador de escasez - Inicia con 25 minutos
document.addEventListener('DOMContentLoaded', function() {
    setupCountdown();
    setupTestimonialsSlider();
    setupModuleTabs();
    setupVideoListener();
    setupCertificateEffect();
});

// Configuración del contador de escasez
function setupCountdown() {
    // Comprobar si ya hay un tiempo guardado en localStorage
    let savedTime = localStorage.getItem('countdownEndTime');
    let countdownDate;
    
    // Si no hay tiempo guardado o ha pasado más de 5 días, iniciar nuevo contador
    if (!savedTime) {
        // Iniciar con 25 minutos desde ahora
        countdownDate = new Date().getTime() + 25 * 60 * 1000;
        localStorage.setItem('countdownEndTime', countdownDate);
        localStorage.setItem('countdownSetDate', new Date().getTime());
    } else {
        // Comprobar si han pasado más de 5 días
        const setDate = parseInt(localStorage.getItem('countdownSetDate'));
        const now = new Date().getTime();
        const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
        
        if (now - setDate > fiveDaysInMs) {
            // Si han pasado más de 5 días, reiniciar contador
            countdownDate = new Date().getTime() + 25 * 60 * 1000;
            localStorage.setItem('countdownEndTime', countdownDate);
            localStorage.setItem('countdownSetDate', new Date().getTime());
        } else {
            countdownDate = parseInt(savedTime);
        }
    }
    
    // Actualizar el contador cada segundo
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');
    
    const countdownTimer = setInterval(function() {
        // Obtener la fecha y hora actuales
        const now = new Date().getTime();
        
        // Calcular la distancia entre ahora y la cuenta regresiva
        const distance = countdownDate - now;
        
        // Cálculos de tiempo para minutos y segundos
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Mostrar el resultado con formato de dos dígitos
        minutesElement.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsElement.textContent = seconds < 10 ? '0' + seconds : seconds;
        
        // Si la cuenta regresiva ha terminado, reiniciarla
        if (distance < 0) {
            clearInterval(countdownTimer);
            countdownDate = new Date().getTime() + 25 * 60 * 1000;
            localStorage.setItem('countdownEndTime', countdownDate);
            setupCountdown(); // Reiniciar contador
        }
    }, 1000);
}

// Slider de testimonios mejorado
function setupTestimonialsSlider() {
    const testimonialsContainer = document.querySelector('.testimonials-container');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const dotsContainer = document.querySelector('.slider-dots');
    
    // Variables para el slider
    let cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginLeft) + parseInt(window.getComputedStyle(cards[0]).marginRight);
    let cardsPerView = calculateCardsPerView();
    let currentPosition = 0;
    let maxPosition = cards.length - cardsPerView;
    let autoplayInterval;
    
    // Crear puntos indicadores
    for (let i = 0; i < maxPosition + 1; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            moveToPosition(i);
        });
        dotsContainer.appendChild(dot);
    }
    
    // Actualizar dots
    function updateDots() {
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPosition);
        });
    }
    
    // Calcular cuántas tarjetas caben en la vista
    function calculateCardsPerView() {
        const sliderWidth = document.querySelector('.testimonials-slider').offsetWidth;
        return Math.max(1, Math.floor(sliderWidth / cardWidth));
    }
    
    // Mover a posición específica
    function moveToPosition(position) {
        if (position < 0) position = 0;
        if (position > maxPosition) position = maxPosition;
        
        currentPosition = position;
        const translateX = -position * cardWidth;
        testimonialsContainer.style.transform = `translateX(${translateX}px)`;
        updateDots();
    }
    
    // Event listeners para las flechas
    prevArrow.addEventListener('click', () => {
        moveToPosition(currentPosition - 1);
        resetAutoplay();
    });
    
    nextArrow.addEventListener('click', () => {
        moveToPosition(currentPosition + 1);
        resetAutoplay();
    });
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (currentPosition >= maxPosition) {
                moveToPosition(0);
            } else {
                moveToPosition(currentPosition + 1);
            }
        }, 5000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Pausa en hover
    testimonialsContainer.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    testimonialsContainer.addEventListener('mouseleave', () => {
        startAutoplay();
    });
    
    // Ajustar al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginLeft) + parseInt(window.getComputedStyle(cards[0]).marginRight);
        cardsPerView = calculateCardsPerView();
        maxPosition = cards.length - cardsPerView;
        
        // Recrear los puntos
        dotsContainer.innerHTML = '';
        for (let i = 0; i < maxPosition + 1; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === currentPosition) dot.classList.add('active');
            dot.addEventListener('click', () => {
                moveToPosition(i);
            });
            dotsContainer.appendChild(dot);
        }
        
        // Ajustar posición actual si es necesario
        if (currentPosition > maxPosition) {
            moveToPosition(maxPosition);
        } else {
            moveToPosition(currentPosition);
        }
    });
    
    // Iniciar autoplay
    startAutoplay();
}

// Configuración para el video
function setupVideoListener() {
    const videoContainer = document.querySelector('.video-container');
    
    if (videoContainer) {
        // Animación suave al cargar la página
        setTimeout(() => {
            videoContainer.style.opacity = '1';
        }, 300);
        
        // Detectar cuando el video entra en la vista
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    videoContainer.classList.add('in-view');
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(videoContainer);
    }
}

// Efecto para el certificado
function setupCertificateEffect() {
    const certificateContainer = document.querySelector('.certificate-container');
    
    if (certificateContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    certificateContainer.classList.add('animate');
                    setTimeout(() => {
                        const overlay = certificateContainer.querySelector('.certificate-overlay');
                        if (overlay) {
                            overlay.style.transform = 'translateY(0)';
                        }
                    }, 500);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(certificateContainer);
    }
} 