# Tourist Book: guía de recuperación y migración

Esta guía sirve para volver a poner `tourist-book.com` en línea en otro hosting si el actual
(Vercel) deja de funcionar. **No contiene ningún secreto**: los valores reales de las variables
de entorno están fuera del repositorio (ver `.env.example` para los nombres).

> Resumen rápido: el código está en GitHub (rama `main`), los datos están en Supabase y Stripe
> (no en Vercel). Vercel solo ejecuta el código. Cambiar de hosting = desplegar el mismo código
> con las mismas variables y apuntar el dominio.

---

## 1. Qué tecnologías usa

| Pieza | Detalle |
|---|---|
| Framework | **Next.js 16.4** (App Router) con **React 19** |
| Lenguaje | JavaScript (sin TypeScript) |
| Node.js | **mínimo 20.9** (requisito de Next 16). Recomendado: la versión LTS actual (22 o 24) |
| Estilos | Tailwind CSS 4 |
| Base de datos y usuarios | Supabase (Postgres + Auth + Storage) |
| Pagos | Stripe (suscripciones) |
| Correo | Resend |
| IA | Anthropic (asistente del livret Premium y traducción) |
| PDF y QR | `pdf-lib`, `qrcode` (librerías, no necesitan servicio) |
| Analítica | Google Analytics, solo si el visitante acepta las cookies |

La lista exacta de paquetes está en `package.json` y `package-lock.json`.

## 2. Instalar, compilar y ejecutar

```bash
git clone https://github.com/IlestChouette/tourist-book.git
cd tourist-book
cp .env.example .env.local        # y rellenar los valores (ver sección 4)
npm ci                            # instala exactamente lo del package-lock
npm run dev                       # desarrollo en http://localhost:3000
npm run build                     # compila para producción
npm start                         # ejecuta lo compilado (puerto 3000, o el de la variable PORT)
```

Si `npm run build` falla por memoria en un hosting pequeño, compilar en otro equipo o en CI y
subir el resultado, o aumentar la memoria disponible para la compilación.

## 3. Servicios externos y dónde viven los datos

**Importante: los datos NO están en Vercel.** Si se borra el despliegue de Vercel, no se pierde
ningún dato de clientes.

| Servicio | Para qué | Qué guarda |
|---|---|---|
| **Supabase** | Base de datos Postgres, inicio de sesión (Auth) y archivos (Storage) | Cuentas de anfitriones y hoteles, livrets, alojamientos, check-ins, cahier de consignes, equipo, facturación. Archivos en dos buckets: `media` (imágenes públicas: logos, fotos) e `identity` (documentos de identidad de los huéspedes, **privado**) |
| **Stripe** | Cobro de suscripciones | Clientes, suscripciones y facturas. El webhook llama a `/api/webhooks/stripe` |
| **Resend** | Envío de emails | Los correos enviados (avisos, relevos del cahier, enlaces) |
| **Anthropic** | Asistente IA y traducción | No guarda datos del negocio |
| **Google Analytics** | Estadísticas de visitas | Solo si se acepta el banner de cookies |
| **WhatsApp Cloud API (Meta)** | Aviso de solicitudes de traslado | Opcional |
| **GitHub** | Código fuente | El repositorio |

El esquema de la base de datos está en la carpeta `supabase/` (`schema.sql` y las migraciones
incrementales). **Para recuperar los datos usad una copia de seguridad de Supabase**, no los
archivos SQL: los SQL describen la estructura, no el contenido. Ver la lista de comprobación
fuera del repositorio.

### Tareas programadas (importante al migrar)

La aplicación necesita tres tareas que llaman a su propia dirección con la cabecera
`Authorization: Bearer <CRON_SECRET>`:

| Ruta | Frecuencia | Dónde está configurada hoy |
|---|---|---|
| `/api/cron/no-property-reminder` | una vez al día | `vercel.json` (09:00 UTC) |
| `/api/cron/listing-tips-reminder` | una vez al día | `vercel.json` (09:15 UTC) |
| `/api/cron/hotel-digest` | cada 5 minutos | **Supabase** (trabajo programado `pg_cron`, ver `supabase/hotel_digest_cron.sql`) |

La tercera **no depende de Vercel**: la lanza Supabase contra la dirección pública del sitio, así
que sigue funcionando mientras el dominio apunte al nuevo hosting. Las dos primeras hay que
recrearlas en el nuevo hosting (ver sección 5).

## 4. Variables de entorno

Los nombres y su explicación están en **`.env.example`**. Los valores reales se guardan fuera de
GitHub (panel de Vercel y copia local). Sin ellas la web no arranca o fallan funciones concretas
(pagos, correo, base de datos).

Reglas:
- Las que empiezan por `NEXT_PUBLIC_` se incrustan al **compilar**: si se cambian, hay que volver a
  compilar y desplegar.
- `SUPABASE_SERVICE_ROLE_KEY` también firma los códigos PIN de los hoteles y los enlaces firmados.
  **Si se cambia, todos los PIN guardados dejan de funcionar** y cada persona tendría que volver a
  fijar el suyo. Mantened el mismo valor al migrar.
- `CRON_SECRET` debe ser el mismo valor en el hosting y en el trabajo programado de Supabase.

## 5. Volver a desplegar en otro hosting

Orden recomendado de dificultad: **Netlify ≈ Hostinger (Node) < Cloudflare**.

