// Variables globales para el chat
let chatbotContainer;
let chatbotToggle;
let chatbotClose;
let countdownContainer;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar variables
    chatbotContainer = document.querySelector('.chatbot-container');
    chatbotToggle = document.querySelector('.chatbot-toggle');
    chatbotClose = document.querySelector('.chatbot-close');
    countdownContainer = document.querySelector('.countdown-container');
    
    initChatbot();
    adjustCountdownPosition();
});

// Respuestas predefinidas del chatbot
const botResponses = {
    welcome: "Hola, como estas, espero que bien, en que puedo ayudarte el dia de hoy 👇 ",
    default: "No estoy seguro de entender tu pregunta. ¿Podrías reformularla o seleccionar una de las opciones de abajo?",
    precio: "El curso completo de Barbería Profesional tiene un precio de $47 USD (antes $97). Incluye acceso de por vida y todas las actualizaciones. ¡Y además cuenta con una garantía de satisfacción de 7 días! ¿Te gustaría empezar hoy?",
    curso: "El curso incluye +50 horas de contenido en HD, certificado de finalización, plan de negocio paso a paso, y soporte personalizado. Todo lo que necesitas para convertirte en un profesional.",
    certificado: "Sí, al completar el curso recibirás un certificado digital que acredita tus conocimientos como barbero profesional. Es ideal para mostrar a tus clientes y potenciar tu carrera.",
    empezar: "Nuestro curso te ofrece una formación completa de barbería profesional, con técnicas modernas, consejos de expertos y todo lo necesario para montar tu propio negocio. ¡La inversión es mínima comparada con los beneficios que obtendrás!",
    negocio: "Para montar tu negocio de barbería, sigue estos pasos básicos: 1) Adquiere las habilidades técnicas, 2) Consigue el equipo necesario, 3) Define tu modelo de negocio (local o a domicilio), 4) Establece tu marca personal, 5) Implementa estrategias de marketing. ¡Nuestro curso cubre todo esto y mucho más!",
    contacto: "¿Tienes alguna pregunta específica? Puedes contactarnos directamente a través de nuestro email:"
};

// Opciones rápidas
const quickOptions = [
    { text: "¿Cuál es el precio?", response: "precio" },
    { text: "¿Cómo puedo empezar?", response: "empezar" },
    { text: "¿Incluye certificado?", response: "certificado" },
    { text: "¿Cómo montar mi negocio?", response: "negocio" },
    { text: "Contacto", response: "contacto" }
];

// Función principal para inicializar el chatbot
function initChatbot() {
    // Elementos adicionales que necesitamos para el chatbot
    const chatbotGreeting = document.querySelector('.chatbot-greeting');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotOptionsContainer = document.querySelector('.chatbot-options');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotSendBtn = document.querySelector('.chatbot-input button');
    const chatbotHeader = document.querySelector('.chatbot-header h3');
    
    if (!chatbotToggle || !chatbotContainer || !chatbotClose) return;
    
    // Cambiar el nombre del asistente
    if (chatbotHeader) {
        chatbotHeader.textContent = "Tu Asistente de Barbería";
    }
    
    // Añadir eventos
    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', closeChatbot);
    
    // Manejar envío de mensajes
    if (chatbotInput && chatbotSendBtn) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                handleUserMessage();
            }
        });
        
        chatbotSendBtn.addEventListener('click', function() {
            if (chatbotInput.value.trim() !== '') {
                handleUserMessage();
            }
        });
    }
    
    // Crear opciones rápidas
    if (chatbotOptionsContainer) {
        createQuickOptions();
    }
    
    // Mostrar saludo emergente después de 3 segundos
    setTimeout(showGreeting, 3000);
}

// Mostrar/Ocultar el chatbot
function toggleChatbot() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotGreeting = document.querySelector('.chatbot-greeting');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const countdownContainer = document.querySelector('.countdown-container');
    
    if (!chatbotContainer) return;
    
    if (chatbotContainer.style.display === 'flex') {
        // Cerrar el chatbot
        chatbotContainer.style.display = 'none';
        
        // Mover el contador a su posición original (centro vertical a la derecha)
        if (countdownContainer) {
            countdownContainer.style.top = '50%';
            countdownContainer.style.bottom = 'auto';
            countdownContainer.style.right = '20px';
            countdownContainer.style.transform = 'translateY(-50%)';
        }
    } else {
        // Abrir el chatbot
        chatbotContainer.style.display = 'flex';
        
        if (chatbotGreeting) {
            chatbotGreeting.style.display = 'none';
        }
        
        // Mover el contador debajo del chat
        if (countdownContainer) {
            countdownContainer.style.top = 'auto';
            countdownContainer.style.bottom = '20px';
            countdownContainer.style.right = '20px';
            countdownContainer.style.transform = 'none';
        }
        
        // Si no hay mensajes, mostrar efecto de escritura y mensaje de bienvenida
        if (chatbotMessages && chatbotMessages.children.length === 0) {
            showTypingEffect(3000).then(() => {
                addBotMessage(botResponses.welcome);
            });
        }
        
        // Enfocar el campo de entrada
        if (chatbotInput) {
            setTimeout(() => chatbotInput.focus(), 300);
        }
    }
    adjustCountdownPosition();
}

