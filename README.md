# Comandos Básicos de Git

Este documento describe los comandos esenciales de Git para gestionar los cambios en el repositorio de este proyecto.

---

## **Subir Cambios al Repositorio**

Estos comandos te permiten preparar tus cambios, guardarlos en tu historial local y luego subirlos al repositorio remoto.

```bash
# Agrega todos los archivos modificados y nuevos al área de staging.
# Esto prepara tus cambios para el próximo commit.
git add .

# Crea un nuevo commit (una "instantánea" de tus cambios) con un mensaje descriptivo.
# Reemplaza "nombre del cambio" con una descripción concisa de lo que hiciste.
git commit -m "nombre del cambio"

# Sube tus commits locales a la rama 'main' en el repositorio remoto 'origin'.
# Esto hace que tus cambios estén disponibles para otros.
git push origin main

# Sube tus commits locales a la rama 'omar' en el repositorio remoto 'origin'.
# Útil cuando trabajas en una rama específica de una funcionalidad.
git push origin omar

# Sube tus commits locales a la rama 'jonathan' en el repositorio remoto 'origin'.
# Similar al comando anterior, para la rama de Jonathan.
git push origin jonathan

----------------------------------------------------------------

# Descarga los últimos cambios de la rama 'main' del repositorio remoto 'origin'
# y los fusiona en tu rama local actual.
git pull origin main

# Descarga los últimos cambios de la rama 'omar' del repositorio remoto 'origin'
# y los fusiona en tu rama local actual.
git pull origin omar

# Descarga los últimos cambios de la rama 'jonathan' del repositorio remoto 'origin'
# y los fusiona en tu rama local actual.
git pull origin jonathan