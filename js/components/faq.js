document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todas las preguntas y respuestas
    const faqQuestions = document.querySelectorAll('.faq-question');
    const faqAnswers = document.querySelectorAll('.faq-answer');
    
    // Función para cerrar todas las respuestas
    function closeAllAnswers() {
        faqAnswers.forEach(answer => {
            answer.classList.remove('active');
            answer.style.maxHeight = '0px';
        });
        
        faqQuestions.forEach(question => {
            question.classList.remove('active');
        });
    }
    
    // Inicialmente, cerrar todas las respuestas
    closeAllAnswers();
    
    // Añadir escuchadores de eventos a cada pregunta
    faqQuestions.forEach((question, index) => {
        // Añadir ícono + a cada pregunta
        if (!question.querySelector('.faq-icon')) {
            const icon = document.createElement('span');
            icon.className = 'faq-icon';
            icon.innerHTML = '+';
            question.appendChild(icon);
        }
        
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            
            // Si la respuesta ya está activa, la cerramos
            if (answer.classList.contains('active')) {
                answer.classList.remove('active');
                answer.style.maxHeight = '0px';
                this.classList.remove('active');
            } else {
                // Cerrar todas las respuestas primero
                closeAllAnswers();
                
                // Abrir la respuesta correspondiente
                answer.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                this.classList.add('active');
            }
        });
    });
}); 