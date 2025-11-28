# Bocaditos

Repositorio del desarrollo web del proyecto *Bocaditos*, creado como parte del Proyecto Integrador I en UTRM. Este sitio está orientado a la gestión de donadores y administración de productos en una plataforma juvenil y funcional.

## Versión actual

- Versión: 1.0.0
- Última actualización: 06 de noviembre de 2025
- Sprint: 3
- Estado: Estructura funcional completa con módulos de login, dashboard de donadores y panel administrativo.

---

## Estructura del repositorio

- `index.html`: Página principal
- `login.html`: Acceso de usuarios
- `dashboard-admin.html`: Panel de administración
- `dashboard-donador.html`: Panel de donadores
- `css/styles.css`: Estilos generales
- `js/admin.js`, `js/donador.js`, `js/app.js`: Lógica de interacción
- `docs/scrum.md`: Documentación del proceso SCRUM

---

## Recursos utilizados

- HTML5, CSS3, JavaScript
- Git y GitHub para control de versiones
- Metodología SCRUM para gestión ágil

---

## Enlaces relacionados

- [Repositorio de diseño (Figma)](https://figma.com/tu-enlace)
- [Repositorio de base de datos](https://github.com/tu-equipo/base-datos)
- [Presentación final](https://github.com/vaguer2/sitio-web)

---

## Clonar este repositorio

```
git clone https://github.com/vaguer2/sitio-web.git
```

---

## Electron (ejecutar como app de escritorio)

- **Requisitos:** Tener `node.js` y `npm` instalados en Windows.
- **Instalación y ejecución (PowerShell):**

```powershell
cd "c:\Users\olive\Downloads\Bocaditos app\Bocaditos"
npm install
npm run start
```

Nota: el paquete `electron` está declarado en `package.json` como dependencia de desarrollo. Si prefieres no instalar dependencias globales puedes ejecutar `npx electron .`.

Esto abrirá una ventana de escritorio que carga `login.html` como entrada.

