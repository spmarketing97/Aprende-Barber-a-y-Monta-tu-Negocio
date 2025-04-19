// Componente para el banner de cookies
document.addEventListener('DOMContentLoaded', function() {
    setupCookieBanner();
});

function setupCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const rejectCookiesBtn = document.getElementById('reject-cookies');
    
    // Comprobar si ya se ha aceptado o rechazado las cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    // Si no hay decisión previa, mostrar el banner
    if (cookiesAccepted === null) {
        setTimeout(() => {
            cookieBanner.classList.add('active');
        }, 2000); // Mostrar después de 2 segundos
    }
    
    // Manejar el clic en el botón de aceptar
    acceptCookiesBtn.addEventListener('click', function() {
        acceptCookies();
    });
    
    // Manejar el clic en el botón de rechazar
    rejectCookiesBtn.addEventListener('click', function() {
        rejectCookies();
    });
    
    // Función para aceptar cookies
    function acceptCookies() {
        localStorage.setItem('cookiesAccepted', 'true');
        localStorage.setItem('cookieDecision', 'accepted');
        cookieBanner.classList.remove('active');
        
        // Aquí se activarían las cookies analíticas y de terceros
        console.log('Cookies aceptadas');
    }
    
    // Función para rechazar cookies
    function rejectCookies() {
        localStorage.setItem('cookiesAccepted', 'true');
        localStorage.setItem('cookieDecision', 'rejected');
        cookieBanner.classList.remove('active');
        
        console.log('Cookies rechazadas');
    }
} 