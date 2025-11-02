# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .pdf_service import convert_pdf_to_excel

app = FastAPI(title="PDF2Excel - Dev")

# CORS para desarrollo - quítalo o restringe en producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # cambia a tu dominio en prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/convert")
async def convert(file: UploadFile = File(...)):
    # Validación básica
    if not file:
        raise HTTPException(status_code=400, detail="No se subió ningún archivo.")
    # Aceptamos también algunos tipos comunes que pueden venir
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        # no todos los navegadores llenan content_type perfecto
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF.")

    file_bytes = await file.read()
    try:
        excel_file = convert_pdf_to_excel(file_bytes)
    except ValueError as e:
        # 400 con mensaje claro para que el frontend lo muestre
        return JSONResponse(status_code=400, content={"detail": str(e)})
    except Exception as e:
        # Log en consola (útil para depuración)
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": "Error interno en el servidor: " + str(e)})

    return StreamingResponse(
        excel_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=resultado.xlsx"}
    )
