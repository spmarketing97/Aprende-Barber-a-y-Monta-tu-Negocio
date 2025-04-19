# Sistema de Informes de Analítica Web

Este sistema genera y envía automáticamente informes semanales con datos de Google Analytics para la landing page "Aprende Barbería y Monta tu Negocio".

## Características

- Recopilación automática de datos de Google Analytics
- Análisis de visitas, conversiones y comportamiento de usuarios
- Generación de gráficos visuales
- Envío de informes por correo electrónico cada lunes a las 9:00 AM
- Seguimiento de usuarios que llegan al checkout

## Requisitos

- Python 3.8 o superior
- Cuenta de Google Analytics configurada en la página web
- Credenciales de API de Google Analytics
- Cuenta de correo electrónico con contraseña de aplicación

## Instalación

1. Instala las dependencias:

```bash
pip install -r requirements.txt
```

2. Configura tus credenciales de Google Analytics:

- Crea un proyecto en Google Cloud Console
- Habilita la API de Google Analytics
- Crea una cuenta de servicio y descarga el archivo JSON de credenciales
- Coloca el archivo como `analytics-key.json` en el directorio `analytics/`

3. Actualiza el ID de vista (VIEW_ID) en `track_analytics.py`:

```python
VIEW_ID = 'XXXXXXXXXXXX'  # Reemplaza con tu ID de vista de Google Analytics
```

## Uso

### Enviar un correo de prueba

```bash
python track_analytics.py --test
```

### Generar y enviar un informe inmediatamente

```bash
python track_analytics.py --now
```

### Iniciar el sistema de programación (ejecución semanal)

```bash
python track_analytics.py
```

## Configuración del Seguimiento en la Web

Para que el sistema pueda recopilar datos de checkout, asegúrate de que tu página web tenga implementado el código de seguimiento de eventos de Google Analytics. Deberás añadir el siguiente código a los botones relacionados con el proceso de checkout:

```javascript
// Ejemplo para iniciar checkout
document.getElementById('btn-checkout').addEventListener('click', function() {
    gtag('event', 'begin', {
        'event_category': 'Checkout',
        'event_label': 'Inicio de checkout'
    });
});

// Ejemplo para checkout completado
document.getElementById('btn-complete-purchase').addEventListener('click', function() {
    gtag('event', 'complete', {
        'event_category': 'Checkout',
        'event_label': 'Compra completada'
    });
});

// Ejemplo para checkout abandonado
window.addEventListener('beforeunload', function(e) {
    // Verificar si el usuario está en el proceso de checkout
    if (window.location.href.includes('checkout') && !checkoutCompleted) {
        gtag('event', 'abandon', {
            'event_category': 'Checkout',
            'event_label': 'Checkout abandonado'
        });
    }
});
```

## Estructura de Archivos

```
analytics/
├── track_analytics.py     # Script principal
├── requirements.txt       # Dependencias
├── analytics-key.json     # Credenciales de Google Analytics (debes crear este archivo)
├── README.md              # Este archivo
├── charts/                # Directorio para guardar gráficos (se crea automáticamente)
└── analytics_report.log   # Archivo de registro (se crea automáticamente)
```

## Solución de problemas

Si encuentras algún problema:

1. Revisa el archivo `analytics_report.log` para ver mensajes de error detallados
2. Verifica que las credenciales de Google Analytics sean correctas
3. Asegúrate de que tu cuenta de correo tenga habilitadas las aplicaciones menos seguras o utilice una contraseña de aplicación
4. Verifica que el ID de vista de Google Analytics sea correcto 