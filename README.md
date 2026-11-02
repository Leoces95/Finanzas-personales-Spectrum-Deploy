# Finanzas Personales · Libro de cuentas

Práctica 3 · Despliegue de Software · 2026

En esta práctica se toma una aplicación web de finanzas personales (API REST en .NET 10 con un CRUD completo y un frontend en HTML/CSS/JS) y la publicamos en dos entornos: primero en un servidor local con **IIS** y después en la nube con **Azure App Service**.

## Integrantes

- Daniel Zapata Ramírez
- María Paulina Vargas Lenis
- Mariana Suaza Serna
- Leonel Antonio Martínez Silgado
- Sebastián Ciro Medellín

## Distribución de responsabilidades

| Integrante | Responsabilidad | Contribución verificable |
|---|---|---|
| Daniel Zapata Ramírez | Modelo de datos; publicación en Azure (App Service, HTTPS Only, `/health`) | Carpeta `Models/` (`Movimiento.cs`), capturas del App Service y `/health` en `evidencias/azure/` |
| María Paulina Vargas Lenis | API REST (CRUD); IIS: Application Pool | Carpeta `Controllers/` (`MovimientosController.cs`), capturas del Application Pool en `evidencias/iis/` |
| Mariana Suaza Serna | Interfaz web completa (HTML, CSS y JavaScript); IIS: sitio, ruta física y puerto 8085 | Carpeta `wwwroot/` (`index.html`, `styles.css`, `app.js`), capturas del sitio y binding en `evidencias/iis/` |
| Leonel Antonio Martínez Silgado | Repositorio; publicación en Azure (recursos, Application Setting y URL pública) | Solución, `Program.cs` con `/health`, `launchSettings.json`, `README.md`, capturas de Application Settings y URL pública en `evidencias/azure/` |
| Sebastián Ciro Medellín | Almacenamiento de datos en memoria; IIS: verificación en navegador y `/health` | Carpeta `Data/` (`AlmacenMovimientos.cs`), capturas de `localhost:8085` y `/health` en `evidencias/iis/` |

## Tecnología utilizada

Las tecnologías utilizadas son:

- **.NET 10 (ASP.NET Core Web API):** API estructurada con controladores y validación del modelo.
- **HTML, CSS y JavaScript:** frontend estático servido desde `wwwroot`, sin dependencias externas.
- **Datos en memoria:** sin base de datos; los datos se pierden al reiniciar la aplicación.
- **Visual Studio:** abrir `FinanzasPersonales.sln`.
- **IIS (Windows 11):** servidor web local para la primera publicación.
- **Azure App Service:** servicio en la nube para la publicación pública con HTTPS.

## Descripción de la aplicación

Es un libro de cuentas personal. Permite registrar entradas (ingresos) y salidas (gastos) y ver cuánto queda.

### Endpoints de la API

- `GET /api/movimientos` -> Lista todos los movimientos.
- `GET /api/movimientos/{id}` -> Busca un movimiento por ID.
- `POST /api/movimientos` -> Crea un movimiento nuevo.
- `PUT /api/movimientos/{id}` -> Actualiza un movimiento existente.
- `DELETE /api/movimientos/{id}` -> Elimina un movimiento.
- `GET /health` -> Comprobación de salud, responde `OK`.

## Estructura del repositorio

```
Finanzas-personales-Spectrum-Deploy/
├─ README.md
├─ .gitignore
├─ FinanzasPersonales.sln
├─ FinanzasPersonales/          # código fuente (proyecto ASP.NET Core)
│  ├─ FinanzasPersonales.csproj
│  ├─ Program.cs
│  ├─ Properties/launchSettings.json   # puertos locales 52222 (https) y 52223 (http)
│  ├─ Models/Movimiento.cs
│  ├─ Data/AlmacenMovimientos.cs
│  ├─ Controllers/MovimientosController.cs
│  └─ wwwroot/                  # frontend
│     ├─ index.html
│     ├─ styles.css
│     └─ app.js
└─ evidencias/
   ├─ iis/
   └─ azure/
```

## Publicación

