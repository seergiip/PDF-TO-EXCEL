# PDF to Excel Converter

Una herramienta sencilla y rápida para convertir archivos PDF con tablas en hojas de cálculo Excel listas para usar. Ideal para estudiantes, profesionales y cualquier persona que necesite transformar datos de forma eficiente.

## 🚀 Descripción

Este proyecto convierte tablas encontradas en archivos PDF en un archivo Excel estructurado. Si el PDF está escaneado o no contiene tablas detectables, la herramienta utiliza OCR para extraer texto y generar un resultado útil.

El objetivo es ofrecer una experiencia rápida, accesible y que ahorre tiempo en tareas repetitivas de extracción de datos.

## ✨ Características

- Conversión de PDF a Excel con múltiples tablas
- Soporte para PDFs escaneados mediante OCR
- Resultado con múltiples hojas según número de tablas
- Interfaz web simple y lista para usar

## 🧰 Tecnologías

- **Backend:** FastAPI (Python)
- **Frontend:** HTML, CSS, JavaScript
- **OCR:** Tesseract + pdf2image
- **Procesamiento:** pdfplumber, pandas, openpyxl

## 🛠️ Instalación en Local

1. Clonar el repositorio  
   ```bash
   git clone https://github.com/tuUsuario/pdf2excel-app.git
2. Instalar dependencias (desde ``/backend``)
    ```
    pip install -r requirements.txt
    ```
3. Ejecutar el servidor
    ```
    uvicorn main:app --reload
    ```
4. Abrir el archivo ``index.html`` ubicado en ``/frontend`` para utilizar la interfaz.

## 📍 Roadmap
- Implementar login y límites por usuario
- Exportación adicional a CSV y Google Sheets

## 🤝 Contribuciones
Las contribuciones son bienvenidas. Si deseas colaborar, abre un issue o una pull request.

## 📄 Licencia
MIT © 2025 seergiip.