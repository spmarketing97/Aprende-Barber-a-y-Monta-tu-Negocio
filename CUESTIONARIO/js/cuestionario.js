document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const preguntas = [
        {
            id: 1,
            pregunta: "¿Cuál es tu nivel actual en barbería?",
            opciones: [
                "Nunca he practicado barbería",
                "Principiante (corto pelo a amigos/familia)",
                "Intermedio (tengo algo de experiencia)",
                "Avanzado (trabajo en una barbería)",
                "Profesional (tengo mi propio negocio)"
            ]
        },
        {
            id: 2,
            pregunta: "¿Cuál es tu objetivo principal al aprender barbería?",
            opciones: [
                "Aprender como hobby/uso personal",
                "Conseguir un trabajo en una barbería",
                "Iniciar mi propio negocio",
                "Mejorar mis habilidades actuales",
                "Ampliar servicios en mi negocio actual"
            ]
        },
        {
            id: 3,
            pregunta: "¿En cuánto tiempo te gustaría empezar a generar ingresos con la barbería?",
            opciones: [
                "Lo antes posible (1-2 meses)",
                "En un plazo medio (3-6 meses)",
                "A largo plazo (más de 6 meses)",
                "Ya genero ingresos, quiero aumentarlos",
                "No busco generar ingresos"
            ]
        },
        {
            id: 4,
            pregunta: "¿Qué aspecto de la barbería te interesa más?",
            opciones: [
                "Cortes modernos y tendencias",
                "Técnicas de degradado (fade)",
                "Diseño y mantenimiento de barbas",
                "Cortes clásicos y tradicionales",
                "Todo el conjunto de técnicas"
            ]
        },
        {
            id: 5,
            pregunta: "¿Cuánto tiempo puedes dedicar semanalmente a aprender barbería?",
            opciones: [
                "Menos de 5 horas",
                "Entre 5 y 10 horas",
                "Entre 10 y 20 horas",
                "Más de 20 horas",
                "Tiempo completo (estoy disponible)"
            ]
        },
        {
            id: 6,
            pregunta: "¿Qué te resulta más difícil al realizar cortes de pelo?",
            opciones: [
                "Hacer degradados (fade)",
                "Manejar correctamente las herramientas",
                "Entender qué estilo conviene a cada cliente",
                "Trabajar con rapidez y eficiencia",
                "No he intentado cortar pelo aún"
            ]
        },
        {
            id: 7,
            pregunta: "¿Cuánto estarías dispuesto a invertir en formación y herramientas?",
            opciones: [
                "Menos de 300€",
                "Entre 300€ y 600€",
                "Entre 600€ y 1000€",
                "Más de 1000€",
                "Lo necesario para comenzar con calidad"
            ]
        },
        {
            id: 8,
            pregunta: "¿Qué aspecto del negocio de barbería te interesa más aprender?",
            opciones: [
                "Marketing y captación de clientes",
                "Gestión financiera y precios",
                "Diseño y decoración del local",
                "Servicio al cliente y fidelización",
                "Contratación y gestión de personal"
            ]
        },
        {
            id: 9,
            pregunta: "¿Has tomado algún curso de barbería anteriormente?",
            opciones: [
                "No, nunca",
                "Videos gratuitos en YouTube",
                "Cursos online de pago",
                "Formación presencial breve",
                "Formación completa en academia"
            ]
        },
        {
            id: 10,
            pregunta: "¿Qué te motiva a aprender barbería en este momento?",
            opciones: [
                "Cambio de carrera/profesión",
                "Generar ingresos extra",
                "Pasión por la estética y la imagen",
                "Independencia laboral y ser mi propio jefe",
                "Desarrollo personal y nuevas habilidades"
            ]
        }
    ];
    
    // Elementos del DOM
    const preguntaContainer = document.getElementById('pregunta-container');
    const datosPersonales = document.getElementById('datos-personales');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const btnEnviar = document.getElementById('btn-enviar');
    const progress = document.getElementById('progress');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const form = document.getElementById('cuestionario-form');
    const modalExito = document.getElementById('modal-exito');
    
    // Variables de estado
    let preguntaActual = 0;
    const totalPreguntas = preguntas.length;
    let respuestas = [];
    
    // Inicializar el cuestionario
    function inicializarCuestionario() {
        totalQuestionsSpan.textContent = totalPreguntas;
        mostrarPregunta(preguntaActual);
        
        // Event listeners
        btnSiguiente.addEventListener('click', siguientePregunta);
        btnAnterior.addEventListener('click', preguntaAnterior);
        
        // Usar el evento submit del formulario
        form.addEventListener('submit', validarFormulario);
    }
    
    // Mostrar la pregunta actual
    function mostrarPregunta(indice) {
        preguntaContainer.innerHTML = '';
        
        if (indice >= totalPreguntas) {
            // Mostrar formulario de datos personales
            preguntaContainer.classList.add('hidden');
            datosPersonales.classList.remove('hidden');
            btnSiguiente.classList.add('hidden');
            btnEnviar.classList.remove('hidden');
            actualizarProgreso(totalPreguntas, totalPreguntas);
            return;
        }
        
        const preguntaActualObj = preguntas[indice];
        const divPregunta = document.createElement('div');
        divPregunta.classList.add('pregunta');
        
        // Título de la pregunta
        const tituloPregunta = document.createElement('h3');
        tituloPregunta.textContent = preguntaActualObj.pregunta;
        divPregunta.appendChild(tituloPregunta);
        
        // Opciones de respuesta
        const divOpciones = document.createElement('div');
        divOpciones.classList.add('opciones');
        
        preguntaActualObj.opciones.forEach((opcion, opcionIndice) => {
            const divOpcion = document.createElement('label');
            divOpcion.classList.add('opcion');
            
            // Si esta opción está seleccionada
            if (respuestas[indice] !== undefined && respuestas[indice] === opcionIndice) {
                divOpcion.classList.add('selected');
            }
            
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = `pregunta_${indice}`;
            radioInput.value = opcionIndice;
            radioInput.classList.add('opcion-radio');
            radioInput.checked = respuestas[indice] === opcionIndice;
            
            radioInput.addEventListener('change', () => {
                // Quitar selección de todas las opciones
                document.querySelectorAll('.opcion').forEach(op => op.classList.remove('selected'));
                
                // Marcar esta opción como seleccionada
                divOpcion.classList.add('selected');
                
                // Guardar respuesta
                respuestas[indice] = opcionIndice;
            });
            
            divOpcion.appendChild(radioInput);
            divOpcion.appendChild(document.createTextNode(opcion));
            
            // Click en el div selecciona el radio
            divOpcion.addEventListener('click', () => {
                radioInput.checked = true;
                
                // Disparar el evento change
                const event = new Event('change');
                radioInput.dispatchEvent(event);
            });
            
            divOpciones.appendChild(divOpcion);
        });
        
        divPregunta.appendChild(divOpciones);
        preguntaContainer.appendChild(divPregunta);
        
        // Actualizar navegación
        if (indice === 0) {
            btnAnterior.classList.add('hidden');
        } else {
            btnAnterior.classList.remove('hidden');
        }
        
        // Actualizar contador y progreso
        currentQuestionSpan.textContent = indice + 1;
        actualizarProgreso(indice + 1, totalPreguntas);
    }
    
    // Actualizar la barra de progreso
    function actualizarProgreso(actual, total) {
        const porcentaje = (actual / total) * 100;
        progress.style.width = `${porcentaje}%`;
    }
    
    // Pasar a la siguiente pregunta
    function siguientePregunta() {
        // Verificar si se ha respondido la pregunta actual
        if (respuestas[preguntaActual] === undefined) {
            alert('Por favor, selecciona una respuesta para continuar');
            return;
        }
        
        preguntaActual++;
        mostrarPregunta(preguntaActual);
    }
    
    // Volver a la pregunta anterior
    function preguntaAnterior() {
        if (preguntaActual > 0) {
            preguntaActual--;
            mostrarPregunta(preguntaActual);
        }
    }
    
    // Validar el formulario antes de enviar
    function validarFormulario(e) {
        e.preventDefault(); // Prevenir el envío por defecto
        
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const aceptoTerminos = document.getElementById('acepto-terminos').checked;
        
        if (!nombre) {
            alert('Por favor, ingresa tu nombre');
            return;
        }
        
        if (!email) {
            alert('Por favor, ingresa tu correo electrónico');
            return;
        }
        
        if (!aceptoTerminos) {
            alert('Debes aceptar los términos y condiciones para continuar');
            return;
        }
        
        // Mostrar mensaje visual de envío
        preguntaContainer.classList.add('hidden');
        datosPersonales.classList.add('hidden');
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';
        
        // Preparar los datos para el respaldo
        const datosRespaldo = {
            fecha: new Date().toISOString(),
            nombre: nombre,
            email: email,
            telefono: telefono || 'No proporcionado',
            respuestas: []
        };
        
        // Añadir las respuestas al objeto de respaldo
        respuestas.forEach((respuesta, index) => {
            datosRespaldo.respuestas.push({
                pregunta: preguntas[index].pregunta,
                respuesta: preguntas[index].opciones[respuesta]
            });
        });
        
        // Guardar en localStorage como respaldo
        try {
            const envios = JSON.parse(localStorage.getItem('cuestionario_envios') || '[]');
            envios.push(datosRespaldo);
            localStorage.setItem('cuestionario_envios', JSON.stringify(envios));
            console.log('Datos guardados en localStorage como respaldo');
        } catch (err) {
            console.error('Error al guardar en localStorage:', err);
        }
        
        // Mostrar modal de éxito brevemente
        modalExito.classList.add('show');
        
        // Redireccionar directamente a la página principal
        // Usamos una ruta relativa para evitar problemas con GitHub Pages
        setTimeout(() => {
            try {
                // Intentar determinar la ruta base del proyecto
                const urlActual = window.location.href;
                const urlBase = urlActual.substring(0, urlActual.lastIndexOf('/CUESTIONARIO'));
                
                // Redireccionar a la página principal
                window.location.href = urlBase + '/index.html';
            } catch (error) {
                console.error('Error en la redirección:', error);
                // Fallback a ruta relativa simple en caso de error
                window.location.href = '../index.html';
            }
        }, 1500); // Tiempo reducido para evitar tiempo de espera prolongado
        
        return false; // Asegurarse de que el formulario no se envíe
    }
    
    // Iniciar el cuestionario
    inicializarCuestionario();
}); 