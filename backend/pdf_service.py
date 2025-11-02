# pdf_service.py
import pdfplumber
import pandas as pd
from io import BytesIO
from typing import List, Tuple
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
import re

def extract_tables_with_pdfplumber(file_bytes: bytes) -> List[pd.DataFrame]:
    tables = []
    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            page_tables = page.extract_tables()
            for t in page_tables:
                # convertir a DataFrame limpiando None
                df = pd.DataFrame(t)
                df = df.fillna("").astype(str)
                tables.append(df)
    return tables

def ocr_pages_to_tables(file_bytes: bytes) -> List[Tuple[str, pd.DataFrame]]:
    """
    Fallback OCR: convierte cada página a texto y lo intenta formatear en columnas
    simples dividiendo por varios espacios. Devuelve tuplas (nombre_hoja, df).
    No es perfecto, pero para PDFs escaneados da algo usable.
    """
    dfs = []
    images = convert_from_bytes(file_bytes, dpi=200)  # requiere poppler
    for i, img in enumerate(images, start=1):
        text = pytesseract.image_to_string(img, lang='eng+spa')  # usa idiomas instalados
        # Intento rudimentario de convertir a columnas:
        lines = [l for l in (ln.strip() for ln in text.splitlines()) if l]
        if not lines:
            continue
        # Detectar si hay separadores por varias spaces o tabulaciones
        rows = []
        for line in lines:
            # Reemplazar multiples espacios por tabulador, luego split
            row = re.split(r'\s{2,}|\t', line)
            rows.append(row)
        # Normalizar largo de filas
        max_cols = max(len(r) for r in rows)
        norm_rows = [r + [""] * (max_cols - len(r)) for r in rows]
        df = pd.DataFrame(norm_rows)
        dfs.append((f"OCR_Pagina_{i}", df))
    return dfs

def convert_pdf_to_excel(file_bytes: bytes) -> BytesIO:
    """
    Intenta primero extraer tablas nativas con pdfplumber.
    Si no encuentra nada, hace fallback por OCR y genera un Excel.
    """
    excel_buffer = BytesIO()
    tables = extract_tables_with_pdfplumber(file_bytes)

    # Si no hay tablas, intentar OCR
    ocr_used = False
    ocr_results = []
    if not tables:
        ocr_used = True
        ocr_results = ocr_pages_to_tables(file_bytes)

    if not tables and not ocr_results:
        # No encontramos nada
        raise ValueError("No se encontraron tablas ni texto en el PDF (o el PDF es una imagen ilegible).")

    # Guardar en Excel: tablas pdfplumber en hojas Tabla_1..n, OCR en OCR_Pagina_x
    with pd.ExcelWriter(excel_buffer, engine="openpyxl") as writer:
        for i, df in enumerate(tables, start=1):
            # Intento de limpiar filas donde todo es vacío
            df_clean = df.loc[:, ~(df == "").all(axis=0)]
            df_clean.to_excel(writer, sheet_name=f"Tabla_{i}", index=False)
        for sheet_name, df in ocr_results:
            df.to_excel(writer, sheet_name=sheet_name[:31], index=False)  # nombre hoja max 31 chars

    excel_buffer.seek(0)
    return excel_buffer
