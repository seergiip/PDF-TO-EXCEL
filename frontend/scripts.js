const btn = document.getElementById("convertBtn");
const fileInput = document.getElementById("fileInput");
const status = document.getElementById("status");
const spinner = document.getElementById("spinner");
const dropZone = document.getElementById("dropZone");

function showStatus(msg, type = "") {
  status.textContent = msg;
  status.className = "status";
  if (type === "error") status.classList.add("error");
  if (type === "success") status.classList.add("success");
}

function handleFile(file) {
  fileInput.files = new DataTransfer().files; // limpiar input
  const dt = new DataTransfer();
  dt.items.add(file);
  fileInput.files = dt.files;
}

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
  if (e.dataTransfer.files.length) {
    const file = e.dataTransfer.files[0];
    if (file.type !== "application/pdf") {
      showStatus("Solo se permiten archivos PDF.", "error");
      return;
    }
    handleFile(file);
    showStatus(`Archivo seleccionado: ${file.name}`);
  }
});

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
      } catch (e) {
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
