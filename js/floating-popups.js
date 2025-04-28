// Datos de los popups
const popupData = [
    { name: "Carlos M.", rating: 5, message: "¡Excelente curso! Ya tengo mi propia barbería.", time: "hace 2 minutos", avatar: "testimonials/testimonial1.jpg" },
    { name: "Miguel A.", rating: 5, message: "Mejor inversión que he hecho en mi carrera.", time: "hace 5 minutos", avatar: "testimonials/testimonial2.jpg" },
    { name: "Alejandro R.", rating: 5, message: "Gracias por compartir tus conocimientos.", time: "hace 8 minutos", avatar: "testimonials/testimonial3.jpg" },
    { name: "Fernando T.", rating: 5, message: "Empecé desde cero y ahora soy profesional.", time: "hace 12 minutos", avatar: "testimonials/testimonial4.jpg" },
    { name: "Daniel S.", rating: 5, message: "Increíbles técnicas de corte y degradado.", time: "hace 15 minutos", avatar: "testimonials/testimonial5.jpg" },
    { name: "Pablo H.", rating: 5, message: "Ya tengo clientes fijos gracias al curso.", time: "hace 18 minutos", avatar: "testimonials/testimonial6.jpg" },
    { name: "Roberto D.", rating: 5, message: "Lo recomiendo 100%. Vale cada centavo.", time: "hace 22 minutos", avatar: "testimonials/testimonial7.jpg" },
    { name: "Javier G.", rating: 5, message: "Excelente atención y soporte continuo.", time: "hace 25 minutos", avatar: "testimonials/testimonial8.jpeg" },
    { name: "Andrés V.", rating: 5, message: "Aprendí a gestionar mi negocio eficientemente.", time: "hace 30 minutos", avatar: "testimonials/testimonial9.jpeg" },
    { name: "Martín A.", rating: 5, message: "Mi barbería ya está generando ganancias.", time: "hace 33 minutos", avatar: "testimonials/testimonial10.jpeg" },
    { name: "Santiago M.", rating: 5, message: "Formación completa y práctica. ¡Gracias!", time: "hace 37 minutos", avatar: "testimonials/testimonial11.jpeg" },
    { name: "Eduardo C.", rating: 5, message: "Clientes fascinados con mis nuevas técnicas.", time: "hace 40 minutos", avatar: "testimonials/testimonial12.jpeg" },
    { name: "Raúl J.", rating: 5, message: "Recuperé la inversión en tiempo récord.", time: "hace 45 minutos", avatar: "testimonials/testimonial13.jpeg" },
    { name: "Luis P.", rating: 5, message: "Curso completo y fácil de entender.", time: "hace 48 minutos", avatar: "testimonials/testimonial1.jpg" },
    { name: "Héctor G.", rating: 5, message: "Técnicas avanzadas explicadas paso a paso.", time: "hace 52 minutos", avatar: "testimonials/testimonial2.jpg" },
    { name: "Manuel D.", rating: 5, message: "Ahora tengo clientes que me buscan a mí.", time: "hace 55 minutos", avatar: "testimonials/testimonial3.jpg" },
    { name: "Ricardo V.", rating: 5, message: "Increíble comunidad de apoyo entre alumnos.", time: "hace 58 minutos", avatar: "testimonials/testimonial4.jpg" },
    { name: "Gonzalo L.", rating: 5, message: "Material de primera calidad, muy didáctico.", time: "hace 1 hora", avatar: "testimonials/testimonial5.jpg" },
    { name: "Julián R.", rating: 5, message: "Excelente relación calidad-precio.", time: "hace 1 hora", avatar: "testimonials/testimonial6.jpg" },
    { name: "Francisco T.", rating: 5, message: "Curso profesional con certificación incluida.", time: "hace 1 hora", avatar: "testimonials/testimonial7.jpg" },
    { name: "Leo M.", rating: 5, message: "Pude abrir mi barbería en solo 3 meses.", time: "hace 1 hora", avatar: "testimonials/testimonial8.jpeg" },
    { name: "Oscar S.", rating: 5, message: "Conocimientos valiosos de gestión empresarial.", time: "hace 1 hora", avatar: "testimonials/testimonial9.jpeg" },
    { name: "Antonio B.", rating: 5, message: "Técnicas actualizadas y tendencias modernas.", time: "hace 1 hora", avatar: "testimonials/testimonial10.jpeg" },
    { name: "Juan C.", rating: 5, message: "Pasé de amateur a profesional rápidamente.", time: "hace 2 horas", avatar: "testimonials/testimonial11.jpeg" },
    { name: "Mario R.", rating: 5, message: "Material de estudio práctico y actualizado.", time: "hace 2 horas", avatar: "testimonials/testimonial12.jpeg" },
    { name: "Diego A.", rating: 5, message: "Lo mejor del mercado, sin comparación.", time: "hace 2 horas", avatar: "testimonials/testimonial13.jpeg" },
    { name: "Sebastián C.", rating: 5, message: "Formación integral en barbería moderna.", time: "hace 2 horas", avatar: "testimonials/testimonial1.jpg" },
    { name: "Gabriel F.", rating: 5, message: "¡Extraordinario! Ya recuperé la inversión.", time: "hace 2 horas", avatar: "testimonials/testimonial2.jpg" },
    { name: "Nicolás P.", rating: 5, message: "Increíble, aprendí cortes avanzados.", time: "hace 2 horas", avatar: "testimonials/testimonial3.jpg" },
    { name: "Tomás D.", rating: 5, message: "El mejor curso de barbería del mercado.", time: "hace 3 horas", avatar: "testimonials/testimonial4.jpg" },
    { name: "Marcos V.", rating: 5, message: "Estrategias de negocio muy efectivas.", time: "hace 3 horas", avatar: "testimonials/testimonial5.jpg" },
    { name: "Adrián S.", rating: 5, message: "Fácil de seguir, resultados inmediatos.", time: "hace 3 horas", avatar: "testimonials/testimonial6.jpg" },
    { name: "Víctor H.", rating: 5, message: "Desde el primer día ganando clientes.", time: "hace 3 horas", avatar: "testimonials/testimonial7.jpg" },
    { name: "Jorge L.", rating: 5, message: "Metodología clara y directa. Excelente.", time: "hace 3 horas", avatar: "testimonials/testimonial8.jpeg" },
    { name: "Esteban R.", rating: 5, message: "Material completo y muy bien explicado.", time: "hace 3 horas", avatar: "testimonials/testimonial9.jpeg" },
    { name: "Alan M.", rating: 5, message: "Sorprendido con la calidad del contenido.", time: "hace 4 horas", avatar: "testimonials/testimonial10.jpeg" },
    { name: "Emiliano C.", rating: 5, message: "Recomendado al 100% para principiantes.", time: "hace 4 horas", avatar: "testimonials/testimonial11.jpeg" },
    { name: "David G.", rating: 5, message: "El curso más completo que he encontrado.", time: "hace 4 horas", avatar: "testimonials/testimonial12.jpeg" },
    { name: "Jesús N.", rating: 5, message: "Transformó mi carrera profesional.", time: "hace 4 horas", avatar: "testimonials/testimonial13.jpeg" },
    { name: "Matías P.", rating: 5, message: "Aprendizaje práctico y efectivo.", time: "hace 4 horas", avatar: "testimonials/testimonial1.jpg" },
    { name: "Ignacio L.", rating: 5, message: "Increíble curso, 100% recomendado.", time: "hace 4 horas", avatar: "testimonials/testimonial2.jpg" },
    { name: "Facundo S.", rating: 5, message: "El mejor curso para emprendedores.", time: "hace 5 horas", avatar: "testimonials/testimonial3.jpg" },
    { name: "Lucas T.", rating: 5, message: "Material didáctico de primera calidad.", time: "hace 5 horas", avatar: "testimonials/testimonial4.jpg" },
    { name: "Lorenzo V.", rating: 5, message: "Todo lo necesario para empezar tu negocio.", time: "hace 5 horas", avatar: "testimonials/testimonial5.jpg" },
    { name: "Bruno M.", rating: 5, message: "Curso práctico y muy bien estructurado.", time: "hace 5 horas", avatar: "testimonials/testimonial6.jpg" },
    { name: "Hernán D.", rating: 5, message: "Fácil de seguir y aplicar inmediatamente.", time: "hace 5 horas", avatar: "testimonials/testimonial7.jpg" },
    { name: "Mauricio B.", rating: 5, message: "El mejor curso de barbería en línea.", time: "hace 5 horas", avatar: "testimonials/testimonial8.jpeg" },
    { name: "Axel N.", rating: 5, message: "Inversión que cambió mi vida profesional.", time: "hace 6 horas", avatar: "testimonials/testimonial9.jpeg" },
    { name: "Cristian G.", rating: 5, message: "Técnicas actuales que mis clientes adoran.", time: "hace 6 horas", avatar: "testimonials/testimonial10.jpeg" }
];

