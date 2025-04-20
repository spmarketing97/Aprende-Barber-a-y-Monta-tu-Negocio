#!/usr/bin/env python3
import os
import sys
import json
import time
import smtplib
import logging
import requests
import schedule
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import pandas as pd
import matplotlib.pyplot as plt
from dotenv import load_dotenv
from apiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("analytics_report.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Cargar variables de entorno si existe .env
load_dotenv()

# Credenciales de correo
EMAIL_SENDER = "solucionesworld2016@gmail.com"
EMAIL_PASSWORD = "hvyj qclp lcuy gsgt"  # Contraseña de aplicación de Google
EMAIL_RECEIVER = "hristiankrasimirov7@gmail.com"
EMAIL_SUBJECT = "APRENDE BARBERÍA Y MONTA TU NEGOCIO"

# Configuración de Google Analytics
VIEW_ID = 'G-Q8GKXRLF50'  # ID de Google Analytics actualizado
SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
KEY_FILE_LOCATION = 'analytics-key.json'  # Ruta al archivo de credenciales dentro de la carpeta analytics

def initialize_analytics():
    """Inicializa la conexión con la API de Google Analytics."""
    try:
        # Intentar cargar desde la ruta actual primero
        if os.path.exists(KEY_FILE_LOCATION):
            credentials = ServiceAccountCredentials.from_json_keyfile_name(
                KEY_FILE_LOCATION, SCOPES)
        else:
            # Si no existe, intentar cargar desde la ruta relativa
            credentials = ServiceAccountCredentials.from_json_keyfile_name(
                os.path.join('analytics', KEY_FILE_LOCATION), SCOPES)
        
        print(f"Usando archivo de credenciales: {os.path.abspath(KEY_FILE_LOCATION)}")
        analytics = build('analyticsreporting', 'v4', credentials=credentials)
        return analytics
    except Exception as e:
        logger.error(f"Error al inicializar Analytics: {e}")
        return None

def get_report(analytics, start_date='7daysAgo', end_date='today'):
    """Obtiene datos de informe de Google Analytics."""
    try:
        return analytics.reports().batchGet(
            body={
                'reportRequests': [
                    {
                        'viewId': VIEW_ID,
                        'dateRanges': [{'startDate': start_date, 'endDate': end_date}],
                        'metrics': [
                            {'expression': 'ga:users'},
                            {'expression': 'ga:sessions'},
                            {'expression': 'ga:pageviews'},
                            {'expression': 'ga:bounceRate'},
                            {'expression': 'ga:avgSessionDuration'}
                        ],
                        'dimensions': [
                            {'name': 'ga:date'}
                        ]
                    },
                    {
                        'viewId': VIEW_ID,
                        'dateRanges': [{'startDate': start_date, 'endDate': end_date}],
                        'metrics': [
                            {'expression': 'ga:pageviews'}
                        ],
                        'dimensions': [
                            {'name': 'ga:pagePath'}
                        ],
                        'orderBys': [
                            {'fieldName': 'ga:pageviews', 'sortOrder': 'DESCENDING'}
                        ],
                        'pageSize': 10
                    },
                    {
                        'viewId': VIEW_ID,
                        'dateRanges': [{'startDate': start_date, 'endDate': end_date}],
                        'metrics': [
                            {'expression': 'ga:users'}
                        ],
                        'dimensions': [
                            {'name': 'ga:source'},
                            {'name': 'ga:medium'}
                        ],
                        'orderBys': [
                            {'fieldName': 'ga:users', 'sortOrder': 'DESCENDING'}
                        ],
                        'pageSize': 10
                    },
                    # Reporte de eventos de checkout
                    {
                        'viewId': VIEW_ID,
                        'dateRanges': [{'startDate': start_date, 'endDate': end_date}],
                        'metrics': [
                            {'expression': 'ga:totalEvents'}
                        ],
                        'dimensions': [
                            {'name': 'ga:eventCategory'},
                            {'name': 'ga:eventAction'}
                        ],
                        'dimensionFilterClauses': [
                            {
                                'filters': [
                                    {
                                        'dimensionName': 'ga:eventCategory',
                                        'operator': 'EXACT',
                                        'expressions': ['Checkout']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ).execute()
    except Exception as e:
        logger.error(f"Error al obtener datos de Analytics: {e}")
        return None

def parse_response(response):
    """Procesa la respuesta de la API de Google Analytics."""
    if not response:
        return None
    
    report_data = {}
    
    try:
        # General metrics
        general_report = response['reports'][0]
        rows = general_report.get('data', {}).get('rows', [])
        dates = []
        metrics_data = {
            'users': [],
            'sessions': [],
            'pageviews': [],
            'bounceRate': [],
            'avgSessionDuration': []
        }
        
        for row in rows:
            dates.append(format_date(row['dimensions'][0]))
            values = row['metrics'][0]['values']
            metrics_data['users'].append(int(values[0]))
            metrics_data['sessions'].append(int(values[1]))
            metrics_data['pageviews'].append(int(values[2]))
            metrics_data['bounceRate'].append(float(values[3]))
            metrics_data['avgSessionDuration'].append(float(values[4]))
        
        report_data['general'] = {
            'dates': dates,
            'metrics': metrics_data,
            'totals': {
                'users': sum(metrics_data['users']),
                'sessions': sum(metrics_data['sessions']),
                'pageviews': sum(metrics_data['pageviews']),
                'bounceRate': sum(metrics_data['bounceRate']) / len(metrics_data['bounceRate']) if metrics_data['bounceRate'] else 0,
                'avgSessionDuration': sum(metrics_data['avgSessionDuration']) / len(metrics_data['avgSessionDuration']) if metrics_data['avgSessionDuration'] else 0
            }
        }
        
        # Top pages
        pages_report = response['reports'][1]
        pages = []
        for row in pages_report.get('data', {}).get('rows', []):
            pages.append({
                'page': row['dimensions'][0],
                'pageviews': int(row['metrics'][0]['values'][0])
            })
        report_data['top_pages'] = pages
        
        # Traffic sources
        sources_report = response['reports'][2]
        sources = []
        for row in sources_report.get('data', {}).get('rows', []):
            sources.append({
                'source': row['dimensions'][0],
                'medium': row['dimensions'][1],
                'users': int(row['metrics'][0]['values'][0])
            })
        report_data['traffic_sources'] = sources
        
        # Checkout events
        checkout_report = response['reports'][3]
        checkout_data = {
            'total': 0,
            'completed': 0,
            'abandoned': 0
        }
        
        for row in checkout_report.get('data', {}).get('rows', []):
            action = row['dimensions'][1]
            value = int(row['metrics'][0]['values'][0])
            
            checkout_data['total'] += value
            if action == 'complete':
                checkout_data['completed'] += value
            elif action == 'abandon':
                checkout_data['abandoned'] += value
        
        report_data['checkout'] = checkout_data
        
        return report_data
        
    except Exception as e:
        logger.error(f"Error al procesar respuesta de Analytics: {e}")
        return None

def format_date(date_str):
    """Formatea la fecha de YYYYMMDD a DD/MM/YYYY."""
    try:
        year = date_str[:4]
        month = date_str[4:6]
        day = date_str[6:]
        return f"{day}/{month}/{year}"
    except:
        return date_str

def generate_charts(data, output_dir='analytics/charts'):
    """Genera gráficos con los datos del informe."""
    if not data:
        return []
    
    chart_files = []
    
    try:
        # Crear directorio si no existe
        os.makedirs(output_dir, exist_ok=True)
        
        # Gráfico 1: Usuarios, sesiones y páginas vistas
        plt.figure(figsize=(10, 6))
        dates = data['general']['dates']
        plt.plot(dates, data['general']['metrics']['users'], 'b-', label='Usuarios')
        plt.plot(dates, data['general']['metrics']['sessions'], 'g-', label='Sesiones')
        plt.plot(dates, data['general']['metrics']['pageviews'], 'r-', label='Páginas vistas')
        plt.title('Tráfico Semanal')
        plt.xlabel('Fecha')
        plt.ylabel('Cantidad')
        plt.legend()
        plt.xticks(rotation=45)
        plt.tight_layout()
        
        chart1_path = f"{output_dir}/traffic_weekly.png"
        plt.savefig(chart1_path)
        plt.close()
        chart_files.append(chart1_path)
        
        # Gráfico 2: Top páginas
        plt.figure(figsize=(10, 6))
        pages = [p['page'] for p in data['top_pages'][:5]]
        pageviews = [p['pageviews'] for p in data['top_pages'][:5]]
        plt.bar(pages, pageviews, color='skyblue')
        plt.title('Páginas Más Visitadas')
        plt.xlabel('Página')
        plt.ylabel('Visitas')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        
        chart2_path = f"{output_dir}/top_pages.png"
        plt.savefig(chart2_path)
        plt.close()
        chart_files.append(chart2_path)
        
        # Gráfico 3: Fuentes de tráfico
        plt.figure(figsize=(10, 6))
        sources = [f"{s['source']}/{s['medium']}" for s in data['traffic_sources'][:5]]
        users = [s['users'] for s in data['traffic_sources'][:5]]
        plt.pie(users, labels=sources, autopct='%1.1f%%', startangle=90)
        plt.axis('equal')
        plt.title('Fuentes de Tráfico')
        plt.tight_layout()
        
        chart3_path = f"{output_dir}/traffic_sources.png"
        plt.savefig(chart3_path)
        plt.close()
        chart_files.append(chart3_path)
        
        # Gráfico 4: Checkout completados vs abandonados
        if data['checkout']['total'] > 0:
            plt.figure(figsize=(8, 8))
            plt.pie(
                [data['checkout']['completed'], data['checkout']['abandoned']], 
                labels=['Completados', 'Abandonados'], 
                autopct='%1.1f%%', 
                startangle=90,
                colors=['#28a745', '#dc3545']
            )
            plt.axis('equal')
            plt.title('Tasa de Conversión de Checkout')
            plt.tight_layout()
            
            chart4_path = f"{output_dir}/checkout_rate.png"
            plt.savefig(chart4_path)
            plt.close()
            chart_files.append(chart4_path)
        
        return chart_files
    
    except Exception as e:
        logger.error(f"Error al generar gráficos: {e}")
        return []

def create_email_html(data, week_number):
    """Crea el contenido HTML del correo electrónico."""
    if not data:
        return "<h1>No hay datos disponibles para el informe</h1>"
    
    try:
        # Calcular tasa de conversión
        conversion_rate = 0
        if data['checkout']['total'] > 0:
            conversion_rate = (data['checkout']['completed'] / data['checkout']['total']) * 100
        
        # Generar recomendaciones basadas en los datos
        recommendations = []
        
        # Tasa de rebote alta
        if data['general']['totals']['bounceRate'] > 60:
            recommendations.append("La tasa de rebote es alta. Considera mejorar el contenido inicial y los llamados a la acción.")
        
        # Duración de sesión baja
        if data['general']['totals']['avgSessionDuration'] < 60:
            recommendations.append("La duración media de sesión es baja. Añade contenido más atractivo y multimedia para mantener a los usuarios interesados.")
        
        # Tasa de conversión baja
        if conversion_rate < 2:
            recommendations.append("La tasa de conversión es baja. Revisa el proceso de checkout y considera añadir incentivos o mejorar la confianza del usuario.")
        
        # Recomendaciones generales
        recommendations.extend([
            "Analiza las páginas más visitadas y optimiza su contenido para mejorar la conversión.",
            "Considera realizar pruebas A/B en los elementos clave de la landing page.",
            "Revisa la velocidad de carga de la página, especialmente en dispositivos móviles.",
            "Mejora los llamados a la acción (CTA) para hacerlos más visibles y atractivos."
        ])
        
        html = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333; }}
                .container {{ width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #c71818; color: white; padding: 20px; text-align: center; }}
                .section {{ margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px; }}
                .metric {{ margin-bottom: 10px; display: flex; justify-content: space-between; }}
                .metric-title {{ font-weight: bold; }}
                .table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                .table th, .table td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                .table th {{ background-color: #f2f2f2; }}
                .table tr:nth-child(even) {{ background-color: #f9f9f9; }}
                .good {{ color: green; }}
                .warning {{ color: orange; }}
                .bad {{ color: red; }}
                .recommendations {{ background-color: #e8f4ff; padding: 15px; border-left: 4px solid #2196F3; margin: 15px 0; }}
                .recommendations li {{ margin-bottom: 8px; }}
                .footer {{ margin-top: 30px; font-size: 12px; color: #777; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Informe Semanal de Rendimiento</h1>
                    <h2>APRENDE BARBERÍA Y MONTA TU NEGOCIO</h2>
                    <p>Semana {week_number} - {data['general']['dates'][0]} al {data['general']['dates'][-1]}</p>
                </div>
                
                <div class="section">
                    <h3>Resumen de Tráfico</h3>
                    <div class="metric">
                        <span class="metric-title">Usuarios:</span>
                        <span>{data['general']['totals']['users']}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-title">Sesiones:</span>
                        <span>{data['general']['totals']['sessions']}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-title">Páginas vistas:</span>
                        <span>{data['general']['totals']['pageviews']}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-title">Tasa de rebote:</span>
                        <span>{data['general']['totals']['bounceRate']:.2f}%</span>
                    </div>
                    <div class="metric">
                        <span class="metric-title">Duración media de sesión:</span>
                        <span>{int(data['general']['totals']['avgSessionDuration']) // 60}m {int(data['general']['totals']['avgSessionDuration']) % 60}s</span>
                    </div>
                </div>
                
                <div class="section">
                    <h3>Páginas Más Visitadas</h3>
                    <table class="table">
                        <tr>
                            <th>Página</th>
                            <th>Vistas</th>
                        </tr>
                        {"".join([f"<tr><td>{p['page']}</td><td>{p['pageviews']}</td></tr>" for p in data['top_pages'][:5]])}
                    </table>
                </div>
                
                <div class="section">
                    <h3>Fuentes de Tráfico</h3>
                    <table class="table">
                        <tr>
                            <th>Fuente</th>
                            <th>Medio</th>
                            <th>Usuarios</th>
                        </tr>
                        {"".join([f"<tr><td>{s['source']}</td><td>{s['medium']}</td><td>{s['users']}</td></tr>" for s in data['traffic_sources'][:5]])}
                    </table>
                </div>
                
                <div class="section">
                    <h3>Checkout y Conversiones</h3>
                    <div class="metric">
                        <span class="metric-title">Inicios de checkout:</span>
                        <span>{data['checkout']['total']}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-title">Checkouts completados:</span>
                        <span class="good">{data['checkout']['completed']}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-title">Checkouts abandonados:</span>
                        <span class="bad">{data['checkout']['abandoned']}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-title">Tasa de conversión:</span>
                        <span class="{'good' if conversion_rate > 3 else 'warning' if conversion_rate > 1 else 'bad'}">{conversion_rate:.2f}%</span>
                    </div>
                </div>
                
                <div class="section">
                    <h3>Recomendaciones para Mejorar el Rendimiento</h3>
                    <div class="recommendations">
                        <ul>
                            {"".join([f"<li>{recommendation}</li>" for recommendation in recommendations])}
                        </ul>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Este es un informe automático generado para Aprende Barbería y Monta tu Negocio.</p>
                    <p>© {datetime.datetime.now().year} - Informe generado el {datetime.datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
                </div>
            </div>
        </body>
        </html>
        """
        return html
    except Exception as e:
        logger.error(f"Error al crear HTML del correo: {e}")
        return f"<h1>Error al generar informe: {str(e)}</h1>"

def send_email(html_content, chart_files=[]):
    """Envía el informe por correo electrónico."""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_SENDER
        msg['To'] = EMAIL_RECEIVER
        msg['Subject'] = EMAIL_SUBJECT + f" - Informe Semanal {datetime.datetime.now().strftime('%d/%m/%Y')}"
        
        # Adjuntar el contenido HTML
        msg.attach(MIMEText(html_content, 'html'))
        
        # Adjuntar gráficos
        for chart_file in chart_files:
            if os.path.exists(chart_file):
                with open(chart_file, 'rb') as f:
                    chart_attachment = MIMEApplication(f.read(), _subtype="png")
                    chart_attachment.add_header('Content-Disposition', 'attachment', filename=os.path.basename(chart_file))
                    msg.attach(chart_attachment)
        
        # Preparar CSV con datos adicionales
        csv_path = 'analytics/report_data.csv'
        df = pd.DataFrame({
            'fecha': [datetime.datetime.now().strftime('%Y-%m-%d')],
            'tipo': ['Informe Semanal'],
            'generado_por': ['Sistema Automatizado'],
            'enviado_a': [EMAIL_RECEIVER]
        })
        df.to_csv(csv_path, index=False)
        
        # Adjuntar CSV
        with open(csv_path, 'rb') as f:
            csv_attachment = MIMEApplication(f.read(), _subtype="csv")
            csv_attachment.add_header('Content-Disposition', 'attachment', filename="datos_informe.csv")
            msg.attach(csv_attachment)
            
        # Enviar email
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.send_message(msg)
            
        logger.info(f"Correo enviado exitosamente a {EMAIL_RECEIVER}")
        return True
    except Exception as e:
        logger.error(f"Error al enviar correo: {e}")
        return False

def generate_and_send_report():
    """Función principal para generar y enviar el informe."""
    logger.info("Iniciando generación de informe semanal...")
    
    # Inicializar Analytics
    analytics = initialize_analytics()
    if not analytics:
        logger.error("No se pudo inicializar Analytics. Abortando.")
        return False
    
    # Obtener datos
    logger.info("Obteniendo datos de Google Analytics...")
    response = get_report(analytics)
    if not response:
        logger.error("No se obtuvieron datos de Analytics. Abortando.")
        return False
    
    # Procesar datos
    logger.info("Procesando datos obtenidos...")
    data = parse_response(response)
    if not data:
        logger.error("Error al procesar datos. Abortando.")
        return False
    
    # Número de semana actual
    week_number = datetime.datetime.now().isocalendar()[1]
    
    # Generar gráficos
    logger.info("Generando gráficos...")
    chart_files = generate_charts(data)
    
    # Crear contenido HTML
    logger.info("Creando contenido del correo...")
    html_content = create_email_html(data, week_number)
    
    # Enviar correo
    logger.info("Enviando informe por correo electrónico...")
    result = send_email(html_content, chart_files)
    
    if result:
        logger.info("Informe semanal enviado exitosamente.")
    else:
        logger.error("Hubo un problema al enviar el informe semanal.")
    
    return result

def send_test_email():
    """Envía un correo de prueba para verificar la configuración."""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_SENDER
        msg['To'] = EMAIL_RECEIVER
        msg['Subject'] = EMAIL_SUBJECT + " - Correo de Prueba"
        
        html = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; }}
                .header {{ background-color: #c71818; color: white; padding: 15px; text-align: center; }}
                .content {{ padding: 20px; background-color: #f9f9f9; }}
                .footer {{ margin-top: 20px; font-size: 12px; color: #777; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Correo de Prueba - Sistema de Informes</h2>
                </div>
                <div class="content">
                    <p>Este es un correo de prueba enviado desde el sistema de informes analíticos.</p>
                    <p>Si estás recibiendo este correo, significa que la configuración del sistema es correcta.</p>
                    <p>El sistema está configurado para enviar informes semanales cada lunes a las 9:00 AM.</p>
                    <p><strong>Información del sistema:</strong></p>
                    <ul>
                        <li>Fecha y hora: {datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</li>
                        <li>Remitente: {EMAIL_SENDER}</li>
                        <li>Destinatario: {EMAIL_RECEIVER}</li>
                        <li>ID de Google Analytics: {VIEW_ID}</li>
                    </ul>
                </div>
                <div class="footer">
                    <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html, 'html'))
        
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.send_message(msg)
            
        logger.info(f"Correo de prueba enviado exitosamente a {EMAIL_RECEIVER}")
        return True
    except Exception as e:
        logger.error(f"Error al enviar correo de prueba: {e}")
        return False

def main():
    """Función principal."""
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        # Enviar correo de prueba
        send_test_email()
        return
    
    if len(sys.argv) > 1 and sys.argv[1] == "--now":
        # Ejecutar reporte inmediatamente
        generate_and_send_report()
        return
    
    # Programar ejecución semanal
    logger.info("Iniciando programación de informes semanales...")
    # Configurar para que se ejecute cada lunes a las 9 AM
    schedule.every().monday.at("09:00").do(generate_and_send_report)
    
    logger.info("Sistema de informes iniciado. Esperando el horario programado...")
    
    # Enviar correo de prueba inicial
    send_test_email()
    
    # Bucle principal
    while True:
        schedule.run_pending()
        time.sleep(60)  # Comprobar cada minuto

if __name__ == "__main__":
    main() 