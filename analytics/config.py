import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Configuración de correo electrónico
EMAIL_USER = os.getenv('EMAIL_USER', '')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '')
EMAIL_FROM = os.getenv('EMAIL_FROM', '')
EMAIL_TO = os.getenv('EMAIL_TO', '').split(',') if os.getenv('EMAIL_TO') else []
EMAIL_SUBJECT = os.getenv('EMAIL_SUBJECT', 'Reporte Semanal de Analíticas')

# Configuración de Google Analytics
GA_VIEW_ID = os.getenv('GA_VIEW_ID', '')
GA_KEY_FILE = os.getenv('GA_KEY_FILE', 'analytics-key.json')

# Directorios
CHARTS_DIR = os.getenv('CHARTS_DIR', 'analytics/charts') 