// Función para crear un popup
function createPopup(data) {
    const popup = document.createElement('div');
    popup.className = 'popup-notification';
    
    // Crear estrellas
    let stars = '';
    for (let i = 0; i < data.rating; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-name">${data.name}</div>
            <div class="popup-stars">${stars}</div>
            <div class="popup-message">${data.message}</div>
            <div class="popup-time">${data.time}</div>
        </div>
    `;
    
    return popup;
}

// Función para mostrar un popup aleatorio
function showRandomPopup() {
    const container = document.querySelector('.floating-popups');
    const randomIndex = Math.floor(Math.random() * popupData.length);
    const popupData_ = popupData[randomIndex];
    
    const popup = createPopup(popupData_);
    container.appendChild(popup);
    
    // Eliminar el popup después de la animación
    setTimeout(() => {
        popup.remove();
    }, 6000); // 6 segundos (5s + 1s para la animación)
}

// Mostrar popups aleatorios cada cierto tiempo
function startPopups() {
    // Mostrar el primer popup después de 3 segundos
    setTimeout(() => {
        showRandomPopup();
        
        // Continuar mostrando popups cada 8-15 segundos
        setInterval(() => {
            showRandomPopup();
        }, Math.random() * 7000 + 8000); // Entre 8 y 15 segundos
    }, 3000);
}

// Iniciar popups cuando la página esté cargada
document.addEventListener('DOMContentLoaded', startPopups); 