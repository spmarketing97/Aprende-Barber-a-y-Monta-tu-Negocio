# Cuestionario para Leads de Barbería

Este módulo proporciona un cuestionario interactivo para recopilar información sobre los posibles clientes interesados en el curso de barbería.

## Características

- Formulario de 10 preguntas con opciones predefinidas
- Barra de progreso para visualizar el avance
- Recopilación de datos personales básicos
- Redirección automática a la página principal al finalizar
- Diseño responsivo adaptado al estilo del sitio principal

## Estructura de archivos

```
CUESTIONARIO/
│
├── index.html         # Página principal del cuestionario
├── css/
│   └── cuestionario.css   # Estilos para el cuestionario
├── js/
│   └── cuestionario.js    # Lógica del cuestionario
└── procesar.php       # Script para procesar las respuestas (opcional)
```

## Instalación

1. Sube la carpeta CUESTIONARIO completa al mismo nivel que el index.html principal del sitio.
2. Asegúrate de que el servidor tenga soporte para PHP si deseas utilizar la funcionalidad de procesamiento del formulario.
3. Modifica el archivo `procesar.php` para establecer la dirección de correo electrónico donde deseas recibir las respuestas.

## Personalización

### Modificar las preguntas

Las preguntas están definidas en el archivo `js/cuestionario.js`. Puedes editar el array `preguntas` para cambiar tanto las preguntas como las opciones de respuesta.

### Cambiar los estilos

El diseño visual se puede personalizar modificando el archivo `css/cuestionario.css`. Los colores principales están definidos como variables CSS al principio del archivo.

### Integración con sistemas CRM

Para integrar con sistemas externos de gestión de clientes, modifica el archivo `cuestionario.js` en la función `enviarFormulario()`:

```javascript
// Ejemplo de integración con API externa
fetch('https://tu-crm.com/api/leads', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        window.location.href = '../index.html';
    }
})
.catch(error => console.error('Error:', error));
```

## Cómo enlazar desde la página principal

Para enlazar a este cuestionario desde la página principal, añade un botón o enlace como el siguiente:

```html
<a href="CUESTIONARIO/index.html" class="btn">Completar Cuestionario</a>
```

## Notas de seguridad

- El script PHP incluye sanitización básica de la entrada para prevenir inyección de código.
- Para entornos de producción, considera implementar protección adicional contra spam (como reCAPTCHA).
- Asegúrate de tener una política de privacidad actualizada que mencione la recopilación de estos datos. 