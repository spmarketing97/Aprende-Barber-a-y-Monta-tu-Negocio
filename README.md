# Landing Page: Aprende Barbería y Monta tu Negocio

## Descripción

Esta es una landing page profesional diseñada para promocionar el curso "Aprende Barbería y Monta tu Negocio". La página está optimizada para convertir visitantes en clientes potenciales, destacando los beneficios del curso, mostrando testimonios de alumnos satisfechos y presentando el contenido del programa de manera atractiva.

## Características Principales

- **Diseño Responsivo**: Adaptable a dispositivos móviles, tablets y escritorio
- **Contador de Escasez**: Widget flotante que muestra un temporizador para generar urgencia
- **Secciones Modulares**: Estructura organizada por secciones claramente definidas
- **Carrusel de Testimonios**: Slider automático con controles manuales
- **Reproductor de Video**: Integración con YouTube para presentación del curso
- **Llamados a la Acción**: Botones estratégicamente ubicados
- **Garantía de Satisfacción**: Sección destacando la política de devolución
- **Certificación**: Muestra del certificado que recibirán los alumnos

## Estructura del Proyecto

```
├── css/
│   └── styles.css          # Estilos principales de la página
├── img/
│   ├── banner.jpg          # Imagen principal del banner
│   ├── certificate.jpg     # Imagen del certificado
│   ├── favicon.png         # Favicon del sitio
│   └── README.txt          # Instrucciones para las imágenes
├── js/
│   └── script.js           # Funcionalidades JavaScript
├── testimonials/
│   ├── testimonial1.jpg    # Fotos de testimonios
│   ├── testimonial2.jpg
│   ├── testimonial3.jpg
│   ├── testimonial4.jpg
│   ├── testimonial5.jpg
│   ├── testimonial6.jpg
│   ├── testimonial7.jpg
│   └── README.txt          # Instrucciones para testimonios
├── index.html              # Archivo principal HTML
└── README.md               # Este archivo
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica del contenido
- **CSS3**: Estilos modernos con variables CSS y animaciones
- **JavaScript**: Funcionalidades interactivas (contador, slider, tabs)
- **Font Awesome**: Iconografía vectorial
- **YouTube Embed API**: Integración de video

## Secciones de la Landing Page

1. **Header y Banner Principal**: Presentación del curso con llamado a la acción
2. **Introducción**: Breve descripción del propósito del curso
3. **Video de Presentación**: Video promocional del curso
4. **Beneficios**: Lo que el alumno logrará con el curso
5. **Módulos**: Contenido detallado del curso organizado en pestañas
6. **Testimonios**: Opiniones de alumnos satisfechos
7. **Acerca del Productor**: Información sobre el instructor
8. **Características del Curso**: Resumen de lo que incluye
9. **Certificado**: Muestra del certificado de finalización
10. **Garantía**: Política de devolución
11. **CTA Final**: Llamado a la acción con precio y oferta
12. **Footer**: Información de contacto y derechos

## Funcionalidades JavaScript

- **Contador de Escasez**: Muestra un temporizador de 25 minutos que se guarda en localStorage
- **Sistema de Pestañas**: Para navegar entre los diferentes módulos del curso
- **Slider de Testimonios**: Carrusel automático con controles manuales
- **Smooth Scrolling**: Desplazamiento suave al hacer clic en enlaces internos
- **Widget Flotante**: Aparece/desaparece según la posición de scroll
- **Efectos Visuales**: Animaciones para mejorar la experiencia de usuario

## Personalización

### Cambiar Imágenes

Las imágenes se encuentran en las carpetas `img/` y `testimonials/`. Para reemplazarlas, simplemente sustituya los archivos manteniendo los mismos nombres o actualice las referencias en el código.

### Modificar Contenido

El contenido principal se encuentra en `index.html`. Puede editar:

- Textos y descripciones
- Enlaces de los botones de llamado a la acción
- Información de los módulos
- Testimonios
- Datos del productor

### Ajustar Estilos

Los estilos se definen en `css/styles.css`. Las variables principales están al inicio del archivo:

```css
:root {
    --primary-color: #c71818;
    --secondary-color: #222222;
    --accent-color: #e74c3c;
    --light-color: #f8f9fa;
    --dark-color: #212529;
    --border-radius: 12px;
    --box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    --highlight-color: rgba(255, 255, 0, 0.2);
    --telegram-color: #0088cc;
}
```

Modifique estas variables para cambiar el esquema de colores de toda la página.

## Optimización

Para mejorar el rendimiento de la página:

1. **Optimice las imágenes**: Comprima las imágenes para reducir su tamaño
2. **Minifique los archivos**: Reduzca el tamaño de CSS y JavaScript
3. **Carga diferida**: Considere agregar `loading="lazy"` a las imágenes

## Contacto y Soporte

Para soporte o consultas sobre esta landing page, contacte a través del botón de Telegram incluido en la página.

## Licencia

Esta landing page es propiedad de SPMarketing - Agency. Todos los derechos reservados.

---

© 2025 SPMarketing - Agency