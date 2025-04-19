// Variables globales
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotContainer = document.querySelector('.chatbot-container');
const chatbotGreeting = document.querySelector('.chatbot-greeting');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotMessages = document.querySelector('.chatbot-messages');
const chatbotInput = document.querySelector('.chatbot-input input');
const chatbotSendBtn = document.querySelector('.chatbot-input button');
const chatbotOptions = document.querySelector('.chatbot-options');

// Respuestas predefinidas del chatbot
const botResponses = {
    welcome: "¡Hola! Soy tu Asistente de Barbería. ¿En qué puedo ayudarte hoy?",
    default: "No estoy seguro de entender. ¿Podrías reformular tu pregunta o elegir una de las opciones?",
    curso: "Nuestro curso de barbería profesional incluye 20 módulos con técnicas de corte, cuidado de barba, y todo lo necesario para montar tu propio negocio. ¿Te gustaría conocer más detalles?",
    precio: "La inversión para el curso completo es de solo $47 USD (antes $97). Incluye acceso a todo el contenido, certificación digital y soporte. ¿Te gustaría empezar hoy?",
    duracion: "El curso está diseñado para completarse a tu propio ritmo. La mayoría de nuestros estudiantes lo terminan en 2-3 meses dedicando unas horas por semana. ¿Tienes alguna otra pregunta?",
    certificado: "¡Sí! Al finalizar el curso recibirás un certificado digital que valida tus conocimientos como barbero profesional. Este certificado te ayudará a ganar credibilidad con tus clientes.",
    negocio: "El curso incluye un módulo específico sobre cómo montar tu negocio de barbería, incluyendo equipamiento necesario, precios recomendados, estrategias de marketing y gestión de clientes."
};

// Opciones rápidas para el usuario
const quickOptions = [
    { text: "¿Qué incluye el curso?", response: "curso" },
    { text: "¿Cuánto cuesta?", response: "precio" },
    { text: "Duración del curso", response: "duracion" },
    { text: "¿Hay certificado?", response: "certificado" },
    { text: "Montar mi negocio", response: "negocio" }
];

// Inicializar chatbot
function initChatbot() {
    // Mostrar/ocultar chatbot al hacer clic en el botón
    chatbotToggle.addEventListener('click', toggleChatbot);
    
    // Cerrar chatbot
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
    });
    
    // Enviar mensaje al presionar Enter
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatbotInput.value.trim() !== '') {
            handleUserMessage();
        }
    });
    
    // Enviar mensaje al hacer clic en el botón
    chatbotSendBtn.addEventListener('click', () => {
        if (chatbotInput.value.trim() !== '') {
            handleUserMessage();
        }
    });
    
    // Crear opciones rápidas
    createQuickOptions();
}

// Alternar visibilidad del chatbot
function toggleChatbot() {
    if (chatbotContainer.style.display === 'flex') {
        chatbotContainer.style.display = 'none';
    } else {
        chatbotContainer.style.display = 'flex';
        // Mostrar saludo si no hay mensajes previos
        if (chatbotMessages.childElementCount === 0) {
            addBotMessage(botResponses.welcome);
            // Mostrar saludo temporal que desaparecerá a los 5 segundos
            showGreeting();
        }
    }
}

// Mostrar mensaje de saludo temporal
function showGreeting() {
    chatbotGreeting.style.display = 'block';
    chatbotGreeting.textContent = "¡Hola! ¿Te gustaría aprender barbería profesional? ¡Pregúntame!";
    
    // Desaparecer después de 5 segundos
    setTimeout(() => {
        chatbotGreeting.style.display = 'none';
    }, 5000);
    
    // Desaparecer al hacer clic en cualquier parte
    document.addEventListener('click', function hideGreeting() {
        chatbotGreeting.style.display = 'none';
        document.removeEventListener('click', hideGreeting);
    });
}

// Crear opciones rápidas
function createQuickOptions() {
    chatbotOptions.innerHTML = '';
    quickOptions.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('chatbot-option');
        button.textContent = option.text;
        button.addEventListener('click', () => {
            addUserMessage(option.text);
            setTimeout(() => {
                addBotMessage(botResponses[option.response]);
            }, 500);
        });
        chatbotOptions.appendChild(button);
    });
}

// Manejar mensaje del usuario
function handleUserMessage() {
    const message = chatbotInput.value.trim();
    addUserMessage(message);
    chatbotInput.value = '';
    
    // Procesar mensaje y obtener respuesta
    setTimeout(() => {
        const response = getResponse(message.toLowerCase());
        addBotMessage(response);
    }, 500);
}

// Agregar mensaje del usuario al chat
function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chatbot-message', 'message-user');
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Agregar mensaje del bot al chat
function addBotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chatbot-message', 'message-bot');
    
    // Verificar si el mensaje contiene un CTA y procesarlo
    if (message.includes("¿Te gustaría empezar hoy?")) {
        const textPart = message.split("¿Te gustaría empezar hoy?")[0];
        messageElement.textContent = textPart + "¿Te gustaría empezar hoy?";
        
        const ctaLink = document.createElement('a');
        ctaLink.href = "#cta-final";
        ctaLink.classList.add('chatbot-cta-link');
        ctaLink.textContent = "¡Empezar ahora!";
        
        messageElement.appendChild(document.createElement('br'));
        messageElement.appendChild(ctaLink);
    } else {
        messageElement.textContent = message;
    }
    
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Obtener respuesta basada en el mensaje del usuario
function getResponse(message) {
    if (message.includes("precio") || message.includes("costo") || message.includes("cuánto cuesta") || message.includes("valor")) {
        return botResponses.precio;
    } else if (message.includes("curso") || message.includes("incluye") || message.includes("contenido") || message.includes("qué aprenderé")) {
        return botResponses.curso;
    } else if (message.includes("tiempo") || message.includes("duración") || message.includes("cuánto dura")) {
        return botResponses.duracion;
    } else if (message.includes("certificado") || message.includes("diploma") || message.includes("título")) {
        return botResponses.certificado;
    } else if (message.includes("negocio") || message.includes("empresa") || message.includes("montar") || message.includes("abrir")) {
        return botResponses.negocio;
    } else {
        return botResponses.default;
    }
}

// Funcionalidad para las preguntas frecuentes (FAQ)
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar todas las demás preguntas
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alternar estado activo de la pregunta actual
            item.classList.toggle('active');
        });
    });
}

// Inicializar funcionalidades cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar chatbot si existen los elementos
    if (chatbotToggle && chatbotContainer) {
        initChatbot();
    }
    
    // Inicializar FAQ si existe la sección
    if (document.querySelector('.faq-section')) {
        initFAQ();
    }
    
    // Inicializar cookie banner
    initCookieBanner();
});

// Funcionalidad del banner de cookies
function initCookieBanner() {
    // Comprobar si ya se han aceptado las cookies usando localStorage
    if (!localStorage.getItem('cookiesAceptadas')) {
        // Mostrar el banner de cookies
        const cookieBanner = document.getElementById('cookie-banner');
        if (cookieBanner) {
            cookieBanner.style.display = 'block';
        }
    }
    
    // Evento para el botón de aceptar cookies
    const btnAceptarCookies = document.getElementById('aceptar-cookies');
    if (btnAceptarCookies) {
        btnAceptarCookies.addEventListener('click', function() {
            // Guardar preferencia en localStorage
            localStorage.setItem('cookiesAceptadas', 'true');
            
            // Ocultar el banner
            const cookieBanner = document.getElementById('cookie-banner');
            if (cookieBanner) {
                cookieBanner.style.display = 'none';
            }
        });
    }
} 