/**
 * Script de seguimiento analítico para Aprende Barbería y Monta tu Negocio
 * Este script configura el seguimiento de eventos para Google Analytics
 */

// Inicializar variables de seguimiento
let checkoutStarted = false;
let checkoutCompleted = false;
let pageEntryTime = new Date();
let lastInteractionTime = new Date();

// Función para inicializar el seguimiento analítico
function initAnalytics() {
    // Verificar si Google Analytics está presente
    if (typeof gtag !== 'function') {
        console.warn('Google Analytics no está configurado correctamente');
        return;
    }
    
    console.log('Inicializando sistema de seguimiento analítico...');
    
    // Registrar vista de página con información adicional
    trackPageView();
    
    // Configurar seguimiento de eventos
    setupEventTracking();
    
    // Configurar seguimiento de checkout
    setupCheckoutTracking();
    
    // Configurar seguimiento de interacción
    setupInteractionTracking();
    
    // Configurar seguimiento de tiempo en página
    setupTimeTracking();
}

// Función para registrar vista de página
function trackPageView() {
    // Crear objeto de datos de página
    const pageData = {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        landing_page: isLandingPage(),
        referrer: document.referrer || 'direct',
        timestamp: new Date().toISOString()
    };
    
    // Enviar evento de vista de página
    gtag('event', 'page_view', pageData);
    
    console.log('Vista de página registrada:', pageData.page_path);
}

// Función para determinar si es la página de aterrizaje principal
function isLandingPage() {
    return window.location.pathname === '/' || 
           window.location.pathname === '/index.html';
}

// Configurar seguimiento de eventos generales
function setupEventTracking() {
    // Seguimiento de clics en CTA principales
    document.querySelectorAll('.cta-button, .cta-nav-button, .btn-buy').forEach(button => {
        button.addEventListener('click', function() {
            gtag('event', 'click', {
                'event_category': 'CTA',
                'event_label': this.textContent.trim(),
                'button_location': getElementLocation(this)
            });
            console.log('Clic en CTA registrado:', this.textContent.trim());
        });
    });
    
    // Seguimiento de reproducciones de video
    const videoContainer = document.querySelector('.video-container iframe');
    if (videoContainer) {
        // Crear un MutationObserver para detectar cuando el video se ha cargado
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    gtag('event', 'video_loaded', {
                        'event_category': 'Video',
                        'event_label': 'Video de presentación cargado'
                    });
                    console.log('Carga de video registrada');
                    
                    // Una vez detectada la carga, desconectar el observer
                    observer.disconnect();
                }
            });
        });
        
        // Iniciar la observación
        observer.observe(videoContainer, { attributes: true });
    }
    
    // Seguimiento de secciones vistas (usando Intersection Observer)
    setupSectionTracking();
}

// Configurar seguimiento de secciones vistas
function setupSectionTracking() {
    // Array para almacenar secciones ya registradas
    const trackedSections = [];
    
    // Crear un observer para las secciones
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si la sección está visible y no ha sido registrada antes
            if (entry.isIntersecting) {
                const sectionId = entry.target.id || 'unknown';
                
                // Verificar si ya registramos esta sección
                if (!trackedSections.includes(sectionId)) {
                    trackedSections.push(sectionId);
                    
                    gtag('event', 'section_view', {
                        'event_category': 'Content',
                        'event_label': `Sección: ${sectionId}`,
                        'non_interaction': true
                    });
                    
                    console.log('Sección vista registrada:', sectionId);
                }
            }
        });
    }, { threshold: 0.6 }); // 60% de la sección debe ser visible
    
    // Observar todas las secciones principales
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
}

// Configurar seguimiento de checkout
function setupCheckoutTracking() {
    // Buscar botones relacionados con checkout/compra
    document.querySelectorAll('a[href*="checkout"], .btn-buy, a[href*="hotm.art"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Marcar inicio de checkout
            checkoutStarted = true;
            
            gtag('event', 'begin_checkout', {
                'event_category': 'Checkout',
                'event_label': this.textContent.trim(),
                'checkout_step': 1,
                'checkout_option': getCheckoutOption()
            });
            
            // También enviar evento estándar de ecommerce
            gtag('event', 'begin_checkout', {
                currency: 'USD',
                value: 47.00,
                items: [{
                    item_id: 'curso-barberia',
                    item_name: 'Curso Completo de Barbería Profesional',
                    price: 47.00,
                    quantity: 1
                }]
            });
            
            console.log('Inicio de checkout registrado');
            
            // Almacenar en localStorage para seguimiento entre páginas
            localStorage.setItem('checkoutStarted', 'true');
            localStorage.setItem('checkoutStartTime', new Date().toISOString());
        });
    });
    
    // Verificar si estamos en una página de confirmación de compra
    if (window.location.href.includes('gracias') || 
        window.location.href.includes('thanks') || 
        window.location.href.includes('success')) {
        
        // Si teníamos un checkout iniciado, registrar como completado
        if (localStorage.getItem('checkoutStarted') === 'true') {
            checkoutCompleted = true;
            
            gtag('event', 'purchase', {
                'event_category': 'Checkout',
                'event_label': 'Compra completada',
                'checkout_step': 'final',
                transaction_id: generateTransactionId(),
                value: 47.00,
                currency: 'USD',
                shipping: 0,
                tax: 0
            });
            
            console.log('Compra completada registrada');
            
            // Limpiar localStorage
            localStorage.removeItem('checkoutStarted');
            localStorage.removeItem('checkoutStartTime');
        }
    }
    
    // Configurar seguimiento de abandono
    setupAbandonTracking();
}