// Cerrar el chatbot
function closeChatbot() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const countdownContainer = document.querySelector('.countdown-container');
    
    if (!chatbotContainer) return;
    
    chatbotContainer.style.display = 'none';
    
    // Mover el contador a su posición original (centro vertical a la derecha)
    if (countdownContainer) {
        countdownContainer.style.top = '50%';
        countdownContainer.style.bottom = 'auto';
        countdownContainer.style.right = '20px';
        countdownContainer.style.transform = 'translateY(-50%)';
    }
    adjustCountdownPosition();
}

// Mostrar saludo emergente
function showGreeting() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotGreeting = document.querySelector('.chatbot-greeting');
    
    if (!chatbotContainer || !chatbotGreeting) return;
    
    // Solo mostrar si el chatbot no está abierto
    if (chatbotContainer.style.display !== 'flex') {
        chatbotGreeting.style.display = 'block';
        
        // Ocultar después de 5 segundos
        setTimeout(hideGreeting, 5000);
        
        // Ocultar al hacer clic en cualquier parte
        document.addEventListener('click', hideGreetingOnce);
    }
}

// Ocultar saludo emergente
function hideGreeting() {
    const chatbotGreeting = document.querySelector('.chatbot-greeting');
    if (!chatbotGreeting) return;
    
    chatbotGreeting.style.display = 'none';
    document.removeEventListener('click', hideGreetingOnce);
}

// Función para ocultar el saludo una sola vez
function hideGreetingOnce() {
    hideGreeting();
    document.removeEventListener('click', hideGreetingOnce);
}

// Mostrar efecto de "escribiendo..." por un tiempo específico
function showTypingEffect(duration = 3000) {
    const chatbotMessages = document.querySelector('.chatbot-messages');
    
    if (!chatbotMessages) return Promise.resolve();
    
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('chatbot-message', 'message-bot', 'typing-message');
    typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatbotMessages.appendChild(typingDiv);
    
    // Scroll al último mensaje
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    // Eliminar el efecto después del tiempo especificado
    return new Promise(resolve => {
        setTimeout(() => {
            typingDiv.remove();
            resolve();
        }, duration);
    });
}

// Crear opciones rápidas
function createQuickOptions() {
    const chatbotOptionsContainer = document.querySelector('.chatbot-options');
    
    if (!chatbotOptionsContainer) return;
    
    // Limpiar el contenedor de opciones
    chatbotOptionsContainer.innerHTML = '';
    
    // Crear los botones para cada opción rápida
    quickOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'chatbot-option';
        button.textContent = option.text;
        
        button.addEventListener('click', function() {
            const chatbotMessages = document.querySelector('.chatbot-messages');
            const chatbotInput = document.querySelector('.chatbot-input input');
            
            if (!chatbotMessages || !chatbotInput) return;
            
            addUserMessage(option.text);
            
            // Mostrar efecto de escritura antes de responder
            showTypingEffect(3000).then(() => {
                const response = botResponses[option.response];
                
                // Añadir la respuesta con los CTAs apropiados
                if (option.response === 'precio') {
                    // Precio con CTA
                    addBotResponseWithCTA(response, 'precio');
                } else if (option.response === 'empezar') {
                    // Empezar con CTA
                    addBotResponseWithCTA(response, 'empezar');
                } else if (option.response === 'certificado') {
                    // Certificado con CTA doble
                    addBotResponseWithCTA(response, 'certificado');
                } else if (option.response === 'negocio') {
                    // Negocio con CTA
                    addBotResponseWithCTA(response, 'negocio');
                } else if (option.response === 'contacto') {
                    // Contacto con enlace de email
                    addBotResponseWithCTA(response, 'contacto');
                } else {
                    // Respuesta estándar
                    addBotMessage(response);
                }
            });
        });
        
        chatbotOptionsContainer.appendChild(button);
    });
}

// Manejar el mensaje del usuario
function handleUserMessage() {
    const chatbotInput = document.querySelector('.chatbot-input input');
    if (!chatbotInput) return;
    
    const message = chatbotInput.value.trim();
    
    // Agregar mensaje del usuario
    addUserMessage(message);
    
    // Limpiar el campo de entrada
    chatbotInput.value = '';
    
    // Mostrar efecto de escritura durante 3 segundos
    showTypingEffect(3000).then(() => {
        // Detectar si es un saludo
        if (isSaludo(message.toLowerCase())) {
            addBotMessage(botResponses.welcome);
        } else {
            // Determinar la respuesta según el mensaje
            const responseType = getResponseType(message.toLowerCase());
            
            // Añadir la respuesta con los CTAs apropiados
            if (responseType === 'precio') {
                addBotResponseWithCTA(botResponses.precio, 'precio');
            } else if (responseType === 'empezar') {
                addBotResponseWithCTA(botResponses.empezar, 'empezar');
            } else if (responseType === 'certificado') {
                addBotResponseWithCTA(botResponses.certificado, 'certificado');
            } else if (responseType === 'negocio') {
                addBotResponseWithCTA(botResponses.negocio, 'negocio');
            } else if (responseType === 'contacto') {
                addBotResponseWithCTA(botResponses.contacto, 'contacto');
            } else {
                addBotMessage(botResponses.default);
            }
        }
    });
}

