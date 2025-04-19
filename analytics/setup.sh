#!/bin/bash

# Script de configuración para el sistema de informes analíticos
# Aprende Barbería y Monta tu Negocio

echo "=== Configuración del Sistema de Informes Analíticos ==="
echo "Este script configurará todo lo necesario para ejecutar el sistema."

# Verificar si Python está instalado
if command -v python3 &>/dev/null; then
    echo "✓ Python 3 encontrado"
    PYTHON_CMD=python3
elif command -v python &>/dev/null; then
    echo "✓ Python encontrado"
    PYTHON_CMD=python
else
    echo "❌ Python no está instalado. Por favor, instala Python 3.8 o superior."
    exit 1
fi

# Verificar versión de Python
PYTHON_VERSION=$($PYTHON_CMD -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "  → Versión de Python: $PYTHON_VERSION"

# Verificar e instalar pip
if $PYTHON_CMD -m pip --version &>/dev/null; then
    echo "✓ Pip encontrado"
else
    echo "❌ Pip no está instalado. Instalando..."
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
    $PYTHON_CMD get-pip.py
    rm get-pip.py
fi

# Crear entorno virtual
echo "Creando entorno virtual..."
$PYTHON_CMD -m pip install virtualenv
$PYTHON_CMD -m virtualenv .venv
source .venv/bin/activate || source .venv/Scripts/activate

# Instalar dependencias
echo "Instalando dependencias..."
pip install -r requirements.txt

# Verificar archivo de credenciales
if [ ! -f "analytics-key.json" ]; then
    echo "⚠️ No se encontró el archivo de credenciales analytics-key.json"
    echo "  → Debes obtener este archivo de la consola de Google Cloud"
    echo "  → Coloca el archivo en este directorio"
fi

# Crear directorios necesarios
mkdir -p charts

echo ""
echo "=== Configuración completada ==="
echo ""
echo "Para ejecutar el sistema:"
echo "1. Activa el entorno virtual: source .venv/bin/activate (Linux/Mac) o .venv\\Scripts\\activate (Windows)"
echo "2. Asegúrate de que analytics-key.json está en este directorio"
echo "3. Ejecuta el script principal:"
echo "   a. Para enviar un correo de prueba: python track_analytics.py --test"
echo "   b. Para generar un informe ahora: python track_analytics.py --now"
echo "   c. Para iniciar el programador: python track_analytics.py"
echo ""
echo "=== Para configurar el inicio automático ==="
echo "Para configurar el inicio automático en un servidor Linux, añade esto a crontab:"
echo "@reboot cd $(pwd) && source .venv/bin/activate && python track_analytics.py > analytics.log 2>&1 &"
echo ""

# Preguntar si desea configurar un servicio en systemd
read -p "¿Deseas configurar un servicio systemd para ejecución automática? (s/n): " setup_service

if [ "$setup_service" = "s" ] || [ "$setup_service" = "S" ]; then
    SERVICE_FILE="analytics-report.service"
    echo "[Unit]
Description=Servicio de Informes Analíticos para Aprende Barbería
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/.venv/bin/python $(pwd)/track_analytics.py
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target" > $SERVICE_FILE

    echo "Archivo de servicio creado: $SERVICE_FILE"
    echo "Para instalarlo, ejecuta estos comandos como administrador:"
    echo "sudo cp $SERVICE_FILE /etc/systemd/system/"
    echo "sudo systemctl daemon-reload"
    echo "sudo systemctl enable analytics-report.service"
    echo "sudo systemctl start analytics-report.service"
fi

# Enviar un correo de prueba
read -p "¿Deseas enviar un correo de prueba ahora? (s/n): " send_test

if [ "$send_test" = "s" ] || [ "$send_test" = "S" ]; then
    echo "Enviando correo de prueba..."
    $PYTHON_CMD track_analytics.py --test
    echo "Si no recibes el correo, verifica el archivo analytics_report.log para más detalles."
fi

echo ""
echo "Configuración completada. ¡El sistema está listo para usar!"
echo "" 