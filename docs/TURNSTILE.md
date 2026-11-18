# Preparacion de Cloudflare Turnstile

## Estado: plan de integracion, no activado

Este documento define la integracion pendiente. No se ha instalado un widget,
creado un endpoint ni configurado claves. No hay validacion de Turnstile activa.
Los formularios conservan su verificacion matematica y envio manual.

GitHub Pages solo sirve archivos estaticos: no puede guardar la clave secreta ni
validar tokens. Se necesita un backend HTTPS, por ejemplo una funcion de servidor
o un Cloudflare Worker. No es necesario trasladar todo el sitio a ese backend.
La tecnologia se elegira cuando se conozca el alojamiento disponible.

La suma del navegador no es proteccion real contra bots. Cambiarla por un codigo
visual o una casilla hecha en JavaScript tampoco lo seria.

## 1. Crear el widget

En el panel de Cloudflare, abrir Turnstile y crear un widget de tipo Managed.
Registrar solo los hostnames desde los que se publicaran los formularios.
Si se usa GitHub Pages con la URL prevista, confirmar primero que el hostname
real es `3etop.github.io`. Las rutas y subcarpetas no son hostnames.

- Site key: publica; se coloca en la configuracion del navegador.
- Secret key: privada; se guarda como secreto del backend, nunca en HTML,
  JavaScript publico, GitHub Pages ni commits.
- No pedir ni compartir secretos por chat.
- Las claves de prueba oficiales no deben quedar habilitadas en produccion.

## 2. Integrar ambos formularios

Puntos existentes:

- Cotizacion: `index.html`, formulario `quote-form`.
- Contacto: `nosotros/contactenos.html`, formulario `contact-form`.
- Logica compartida: `initializeQuoteForm` en `assets/js/main.js`.

Cuando el backend este disponible:

1. Cargar el script oficial desde
   `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`.
2. Renderizar un widget por formulario, con la site key publica.
3. Usar `action: "quote"` para cotizacion y `action: "contact"` para contacto.
4. Conservar validacion de campos, coincidencia de correos y mensajes accesibles.
   Sustituir solo entonces las etiquetas, entradas y validacion de la suma.
5. Capturar el token en el callback del widget. Al expirar o fallar, descartarlo,
   informar al usuario y permitir una nueva verificacion.
6. Enviar token y datos por POST HTTPS al backend. No incluirlos en la URL.
7. El backend debe validar Turnstile y ejecutar la operacion protegida en la misma
   solicitud. Nunca confiar en un booleano `captchaValido` enviado por el cliente.
8. Desactivar el boton mientras se procesa, restaurarlo al fallar, conservar los
   datos para corregir y renovar el token antes de un nuevo intento.
9. Si Cloudflare esta bloqueado o no carga, mostrar un error visible y ofrecer los
   datos de contacto directo; no simular una validacion exitosa.

## 3. Contrato propuesto del backend

Ruta propuesta, todavia inexistente: `POST /api/solicitudes`.
Si esta en otro dominio, configurar su URL publica y CORS con los origenes exactos
autorizados. Si se usan cookies, incorporar proteccion CSRF apropiada.

Peticion JSON:

```json
{
  "formType": "contact",
  "turnstileToken": "<token generado por el widget>",
  "fields": {
    "name": "...",
    "city": "...",
    "email": "...",
    "phone": "...",
    "subject": "...",
    "message": "..."
  }
}
```

Para `quote`, `fields` corresponde a los campos de cotizacion existentes
(incluida confirmacion de correo), sin la antigua pregunta matematica.
El servidor debe permitir solo tipos de formulario y campos esperados.

Validacion en servidor:

1. Limitar solicitudes y tamano de cuerpo; validar tipos, longitudes y campos.
2. Exigir un token no vacio, con longitud maxima de 2048 caracteres.
3. Hacer POST desde el servidor a
   `https://challenges.cloudflare.com/turnstile/v0/siteverify`, con `secret` y
   `response` (token). Nunca enviar datos personales del formulario a Siteverify.
4. Usar timeout y manejar fallos de red, HTTP o JSON como errores, no como exito.
5. Exigir `success === true` y verificar `hostname` contra la lista configurada.
   Exigir tambien la `action` esperada segun `formType`.
6. Los tokens duran 300 segundos y estan destinados a un solo uso. Rechazar
   tokens vencidos o duplicados y solicitar una nueva verificacion. No usar la
   deteccion de reutilizacion como unica defensa frente a solicitudes duplicadas:
   aplicar idempotencia propia a la operacion de envio.
7. Solo despues de validar, enviar el correo con un proveedor configurado.
   No aceptar destinatarios arbitrarios. Mantener el destino de la Lonja en servidor.
8. No registrar tokens, secretos ni cuerpos completos con datos personales.
9. Responder con errores explicitos y registrar detalles tecnicos saneados.

Respuestas propuestas:

- 422: datos invalidos.
- 403: verificacion rechazada, vencida o de hostname/action incorrectos.
- 429: limite de solicitudes excedido.
- 503: servicio de verificacion o correo no disponible.
- 200: operacion aceptada por el proveedor de correo; no equivale a entrega final.

El cliente no debe mostrar "enviado" solo porque el widget o Siteverify aprobaron.
La logica SMTP y el manejo de errores siguen las indicaciones de PUBLICACION.md.

## 4. Relacion con el envio manual

Turnstile no puede impedir que alguien abra directamente WhatsApp o un enlace
mailto. No se presentaran esas acciones como protegidas contra bots.
El despliegue de Turnstile debe vincularse a una operacion real en el backend,
como el envio de correo. WhatsApp puede seguir siendo una opcion manual separada.
No se introducira un endpoint de "verificacion exitosa" que aparente proteger
un envio efectuado unicamente en el navegador.

## 5. Pruebas necesarias antes de activar

- Token valido en cada formulario y envio real a cuentas autorizadas.
- Token ausente, falso, vencido, repetido y de action/hostname incorrectos.
- Script bloqueado, modo sin conexion, timeout y error de Cloudflare.
- Proveedor de correo caido, limite de solicitudes y doble clic.
- Correo invalido, campos vacios y discrepancia de confirmacion en cotizacion.
- Navegacion con teclado, lector de pantalla y anchos de 320 y 390 px.
- Verificar que la secret key no aparezca en archivos publicados, respuestas,
  mapas de fuentes ni historial de Git.
- Revisar la informacion de privacidad para el nuevo proveedor y tratamiento.
- Retirar claves de prueba y probar el hostname real con claves de produccion.

Estas pruebas no se han ejecutado: aun no existe la integracion ni sus claves.

## Documentacion oficial

- [Renderizado del widget](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Validacion en servidor](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Claves y escenarios de prueba](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
