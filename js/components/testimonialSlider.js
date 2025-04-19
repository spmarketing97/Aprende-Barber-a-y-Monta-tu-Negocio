// Componente para el slider de testimonios
document.addEventListener('DOMContentLoaded', function() {
    setupTestimonialSlider();
});

function setupTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length === 0) return;
    
    let currentIndex = 0;
    let intervalId;
    
    // Ocultar todos los testimonios excepto el primero
    testimonialCards.forEach((card, index) => {
        if (index !== 0) {
            card.style.display = 'none';
        }
    });
    
    // Función para mostrar el testimonio actual
    function showTestimonial(index) {
        // Ocultar todos los testimonios con fade out
        testimonialCards.forEach(card => {
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        });
        
        // Mostrar el testimonio actual con fade in
        setTimeout(() => {
            testimonialCards[index].style.display = 'block';
            setTimeout(() => {
                testimonialCards[index].style.opacity = '1';
            }, 50);
        }, 300);
        
        currentIndex = index;
    }
    
    // Cambiar al siguiente testimonio
    function nextTestimonial() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= testimonialCards.length) {
            nextIndex = 0;
        }
        
        showTestimonial(nextIndex);
    }
    
    // Agregar estilo a los testimonios
    const style = document.createElement('style');
    style.textContent = `
        .testimonial-card {
            opacity: 1;
            transition: opacity 0.5s ease;
        }
        .testimonials-container {
            position: relative;
            min-height: 350px;
        }
        @media (max-width: 768px) {
            .testimonials-container {
                min-height: 380px;
            }
        }
        @media (max-width: 576px) {
            .testimonials-container {
                min-height: 400px;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Autorotación cada 10 segundos
    function startAutoRotate() {
        intervalId = setInterval(nextTestimonial, 10000);
    }
    
    function stopAutoRotate() {
        clearInterval(intervalId);
    }
    
    // Iniciar la autorotación
    startAutoRotate();
    
    // Eventos táctiles
    const testimonialSlider = document.querySelector('.testimonials-slider');
    testimonialSlider.addEventListener('touchstart', stopAutoRotate, false);
    testimonialSlider.addEventListener('touchend', startAutoRotate, false);
} 