| Entorno | Fecha | URL |
|---|---|---|
| IIS (local) | 30/10/2026 | `http://localhost:8085` |
| Azure App Service | 30/10/2026 | https://finanzas-personales-spectrum-deploy-g4budhgbf7f9h9fk.brazilsouth-01.azurewebsites.net/ |

- Comprobación de salud: `/health` responde `OK` en ambos entornos.
- Video de evidencia: https://drive.google.com/file/d/197oJPfGfUikLE10zmuZ95jQqtNaoAwfF/view?usp=sharing

## Cómo reproducirlo

### Requisitos

- Windows 11 con **.NET 10 SDK** (para compilar) y Visual Studio 2022 o superior (opcional).
- Para IIS: característica de Windows **Internet Information Services** y el **.NET 10 Hosting Bundle**.
- Para Azure: una cuenta de Azure con suscripción activa.

### Ejecutar en local

**Repositorio: https://github.com/Leoces95/Finanzas-personales-Spectrum-Deploy**

**Con Visual Studio**

1. Clonar el repositorio: `git clone https://github.com/Leoces95/Finanzas-personales-Spectrum-Deploy.git`
2. Abrir `FinanzasPersonales.sln`.
3. Dejar `FinanzasPersonales` como proyecto de inicio y presionar **F5** (o Ctrl+F5).
4. Se abre el navegador con la aplicación en `https://localhost:52222/` (o `http://localhost:52223/`). Los puertos están definidos en `FinanzasPersonales/Properties/launchSettings.json`, que va incluido en el repositorio, así que son los mismos en todos los equipos.
5. Probar el CRUD (anotar, editar y borrar) y abrir `/health`, que debe responder `OK`.

**Por terminal**

```
git clone https://github.com/Leoces95/Finanzas-personales-Spectrum-Deploy.git
cd Finanzas-personales-Spectrum-Deploy
dotnet run --project FinanzasPersonales
```

Usa los mismos puertos de `launchSettings.json`. Abrir la URL que muestra la consola (`Now listening on: ...`), normalmente `https://localhost:52222/`.

### Generar la versión publicable

```
dotnet publish FinanzasPersonales -c Release -o publish
```

La carpeta `publish` se usa tanto en IIS como en Azure. También se puede hacer desde Visual Studio con clic derecho en el proyecto → **Publicar**.

### Verificar la publicación

| Entorno | Qué abrir | Resultado esperado |
|---|---|---|
| IIS | `http://localhost:8085` | Se ve el libro de cuentas y el CRUD funciona |
| IIS | `http://localhost:8085/health` | `OK` |
| Azure | `https://finanzas-personales-spectrum-deploy-g4budhgbf7f9h9fk.brazilsouth-01.azurewebsites.net` | Se ve el libro de cuentas y el CRUD funciona |
| Azure | `https://finanzas-personales-spectrum-deploy-g4budhgbf7f9h9fk.brazilsouth-01.azurewebsites.net/health` | `OK` |

## Notas para verificar el despliegue

- **Datos en memoria:** al reiniciar la aplicación (o reciclar el Application Pool) el registro queda vacío. Es el comportamiento esperado.
- **IIS:** requiere el **.NET 10 Hosting Bundle** instalado. Application Pool dedicado con "Sin código administrado", sitio apuntando a la carpeta publicada y puerto propio. Puerto usado: **8085**.
- **Azure:** App Service con runtime .NET 10, Application Setting `ASPNETCORE_ENVIRONMENT=Production` y **HTTPS Only** habilitado.
  - Recurso: `finanzas-personales-spectrum-deploy` (grupo de recursos `rg-finanzas-personales`, suscripción Azure for Students).
  - Región Brazil South, sistema operativo Windows, plan de tarifa Gratis (F1).
  - Publicación desde Visual Studio con Zip Deploy. Para descargar el perfil de publicación se habilitó la autenticación básica de SCM de forma temporal. El perfil de publicación no se incluye en el repositorio.
  - Nota: el plan gratuito suspende la app tras un tiempo sin tráfico, por lo que la primera carga puede tardar unos segundos.
- Las capturas están en `evidencias/iis/` y `evidencias/azure/`, sin secretos ni credenciales.
