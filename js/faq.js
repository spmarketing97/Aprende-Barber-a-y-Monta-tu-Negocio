document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los elementos de preguntas
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Añadir evento de clic a cada pregunta
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Obtener el elemento de respuesta asociado a esta pregunta
            const answer = this.nextElementSibling;
            
            // Comprobar si la pregunta actual está activa
            const isActive = this.classList.contains('active');
            
            // Cerrar todas las respuestas y desactivar preguntas
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Si la pregunta no estaba activa, activarla y mostrar su respuesta
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
    
    // Inicialmente, mostrar la primera respuesta
    if (faqQuestions.length > 0) {
        faqQuestions[0].classList.add('active');
        faqQuestions[0].nextElementSibling.classList.add('active');
    }
}); 