// Componente para el acordeón
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los elementos de preguntas del acordeón
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Añadir listener de click a cada pregunta
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Obtener el elemento de respuesta asociado a esta pregunta
            const answer = this.nextElementSibling;
            
            // Comprobar si este elemento está activo
            const isActive = this.classList.contains('active');
            
            // Cerrar todas las respuestas abiertas
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Si el elemento no estaba activo, abrirlo
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
    
    // Abrir la primera pregunta por defecto
    if (faqQuestions.length > 0) {
        faqQuestions[0].classList.add('active');
        faqQuestions[0].nextElementSibling.classList.add('active');
    }
}); 