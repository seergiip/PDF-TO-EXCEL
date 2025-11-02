const btn = document.getElementById("convertBtn");
const fileInput = document.getElementById("fileInput");
const status = document.getElementById("status");
const spinner = document.getElementById("spinner");
const dropZone = document.getElementById("dropZone");

const previewContainer = document.getElementById("previewContainer");
const pdfPreview = document.getElementById("pdfPreview");
const historyContainer = document.getElementById("historyContainer");
const historyList = document.getElementById("historyList");

// Función para mostrar estado
function showStatus(msg, type = "") {
  status.textContent = msg;
  status.className = "status";
  if (type === "error") status.classList.add("error");
  if (type === "success") status.classList.add("success");
}

// Manejar archivo en el input
function handleFile(file) {
  const dt = new DataTransfer();
  dt.items.add(file);
  fileInput.files = dt.files;
}

// Previsualizar PDF
async function previewPDF(file) {
  const fileReader = new FileReader();
  fileReader.onload = async function () {
    const typedArray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.2 });

    const canvas = pdfPreview;
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = { canvasContext: context, viewport: viewport };
    await page.render(renderContext).promise;

    previewContainer.classList.remove("hidden");
  };
  fileReader.readAsArrayBuffer(file);
}

// Agregar a historial
function addToHistory(fileName) {
  const li = document.createElement("li");
  li.textContent = `${fileName} - ${new Date().toLocaleString()}`;
  historyList.prepend(li);
  historyContainer.classList.remove("hidden");
}

// Drag & drop
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  if (!e.dataTransfer.files.length) return;

  const file = e.dataTransfer.files[0];
  if (file.type !== "application/pdf") {
    showStatus("Solo se permiten archivos PDF.", "error");
    return;
  }

  handleFile(file);
  showStatus(`Archivo seleccionado: ${file.name}`);
  previewPDF(file);
  addToHistory(file.name);
});

// Cambio manual en el input
fileInput.addEventListener("change", () => {
  if (!fileInput.files.length) return;
  const file = fileInput.files[0];
  previewPDF(file);
  addToHistory(file.name);
});

// Convertir PDF a Excel
btn.addEventListener("click", async () => {
  if (!fileInput.files.length) {
    showStatus("Selecciona un PDF primero.", "error");
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  btn.disabled = true;
  spinner.classList.remove("hidden");
  showStatus("Procesando tu PDF...");

  try {
    const response = await fetch("https://pdf-to-excel-mqg9.onrender.com/convert", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errText = `Error ${response.status}`;
      try {
        const errJson = await response.json();
        if (errJson?.detail) errText = errJson.detail;
      } catch {
        errText = await response.text();
      }
      showStatus("Error: " + errText, "error");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resultado.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    showStatus("Conversión completada. Archivo descargado.", "success");
  } catch (err) {
    showStatus("Error en la conversión: " + err.message, "error");
  } finally {
    btn.disabled = false;
    spinner.classList.add("hidden");
  }
});

// Configurar worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.313/pdf.worker.min.js';
