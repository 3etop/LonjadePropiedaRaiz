# Publicacion del sitio

## Estado actual

El sitio funciona como archivos estaticos y no requiere instalacion de paquetes.
Abra `index.html` para revisarlo. Los formularios preparan mensajes para WhatsApp
y correo; el visitante debe confirmar cada envio en su aplicacion. No existe
backend ni confirmacion de entrega. No se han integrado testimonios ni credenciales.

El buscador local esta en `assets/js/main.js`, en `searchPages`. Al crear una pagina
o seccion, agregue su titulo, ruta desde la raiz y terminos relacionados.
No utiliza servicios externos ni envia la consulta a Google.

## 1. Confirmar informacion

- Validar con la Lonja los pasos del servicio, documentos, cobertura, honorarios y
  plazos. La orientacion publicada no sustituye esa confirmacion.
- Revisar contactos, horarios y politica de datos con el responsable del negocio.
- No solicitar documentos confidenciales por el formulario inicial.

## 2. Publicar cuando tenga acceso

- Confirmar dominio, subcarpeta y tecnologia del hosting antes de configurar URLs.
- Subir `index.html`, las otras paginas HTML, `avaluos/` y `assets/`.
- No publicar `referencias/`, esta guia ni archivos privados de configuracion.
- Activar HTTPS y elegir una direccion principal (con o sin www).
- Si sustituye un sitio existente, guardar copia y configurar redirecciones 301
  desde sus rutas anteriores hacia las equivalentes nuevas. No eliminar rutas
  publicadas sin revisar su trafico y enlaces.
- Comprobar enlaces, PDF, imagenes, navegacion movil y formularios en el dominio.

## 3. Activar correo automatico (pendiente)

No se puede activar ni comprobar sin hosting y proveedor de correo.
La preparacion de Cloudflare Turnstile esta documentada en
[TURNSTILE.md](TURNSTILE.md). Es un plan de integracion; el CAPTCHA real aun no
esta activado. No publicar esta documentacion como parte del sitio.

1. Identificar si el servidor permite PHP, Node.js o funciones de servidor.
2. Elegir un proveedor SMTP o de correo transaccional y verificar el dominio.
3. Configurar SPF, DKIM y DMARC siguiendo las indicaciones del proveedor.
4. Guardar credenciales solo en el servidor, fuera de archivos publicos y del
   JavaScript del navegador. Nunca enviarlas por chat ni incluirlas en el sitio.
5. Implementar un endpoint HTTPS con validacion en servidor, limites de tamano,
   proteccion contra spam y limitacion de solicitudes. La suma del navegador
   no constituye proteccion contra bots.
6. Usar un remitente verificado; el correo del visitante debe ser Reply-To, no From.
   Enviar a la Lonja y una confirmacion al visitante sin permitir destinatarios
   arbitrarios. Evitar convertir el formulario en un servicio de spam.
7. Mostrar errores reales y distinguir aceptacion del proveedor de entrega final.
   Probar con cuentas autorizadas, incluidos fallos, duplicados y limites.
8. Solo entonces conectar los formularios al endpoint, actualizar el aviso de envio
   manual y revisar la politica de privacidad y los plazos de conservacion.

WhatsApp permanece manual. Automatizarlo requiere una integracion autorizada
independiente con WhatsApp Business Platform.

## 4. Indexacion y SEO (dominio pendiente)

- Agregar a cada pagina una URL canonical absoluta con su direccion publica real.
- Crear `sitemap.xml` con todas las paginas publicas y sus URLs definitivas. No
  incluir referencias, resultados de busqueda ni URLs locales `file:`.
- Crear `robots.txt` en la raiz del dominio con las reglas apropiadas y la URL
  absoluta del sitemap. Robots.txt no protege informacion privada.
- Completar og:url e imagenes sociales con URLs publicas verificadas y agregar la
  URL del negocio a los datos estructurados de la pagina principal.
- Verificar el dominio en Google Search Console y enviar el sitemap.
- Comprobar indexacion y datos estructurados con herramientas oficiales de Google.
- Revisar elegibilidad y completar el Perfil de Empresa en Google con datos
  consistentes. La indexacion y el posicionamiento no estan garantizados.
- Meta keywords no influye en el posicionamiento de Google.

## 5. Rendimiento y accesibilidad

- Medir con PageSpeed Insights o Lighthouse despues de publicar.
- Comprimir imagenes y generar WebP/AVIF conservando originales y calidad legible;
  medir peso y resultado antes de reemplazarlas. No se han convertido en esta etapa.
- Mantener carga diferida en imagenes fuera de la vista inicial y dimensiones
  explicitas cuando sean conocidas. No diferir la imagen principal.
- Configurar compresion y cache de recursos segun las posibilidades del hosting.
- Probar en telefonos reales, zoom al 200 %, teclado, lectores de pantalla y con
  movimiento reducido. Revisar contraste y que botones flotantes no tapen contenido.
- No incorporar analitica o rastreadores sin revisar sus implicaciones de privacidad.
