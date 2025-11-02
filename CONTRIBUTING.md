# Contributing Guide

Gracias por tu interés en contribuir a este proyecto. Cualquier aportación es bienvenida, ya sea corrigiendo errores, añadiendo nuevas funcionalidades, mejorando la documentación o compartiendo ideas.

## Cómo contribuir

### 1. Haz un fork del repositorio

1. Haz clic en **Fork** en la esquina superior derecha del repositorio.
2. Clona tu fork de forma local:

```
git clone https://github.com/tuUsuario/pdf2excel-app.git
```
3. Crea una rama para tu aportación:
```
git checkout -b nombre-de-tu-rama
```

### 2. Estándares de código

- Para mantener la calidad y consistencia del proyecto:

- Sigue la estructura del proyecto actual.

- Usa nombres de variables claros y descriptivos.

- Comenta el código solo cuando sea necesario para entender la lógica.

- Evita dependencias innecesarias.

### 3. Commits

Usa mensajes de commit claros y con contexto. Algunos prefijos recomendados:
| Prefijo   | Uso                                            |
| --------- | ---------------------------------------------- |
| feat:     | Nueva funcionalidad                            |
| fix:      | Corrección de error                            |
| docs:     | Cambios en la documentación                    |
| refactor: | Cambios de código que no alteran funcionalidad |
| test:     | Añadir o mejorar tests                         |
| chore:    | Mantenimiento, tareas menores                  |

Ejemplos:

```
feat: añadir soporte para múltiples tablas en una página
fix: corregir error al procesar PDFs sin texto
docs: actualizar instrucciones de instalación
```
### 4. Pull Requests

Antes de abrir un PR:

1. Asegúrate de que tu rama está actualizada con main.

2. Ejecuta el proyecto y verifica que funciona correctamente.

3. Describe claramente los cambios y su propósito.

Al crear el Pull Request:

- Explica qué problema resuelve o qué mejora aporta.

- Incluye capturas o ejemplos si aplica.

- Si introduce una nueva dependencia, justifica por qué es necesaria.

### 5. Issues

- Si detectas un error o tienes una propuesta de mejora:

- Revisa que no exista un Issue previo sobre el tema.

- Crea uno nuevo con la siguiente información:

Para errores:

- Pasos para reproducirlo

- Comportamiento esperado y actual

- Sistema operativo, navegador o entorno usado

Para propuestas:

- Descripción clara

- Posible enfoque de implementación (si lo tienes)

### 6. Estilo del proyecto

- Backend: Python con FastAPI

- Frontend: HTML, CSS y JavaScript simple

- Mantener el enfoque del proyecto: simple, útil, sin complejidad innecesaria.

--- 
Gracias por ayudar a mejorar este proyecto. Tu contribución es valorada.