// Configurar seguimiento de abandono de checkout
function setupAbandonTracking() {
    // Evento al cerrar la página o navegar fuera
    window.addEventListener('beforeunload', function() {
        // Si el checkout se inició pero no se completó
        if (checkoutStarted && !checkoutCompleted) {
            gtag('event', 'checkout_abandon', {
                'event_category': 'Checkout',
                'event_label': 'Abandono de checkout',
                'checkout_time': getCheckoutTimeElapsed()
            });
            
            console.log('Abandono de checkout registrado');
            
            // No es necesario limpiar localStorage aquí, ya que la página se está cerrando
        }
    });
}

// Seguimiento de interacciones con elementos
function setupInteractionTracking() {
    // Seguimiento de interacciones con el acordeón
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const moduleTitle = this.querySelector('h3').textContent.trim();
            
            gtag('event', 'module_click', {
                'event_category': 'Content',
                'event_label': moduleTitle
            });
            
            console.log('Interacción con módulo registrada:', moduleTitle);
            updateLastInteraction();
        });
    });
    
    // Seguimiento de interacciones con el chatbot
    document.querySelectorAll('.chatbot-toggle, .chatbot-input button').forEach(element => {
        element.addEventListener('click', function() {
            const action = this.classList.contains('chatbot-toggle') ? 'open' : 'message';
            
            gtag('event', `chatbot_${action}`, {
                'event_category': 'Engagement',
                'event_label': `Chatbot ${action === 'open' ? 'abierto' : 'mensaje enviado'}`
            });
            
            console.log(`Interacción con chatbot (${action}) registrada`);
            updateLastInteraction();
        });
    });
    
    // Seguimiento de scrolling profundo
    setupScrollTracking();
}

// Seguimiento de scroll profundo
function setupScrollTracking() {
    let maxScrollPercentage = 0;
    let scrollThresholds = [25, 50, 75, 90, 100];
    let reachedThresholds = Array(scrollThresholds.length).fill(false);
    
    // Calcula el porcentaje de scroll
    function getScrollPercentage() {
        const windowHeight = window.innerHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        return Math.floor((scrollTop / (documentHeight - windowHeight)) * 100);
    }
    
    // Verifica los umbrales alcanzados
    function checkScrollThresholds() {
        const currentScroll = getScrollPercentage();
        maxScrollPercentage = Math.max(maxScrollPercentage, currentScroll);
        
        scrollThresholds.forEach((threshold, index) => {
            if (!reachedThresholds[index] && maxScrollPercentage >= threshold) {
                reachedThresholds[index] = true;
                
                gtag('event', 'scroll_depth', {
                    'event_category': 'Engagement',
                    'event_label': `Scroll ${threshold}%`,
                    'non_interaction': true
                });
                
                console.log(`Profundidad de scroll registrada: ${threshold}%`);
            }
        });
    }
    
    // Usar un debounce para no enviar demasiados eventos
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkScrollThresholds, 200);
        updateLastInteraction();
    });
}

// Seguimiento de tiempo en página
function setupTimeTracking() {
    const timeIntervals = [30, 60, 120, 300, 600]; // Segundos
    const intervalIds = [];
    
    timeIntervals.forEach(seconds => {
        const id = setTimeout(() => {
            gtag('event', 'time_on_page', {
                'event_category': 'Engagement',
                'event_label': `${seconds} segundos en página`,
                'non_interaction': true
            });
            
            console.log(`Tiempo en página registrado: ${seconds} segundos`);
        }, seconds * 1000);
        
        intervalIds.push(id);
    });
    
    // Limpiar intervals al salir
    window.addEventListener('beforeunload', function() {
        intervalIds.forEach(id => clearTimeout(id));
        
        // Registrar tiempo total en página
        const totalTime = Math.floor((new Date() - pageEntryTime) / 1000);
        gtag('event', 'total_time', {
            'event_category': 'Engagement',
            'event_label': 'Tiempo total en página',
            'value': totalTime
        });
        
        console.log(`Tiempo total en página: ${totalTime} segundos`);
    });
}

// Funciones auxiliares
function getElementLocation(element) {
    // Intentar encontrar el ID o clase del contenedor padre
    let parent = element.closest('section');
    if (parent && parent.id) {
        return parent.id;
    }
    
    // Si no hay un ID de sección, obtener la posición aproximada
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = Math.floor(((rect.top + scrollTop) / document.body.scrollHeight) * 100);
    
    return `position_${scrollPercentage}%`;
}

function getCheckoutOption() {
    // Determine el tipo de checkout (desde CTA, desde menú, etc.)
    if (document.referrer.includes('beneficios')) {
        return 'desde_beneficios';
    } else if (document.referrer.includes('testimonios')) {
        return 'desde_testimonios';
    } else {
        return 'directo';
    }
}

function getCheckoutTimeElapsed() {
    const startTime = localStorage.getItem('checkoutStartTime');
    if (!startTime) return 0;
    
    const start = new Date(startTime);
    const now = new Date();
    
    return Math.floor((now - start) / 1000); // Segundos
}

function generateTransactionId() {
    return 'TR-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function updateLastInteraction() {
    lastInteractionTime = new Date();
}

// Inicializar el seguimiento cuando la página esté completamente cargada
document.addEventListener('DOMContentLoaded', initAnalytics);

// Exportar funciones para uso externo
window.analyticsTracker = {
    trackEvent: function(category, action, label) {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
        console.log(`Evento personalizado registrado: ${category} - ${action} - ${label}`);
    },
    
    trackCheckoutComplete: function() {
        checkoutCompleted = true;
        gtag('event', 'purchase', {
            'event_category': 'Checkout',
            'event_label': 'Compra completada (manual)',
            transaction_id: generateTransactionId(),
            value: 47.00,
            currency: 'USD'
        });
        console.log('Compra completada registrada (manual)');
    }
}; 