Antes de empezar, en cualquiera de los tres:
1. Importad o subid el repositorio (rama `main`).
2. Cargad **todas** las variables del `.env.example` (valores reales).
3. Comando de compilación `npm run build`, versión de Node 22 o superior.
4. Probad primero en la dirección temporal que dé el hosting, **antes** de tocar el dominio.

### Netlify
- Next.js funciona con el soporte nativo de Netlify (detecta el framework solo).
- Imágenes optimizadas (`next/image`): las gestiona Netlify automáticamente.
- Tareas programadas: Netlify no lee `vercel.json`. Crear dos *scheduled functions* (o usar un
  planificador externo como cron-job.org) que llamen a las dos rutas de la sección 3 con la cabecera
  `Authorization: Bearer <CRON_SECRET>`.
- Comprobar tras desplegar: inicio de sesión, un pago de prueba, y que `src/proxy.js` (refresca la
  sesión en cada petición) se ejecuta bien.

### Hostinger (Node.js)
- Hace falta un plan con **aplicaciones Node.js** (Business/Cloud) o un VPS. El alojamiento compartido
  básico no sirve para Next.js con servidor.
- Crear una aplicación Node.js desde el repositorio, comando de compilación `npm run build`, comando
  de inicio `npm start`, variables en el panel.
- Al ser un servidor Node normal, **todo funciona tal cual**, incluidas las imágenes optimizadas
  (usa `sharp`, que ya viene en las dependencias de Next).
- Tareas programadas: en el panel, *Cron Jobs*, con `curl -H "Authorization: Bearer <CRON_SECRET>"
  https://tourist-book.com/api/cron/no-property-reminder` y la otra ruta, una vez al día.

### Cloudflare
- Es la opción que más ajustes pide. Para Next.js 16 con servidor hay que usar **Workers con el
  adaptador OpenNext para Cloudflare** (`@opennextjs/cloudflare`) y activar la compatibilidad con Node
  (`nodejs_compat`). Cloudflare Pages clásico con `next-on-pages` solo ejecuta en *edge* y no es lo
  recomendado para esta aplicación. **Comprobad la documentación actual de Cloudflare antes de
  empezar: esta parte cambia con frecuencia.**
- Cosas a verificar: que funcione `src/proxy.js` (middleware de sesión), el uso de `crypto` de Node
  (firmas y PIN), y la generación de PDF.
- Imágenes: el optimizador de Vercel no existe. Usar Cloudflare Images o servir las imágenes sin
  optimizar (opción `images.unoptimized` en `next.config.mjs`).
- Tareas programadas: *Cron Triggers* de Workers.

### Cosas que no dependen del hosting
- Los redireccionamientos de `www` → dominio principal y las cabeceras de seguridad están en
  `next.config.mjs` y viajan con el código.

## 6. Qué cambiar solo por estar en Vercel

| Elemento | Qué hacer al migrar |
|---|---|
| `vercel.json` (2 tareas programadas diarias) | Recrearlas en el nuevo hosting (sección 3 y 5) |
| Optimización de imágenes de `next/image` (7 archivos) | Netlify y Hostinger: sin cambios. Cloudflare: cambiar a imágenes sin optimizar o a Cloudflare Images |
| `.vercel/` y el enlace del proyecto | Se ignora; no es necesario fuera de Vercel |
| Variable `VERCEL_OIDC_TOKEN` (aparece en `.env.local`) | No la usa el código; no hace falta |
| Funciones sin duración personalizada | El código no fija `maxDuration`; en hostings con límites cortos (10 s), las rutas lentas (PDF, asistente IA) podrían cortarse: probar |

No hay ningún paquete `@vercel/*` ni código que dependa de variables de Vercel.

## 7. Apuntar el dominio a un nuevo hosting

1. Desplegad y probad en la dirección temporal del nuevo hosting.
2. Un día antes, bajad el TTL de los registros DNS del dominio (p. ej. a 300 s).
3. En el panel de DNS del registrador, cambiad **solo** el registro del dominio raíz (tipo A, o
   ALIAS/ANAME si el hosting lo pide) y el de `www` (tipo CNAME) a los valores que indique el nuevo
   hosting. **No toquéis los registros de correo** (MX, SPF, DKIM, DMARC): sirven a Resend y al reenvío
   de correo.
4. Esperad la propagación (de minutos a unas horas). El certificado HTTPS lo emite el nuevo hosting.
5. Con el dominio ya en el nuevo hosting, comprobad que **no cambia nada fuera**, porque todo lo
   demás apunta al dominio, no a Vercel:
   - Supabase → Authentication → *URL Configuration* (Site URL y Redirect URLs).
   - Stripe → Webhooks → endpoint `https://tourist-book.com/api/webhooks/stripe`.
   - El trabajo programado de Supabase (`hotel-digest`) llama al mismo dominio.
6. Prueba final: registro, inicio de sesión, un pago de prueba, un correo de relevo y el cahier de un
   hotel.

## 8. Plan de emergencia en menos de una hora

1. Crear cuenta en Netlify (o abrir un Node.js en Hostinger).
2. Importar `IlestChouette/tourist-book`, rama `main`.
3. Pegar las variables de entorno.
4. Desplegar y probar en la dirección temporal.
5. Cambiar los registros DNS del dominio (sección 7).
6. Recrear las dos tareas diarias (sección 5).