// Comprobar si el mensaje es un saludo
function isSaludo(message) {
    const saludos = ['hola', 'buenas', 'qué tal', 'que tal', 'saludos', 'hey', 'buenos días', 'buenas tardes', 'buenas noches'];
    return saludos.some(saludo => message.includes(saludo));
}

// Agregar mensaje del usuario al chat
function addUserMessage(message) {
    const chatbotMessages = document.querySelector('.chatbot-messages');
    if (!chatbotMessages) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = 'chatbot-message message-user';
    messageEl.textContent = message;
    
    chatbotMessages.appendChild(messageEl);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Agregar mensaje del bot al chat
function addBotMessage(message) {
    const chatbotMessages = document.querySelector('.chatbot-messages');
    if (!chatbotMessages) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = 'chatbot-message message-bot';
    messageEl.textContent = message;
    
    chatbotMessages.appendChild(messageEl);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Añadir respuesta del bot con CTAs específicos
function addBotResponseWithCTA(message, type) {
    const chatbotMessages = document.querySelector('.chatbot-messages');
    if (!chatbotMessages) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = 'chatbot-message message-bot';
    
    if (type === 'precio') {
        // Mensaje con garantía y CTA
        messageEl.innerHTML = message + '<div class="chatbot-ctas"><a href="#product-pricing" class="chatbot-cta">¡Obtener ahora!</a></div>';
    } else if (type === 'empezar') {
        // Descripción del producto con CTA
        messageEl.innerHTML = message + '<div class="chatbot-ctas"><a href="#product-pricing" class="chatbot-cta">¡Empezar ahora!</a></div>';
    } else if (type === 'certificado') {
        // Mensaje de certificado con dos CTAs
        messageEl.innerHTML = message + '<div class="chatbot-ctas"><a href="#certificate" class="chatbot-cta">Ver certificado</a><a href="#product-pricing" class="chatbot-cta">¡Obtener el curso!</a></div>';
    } else if (type === 'negocio') {
        // Pasos para montar negocio con CTA
        messageEl.innerHTML = message + '<div class="chatbot-ctas"><a href="#product-pricing" class="chatbot-cta">¡Empezar ahora!</a></div>';
    } else if (type === 'contacto') {
        // Contacto con enlace de email
        messageEl.innerHTML = message + '<div class="chatbot-ctas"><a href="mailto:hristiankrasimirov7@gmail.com?subject=APRENDE BARBERÍA Y MONTA TU NEGOCIO" class="chatbot-cta">Enviar email</a></div>';
    }
    
    chatbotMessages.appendChild(messageEl);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Obtener tipo de respuesta basada en el mensaje del usuario
function getResponseType(message) {
    if (message.includes("precio") || message.includes("costo") || message.includes("cuánto") || message.includes("valor") || message.includes("cuanto") || message.includes("vale")) {
        return "precio";
    } else if (message.includes("empezar") || message.includes("comenzar") || message.includes("comprar") || message.includes("inscribir") || message.includes("iniciar")) {
        return "empezar";
    } else if (message.includes("certificado") || message.includes("diploma") || message.includes("título") || message.includes("titulo")) {
        return "certificado";
    } else if (message.includes("negocio") || message.includes("empresa") || message.includes("barbería") || message.includes("montar") || message.includes("local")) {
        return "negocio";
    } else if (message.includes("contacto") || message.includes("contactar") || message.includes("email") || message.includes("correo") || message.includes("mail")) {
        return "contacto";
    } else {
        return "default";
    }
}

// Agregar ajuste para el contador regresivo
function adjustCountdownPosition() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const countdownContainer = document.querySelector('.countdown-container');
    
    if (!countdownContainer) return;
    
    if (chatbotContainer && chatbotContainer.style.display === 'flex') {
        // Si el chat está abierto, posicionar el contador debajo del chat
        countdownContainer.style.top = 'auto';
        countdownContainer.style.right = '20px';
        countdownContainer.style.transform = 'none';
        countdownContainer.style.bottom = '20px';
    } else {
        // Posición en el centro vertical a la derecha
        countdownContainer.style.top = '50%';
        countdownContainer.style.bottom = 'auto';
        countdownContainer.style.right = '20px';
        countdownContainer.style.transform = 'translateY(-50%)';
    }
} 