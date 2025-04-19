// Funciones principales del sitio
document.addEventListener('DOMContentLoaded', function() {
    setupCountdown();
    setupVideoListener();
    setupCertificateEffect();
    initBenefitsSlider();
    initAccordion();
    initTestimonials();
    initCookieBanner();
    setupMobileMenu();
});

// Smooth scrolling para los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        let targetId = this.getAttribute('href');
        
        // Redirección específica para botones CTA
        if (this.classList.contains('cta-nav-button')) {
            targetId = '#cta-final';
        }
        
        // Si el targetId es solo "#", evitar el error de selector inválido
        if (targetId === "#") return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
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
    
    // Comprobación de que floatingWidget existe
    if (!floatingWidget) return;
    
    // Mostrar widget solo después de scrollear 300px
    if (scrollTop > 300) {
        floatingWidget.style.display = 'block';
        
        // Ocultar widget cuando se llega al CTA final
        const ctaFinal = document.getElementById('cta-final');
        if (ctaFinal) {
            const ctaRect = ctaFinal.getBoundingClientRect();
            
            if (ctaRect.top < window.innerHeight && ctaRect.bottom > 0) {
                floatingWidget.style.display = 'none';
            }
        }
    } else {
        floatingWidget.style.display = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// Inicialmente ocultar el widget
document.addEventListener('DOMContentLoaded', () => {
    // Comprobación de que floatingWidget existe
    if (floatingWidget) {
        floatingWidget.style.display = 'none';
    }
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
    
    if (!minutesElement || !secondsElement) return;
    
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
    
    // Función para posicionar el contador debajo del chat si está abierto
    function positionCountdown() {
        const chatbotContainer = document.querySelector('.chatbot-container');
        const countdownContainer = document.querySelector('.countdown-container');
        
        if (!countdownContainer) return;
        
        // Verificar si el chat está abierto (tiene display flex)
        if (chatbotContainer && chatbotContainer.style.display === 'flex') {
            // Posicionar el contador debajo del chat
            countdownContainer.style.top = 'auto';
            countdownContainer.style.bottom = '20px';
            countdownContainer.style.right = '20px';
            countdownContainer.style.transform = 'none';
        } else {
            // Posición en el centro vertical a la derecha
            countdownContainer.style.top = '50%';
            countdownContainer.style.bottom = 'auto';
            countdownContainer.style.right = '20px';
            countdownContainer.style.transform = 'translateY(-50%)';
        }
    }
    
    // Verificar la posición inicialmente
    positionCountdown();
    
    // Observar el estado del chat
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotClose = document.querySelector('.chatbot-close');
    
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', positionCountdown);
    }
    
    if (chatbotClose) {
        chatbotClose.addEventListener('click', positionCountdown);
    }
    
    // Además, verificar periódicamente (para cubrir otros casos)
    setInterval(positionCountdown, 1000);
}

// Slider de beneficios
function initBenefitsSlider() {
    const benefitsSlider = document.querySelector('.benefits-slider');
    const benefitsContainer = document.querySelector('.benefits-slider-container');
    const slides = document.querySelectorAll('.benefit-slide');
    const dotsContainer = document.querySelector('.benefits-dots');
    
    if (!benefitsContainer || !slides.length) return;
    
    let currentSlide = 0;
    const slidesCount = slides.length;
    let autoplayInterval;
    
    // Crear los puntos indicadores
    for (let i = 0; i < slidesCount; i++) {
        const dot = document.createElement('span');
        dot.classList.add('benefit-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // Función para ir a una diapositiva específica
    function goToSlide(slideIndex) {
        if (slideIndex < 0) slideIndex = slidesCount - 1;
        if (slideIndex >= slidesCount) slideIndex = 0;
        
        currentSlide = slideIndex;
        
        benefitsContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Actualizar los puntos indicadores
        document.querySelectorAll('.benefit-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Función para ir a la siguiente diapositiva
    function nextSlide() {
        // Si es la última diapositiva, volver a la primera
        if (currentSlide === slidesCount - 1) {
            goToSlide(0);
        } else {
            goToSlide(currentSlide + 1);
        }
    }
    
    // Función para ir a la diapositiva anterior
    function prevSlide() {
        if (currentSlide === 0) {
            goToSlide(slidesCount - 1);
        } else {
            goToSlide(currentSlide - 1);
        }
    }
    
    // Configurar la reproducción automática
    function startAutoplay() {
        // Usar 6000ms (6 segundos) para el autoplay
        autoplayInterval = setInterval(nextSlide, 6000);
    }
    
    // Detener la reproducción automática
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Pausar la reproducción automática cuando el mouse está sobre el slider
    benefitsSlider.addEventListener('mouseenter', stopAutoplay);
    benefitsSlider.addEventListener('mouseleave', startAutoplay);
    
    // Iniciar la reproducción automática
    startAutoplay();
    
    // Mostrar la primera diapositiva
    goToSlide(0);
}

// Slider de testimonios mejorado
function setupTestimonialsSlider() {
    const testimonialsContainer = document.querySelector('.testimonials-container');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (!testimonialsContainer || !cards.length) return;
    
    let currentPosition = 0;
    let autoplayInterval;
    
    // Mostrar solo la tarjeta actual y ocultar las demás
    function showCard(index) {
        cards.forEach((card, idx) => {
            if (idx === index) {
                card.style.opacity = '1';
                card.style.display = 'block';
            } else {
                card.style.opacity = '0';
                card.style.display = 'none';
            }
        });
    }
    
    // Inicialmente mostrar solo la primera tarjeta
    showCard(0);
    
    // Función para avanzar al siguiente testimonio
    function nextTestimonial() {
        currentPosition = (currentPosition + 1) % cards.length;
        showCard(currentPosition);
    }
    
    // Iniciar autoplay
    function startAutoplay() {
        // Limpiar cualquier intervalo existente
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        
        // Establecer un nuevo intervalo de 10 segundos
        autoplayInterval = setInterval(nextTestimonial, 10000);
    }
    
    // Iniciar autoplay al cargar
    startAutoplay();
}

// Configuración para el video
function setupVideoListener() {
    const videoContainer = document.querySelector('.video-container');
    const videoIframe = videoContainer ? videoContainer.querySelector('iframe') : null;
    
    if (videoContainer && videoIframe) {
        // Animación suave al cargar la página
        setTimeout(() => {
            videoContainer.style.opacity = '1';
        }, 300);
        
        // Detectar cuando el video entra en la vista
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    videoContainer.classList.add('in-view');
                    
                    // Asegurarse que los parámetros correctos estén en el src del iframe
                    const currentSrc = videoIframe.getAttribute('src');
                    if (!currentSrc.includes('autoplay=1')) {
                        // Actualizar el src para asegurar reproducción automática con silencio
                        // y sin bucle (reproduciéndose solo una vez)
                        const videoId = currentSrc.split('/').pop().split('?')[0];
                        const newSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=0&playlist=${videoId}&controls=1`;
                        videoIframe.setAttribute('src', newSrc);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(videoContainer);
        
        // Manejar eventos de redimensionamiento para dispositivos
        window.addEventListener('resize', () => {
            // Ajustar la altura del iframe proporcionalmente al ancho para mantener la relación de aspecto
            const containerWidth = videoContainer.clientWidth;
            const aspectRatio = 9/16; // Relación de aspecto estándar para videos (16:9)
            const height = containerWidth * aspectRatio;
            
            videoIframe.style.height = `${height}px`;
        });
        
        // Inicializar tamaño en carga
        const containerWidth = videoContainer.clientWidth;
        const aspectRatio = 9/16;
        const height = containerWidth * aspectRatio;
        videoIframe.style.height = `${height}px`;
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

// Chatbot functionality
function setupChatbot() {
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotGreeting = document.querySelector('.chatbot-greeting');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotOptions = document.querySelectorAll('.chatbot-option');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotSendBtn = document.querySelector('.chatbot-input button');
    const chatbotHeader = document.querySelector('.chatbot-header h3');
    const countdownContainer = document.querySelector('.countdown-container');
    
    // Cambiar el nombre del asistente
    if (chatbotHeader) {
        chatbotHeader.textContent = "Tu Asistente Digital";
    }

    // Mostrar el saludo después de 3 segundos
    setTimeout(() => {
        chatbotGreeting.style.display = 'block';
        
        // Ocultar el saludo después de 5 segundos
        setTimeout(() => {
            chatbotGreeting.style.display = 'none';
        }, 5000);
    }, 3000);

    // Abrir/cerrar chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotGreeting.style.display = 'none';
        chatbotContainer.style.display = 'flex';
        
        // Ajustar la posición del contador regresivo
        if (countdownContainer) {
            countdownContainer.style.bottom = '20px';
            countdownContainer.style.right = '20px';
        }
        
        // Vaciar los mensajes existentes para evitar duplicados
        chatbotMessages.innerHTML = '';
        
        // Mostrar efecto de "está escribiendo..."
        showTypingEffect().then(() => {
            // Enviar saludo inicial (solo uno)
            addMessage("¡Hola! 👋 ¿En qué puedo ayudarte hoy con tu interés en barbería?", 'bot');
        });
    });

    // Cerrar chatbot
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
        
        // Restaurar la posición del contador regresivo
        if (countdownContainer) {
            countdownContainer.style.bottom = '20px';
            countdownContainer.style.right = '20px';
        }
    });

    // Función para mostrar efecto de escritura
    function showTypingEffect() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chatbot-message', 'message-bot', 'typing-message');
        typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        chatbotMessages.appendChild(typingDiv);
        
        // Scroll al último mensaje
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Eliminar el efecto después de 1.5 segundos
        return new Promise(resolve => {
            setTimeout(() => {
                typingDiv.remove();
                resolve();
            }, 1500);
        });
    }

    // Función para añadir mensajes al chatbot
    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', `message-${sender}`);
        messageDiv.innerHTML = message; // Permitir HTML en los mensajes
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll al último mensaje
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Enviar mensaje (por botón)
    chatbotSendBtn.addEventListener('click', sendUserMessage);

    // Enviar mensaje (por Enter)
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

    // Función para enviar mensaje del usuario
    function sendUserMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatbotInput.value = '';
            
            // Simular respuesta del bot después de mostrar "está escribiendo..."
            showTypingEffect().then(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, 'bot');
            });
        }
    }

    // Función para procesar opciones rápidas
    chatbotOptions.forEach(option => {
        option.addEventListener('click', () => {
            const message = option.textContent;
            addMessage(message, 'user');
            
            // Simular respuesta del bot después de mostrar "está escribiendo..."
            showTypingEffect().then(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, 'bot');
            });
        });
    });

    // Función para generar respuestas del bot
    function getBotResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('precio') || message.includes('costo') || message.includes('valor') || message.includes('cuál es el precio')) {
            return '💰 <strong>Oferta Exclusiva:</strong> El curso completo de barbería está ahora a <strong>solo $47</strong> (antes $97) - ¡60% de descuento! <br><br>Incluye +50 horas de contenido HD, certificación profesional, y plan de negocio detallado. <br><br>Y lo mejor: <strong>garantía de satisfacción de 7 días</strong>. Si no estás 100% satisfecho, te devolvemos tu dinero sin preguntas. <br><br><a href="#cta-final" class="chatbot-cta-link">¡APROVECHA ESTA OFERTA AHORA!</a>';
        } else if (message.includes('duración') || message.includes('cuánto dura')) {
            return '⏱️ El curso tiene acceso de por vida. Puedes completarlo a tu propio ritmo, pero está diseñado para que puedas aprender lo básico en unas semanas y comenzar a generar ingresos rápidamente.<br><br><a href="#cta-final" class="chatbot-cta-link">¡QUIERO ACCESO AHORA!</a>';
        } else if (message.includes('certificado') || message.includes('certificación') || message.includes('incluye certificado')) {
            return '🏆 ¡Sí! Al finalizar recibirás un certificado digital profesional que avalará tus conocimientos en barbería. Este certificado es reconocido en el sector y te ayudará a ganar la confianza de tus futuros clientes. <br><br><a href="#certificate" class="chatbot-cta-link">VER EJEMPLO DE CERTIFICADO</a>';
        } else if (message.includes('empez') || message.includes('inici') || message.includes('comenz') || message.includes('cómo empiezo')) {
            return '🚀 <strong>¡Es muy sencillo comenzar!</strong><br><br>1️⃣ Adquiere el curso haciendo clic en el botón de abajo<br>2️⃣ Recibe acceso inmediato a todo el contenido<br>3️⃣ Comienza con los primeros módulos básicos<br>4️⃣ Practica las técnicas mientras avanzas<br>5️⃣ ¡En pocas semanas estarás listo para tus primeros clientes!<br><br>Muchos de nuestros estudiantes recuperan su inversión en solo 1-2 semanas de trabajo.<br><br><a href="#cta-final" class="chatbot-cta-link">¡COMENZAR AHORA!</a>';
        } else if (message.includes('negocio') || message.includes('emprender') || message.includes('montar') || message.includes('cómo montar mi negocio')) {
            return '💼 <strong>¡Tenemos la guía perfecta para ti!</strong><br><br>Nuestro curso incluye un módulo completo dedicado a montar tu propia barbería rentable, con:<br><br>• Estudio de mercado y ubicación<br>• Inversión inicial y equipamiento necesario<br>• Estrategias de captación de clientes<br>• Gestión financiera básica<br>• Marketing digital para barberías<br>• Fidelización y clientes recurrentes<br><br>Muchos de nuestros estudiantes recuperan la inversión en el primer mes.<br><br><a href="#cta-final" class="chatbot-cta-link">¡COMENZAR MI NEGOCIO AHORA!</a>';
        } else if (message.includes('garantía')) {
            return '✅ Ofrecemos una garantía de satisfacción de 7 días. Si no estás satisfecho con el contenido del curso, te devolvemos tu dinero sin preguntas ni complicaciones. ¡Así de seguros estamos de la calidad de nuestra formación!<br><br><a href="#cta-final" class="chatbot-cta-link">¡COMPRAR CON GARANTÍA!</a>';
        } else if (message.includes('hola') || message.includes('buenos días') || message.includes('buenas tardes') || message.includes('buenas noches') || message.includes('que tal')) {
            return '👋 ¡Hola! Me alegra que estés interesado en el mundo de la barbería profesional. Estoy aquí para resolver todas tus dudas sobre el curso, contenido, precio o cualquier otra consulta que tengas. ¿En qué puedo ayudarte específicamente hoy?<br><br>¿Qué te gustaría saber? 👇';
        } else {
            return 'Gracias por tu mensaje. Estoy aquí para ayudarte con cualquier duda sobre el curso de barbería profesional. ¿Te gustaría conocer más sobre el contenido, el precio, o cómo podrías empezar? ¡Pregúntame lo que necesites!<br><br>¿Qué te gustaría saber? 👇';
        }
    }
}

// Cookie consent banner
function setupCookieConsent() {
    const cookieBanner = document.querySelector('.cookie-banner');
    const acceptCookiesBtn = document.querySelector('.accept-cookies');
    const rejectCookiesBtn = document.querySelector('.reject-cookies');
    
    // Comprobar si ya se aceptaron/rechazaron las cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    if (cookiesAccepted === null) {
        // Mostrar banner de cookies después de 2 segundos
        setTimeout(() => {
            cookieBanner.style.display = 'block';
        }, 2000);
    }

    // Aceptar cookies
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.style.display = 'none';
        // Aquí podrías inicializar analíticas u otras cookies
    });

    // Rechazar cookies
    rejectCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'false');
        cookieBanner.style.display = 'none';
        // Aquí bloquearías todas las cookies excepto las esenciales
    });
}

// Inicializar acordeón para la sección de módulos
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (!accordionItems.length) return;
    
    // Añadir eventos de click a cada encabezado del acordeón
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.fas');
        
        if (!header || !content) return;
        
        // Por defecto, ocultar el contenido
        content.style.maxHeight = null;
        
        header.addEventListener('click', () => {
            // Verificar si este item está activo
            const isActive = item.classList.contains('active');
            
            // Cerrar todos los items
            accordionItems.forEach(otherItem => {
                const otherContent = otherItem.querySelector('.accordion-content');
                const otherIcon = otherItem.querySelector('.fas');
                
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    
                    if (otherContent) {
                        otherContent.style.maxHeight = null;
                    }
                    
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-chevron-up');
                        otherIcon.classList.add('fa-chevron-down');
                    }
                }
            });
            
            // Alternar el estado del item actual
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
                
                if (icon) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            } else {
                content.style.maxHeight = null;
                
                if (icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    });
    
    // Opcional: Abrir el primer elemento por defecto
    if (accordionItems.length > 0) {
        const firstItem = accordionItems[0];
        const firstContent = firstItem.querySelector('.accordion-content');
        const firstIcon = firstItem.querySelector('.fas');
        
        firstItem.classList.add('active');
        if (firstContent) {
            firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
        }
        if (firstIcon) {
            firstIcon.classList.remove('fa-chevron-down');
            firstIcon.classList.add('fa-chevron-up');
        }
    }
}

// Función para el carrusel de testimonios
function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialTrack = document.querySelector('.testimonials-track');
    
    if (!testimonialCards.length || !testimonialTrack) return;
    
    let currentIndex = 0;
    let testimonialInterval;
    
    // Ocultar todos los testimonios inicialmente
    testimonialCards.forEach(card => {
        card.classList.remove('active');
    });
    
    // Verificar las imágenes de testimonios
    testimonialCards.forEach((card) => {
        const imgContainer = card.querySelector('.testimonial-avatar');
        if (imgContainer) {
            const img = imgContainer.querySelector('img');
            if (img) {
                // Verificar si la imagen existe
                const imgSrc = img.getAttribute('src');
                const testImage = new Image();
                testImage.onload = function() {
                    // La imagen existe, no hacer nada
                };
                testImage.onerror = function() {
                    // La imagen no existe, usar una imagen por defecto
                    img.src = 'img/profile-default.jpg';
                };
                testImage.src = imgSrc;
            }
        }
    });
    
    // Función para mostrar un testimonio específico
    function showTestimonial(index) {
        // Ocultar todos los testimonios
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Mostrar el testimonio actual
        testimonialCards[index].classList.add('active');
    }
    
    // Función para avanzar al siguiente testimonio
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        showTestimonial(currentIndex);
    }
    
    // Iniciar la rotación automática
    function startAutoRotation() {
        // Mostrar el primer testimonio
        showTestimonial(currentIndex);
        
        // Configurar la rotación automática cada 10 segundos
        testimonialInterval = setInterval(nextTestimonial, 10000);
    }
    
    // Iniciar la rotación
    startAutoRotation();
}

// Función para el banner de cookies
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const rejectButton = document.getElementById('reject-cookies');
    
    // Verificar si ya se ha tomado una decisión sobre las cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        // Si no hay decisión previa, mostrar el banner
        if (cookieBanner) {
            cookieBanner.style.display = 'block';
        }
    }
    
    // Evento para aceptar cookies
    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
            // Aquí podrías inicializar servicios que dependen de cookies
            console.log('Cookies aceptadas');
        });
    }
    
    // Evento para rechazar cookies
    if (rejectButton) {
        rejectButton.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'false');
            cookieBanner.style.display = 'none';
            console.log('Cookies rechazadas');
        });
    }
}

// Función para controlar el menú móvil
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    
    if (!menuToggle || !navLinks) return;
    
    // Toggle del menú móvil
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Añadir/quitar scroll del body cuando el menú está abierto
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Cerrar el menú cuando se hace clic en un enlace
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Asegurar que el menú se cierre al hacer clic en cualquier enlace
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
            
            // Si es un enlace interno, manejar el desplazamiento suave
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                // Si el targetId es solo "#", evitar el error de selector inválido
                if (targetId === "#") return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Pequeño retraso para asegurar que el menú se ha cerrado completamente
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            }
        });
    });
    
    // Cerrar el menú cuando se hace clic fuera de él
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Agregar un event listener para cerrar el menú al presionar la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
} 