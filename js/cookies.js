// Banner de cookies - Funcionalidad principal
document.addEventListener('DOMContentLoaded', function() {
    initCookieConsent();
});

function initCookieConsent() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const rejectButton = document.getElementById('reject-cookies');
    
    // Si no existen los elementos, salir de la función
    if (!cookieBanner || !acceptButton || !rejectButton) return;
    
    // Comprobar si ya se ha tomado una decisión sobre las cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    // Mostrar banner si no hay decisión
    if (cookiesAccepted === null) {
        cookieBanner.style.display = 'block';
    }
    
    // Configurar cookies de terceros según la preferencia del navegador
    configureCookiePreferences();
    
    // Evento para aceptar cookies
    acceptButton.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.style.display = 'none';
        
        // Permitir cookies si el usuario acepta
        configureCookiePreferences(true);
        
        console.log('Cookies aceptadas');
    });
    
    // Evento para rechazar cookies
    rejectButton.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'false');
        cookieBanner.style.display = 'none';
        
        // Rechazar cookies si el usuario rechaza
        configureCookiePreferences(false);
        
        console.log('Cookies rechazadas');
    });
}

// Gestionar las preferencias de cookies según el navegador
function configureCookiePreferences(accept) {
    try {
        // Si el navegador soporta la API document.cookieStore (Chrome 87+)
        if (window.cookieStore) {
            if (accept === false) {
                // Eliminar todas las cookies no esenciales
                window.cookieStore.getAll().then(cookies => {
                    cookies.forEach(cookie => {
                        // No eliminar cookies esenciales
                        if (!isEssentialCookie(cookie.name)) {
                            window.cookieStore.delete(cookie.name);
                        }
                    });
                });
            }
        } else {
            // Método alternativo para navegadores sin cookieStore API
            if (accept === false) {
                const cookies = document.cookie.split(';');
                cookies.forEach(cookie => {
                    const cookiePart = cookie.trim().split('=')[0];
                    if (!isEssentialCookie(cookiePart)) {
                        document.cookie = `${cookiePart}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    }
                });
            }
        }
        
        // Informar a Chrome sobre la elección del usuario respecto a cookies de terceros
        if (navigator.cookiePolicy && typeof navigator.cookiePolicy.set === 'function') {
            const preference = accept === true ? 'allow-all' : 'reject-third-party';
            navigator.cookiePolicy.set({ preference: preference });
        }
    } catch (error) {
        console.log('Error al configurar cookies:', error);
    }
}

// Determinar si una cookie es esencial para el funcionamiento del sitio
function isEssentialCookie(cookieName) {
    // Lista de cookies esenciales que no se deben eliminar
    const essentialCookies = [
        'countdownEndTime',
        'countdownSetDate',
        'cookiesAccepted'
    ];
    
    return essentialCookies.includes(cookieName);
}

// Utilidades para manipular cookies
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
} 