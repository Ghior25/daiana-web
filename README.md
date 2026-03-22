# Daiana Wawrysczuk — sitio personal

Landing estática: HTML5, CSS3, JavaScript (ES6+), sin frameworks. Lista para deploy en [Vercel](https://vercel.com).

## Antes de publicar

1. **Formspree**  
   - Creá un formulario en [formspree.io](https://formspree.io) y copiá el ID del endpoint.  
   - En `index.html`, reemplazá `YOUR_FORM_ID` en:  
     `action="https://formspree.io/f/YOUR_FORM_ID"`

2. **LinkedIn**  
   - En `index.html`, buscá `REEMPLAZAR_PERFIL` y poné la URL real del perfil.

3. **Meta Open Graph / canonical**  
   - Cuando tengas la URL definitiva (ej. `https://tu-dominio.vercel.app`), actualizá en `index.html`:  
     - `og:url`, `twitter:image` (base URL absoluta)  
     - `canonical`  
     - `og:image` y `twitter:image` si cambiás la ruta de la imagen social.

4. **Imagen hero**  
   - Reemplazá `assets/img/hero-portrait.svg` por una foto (JPG/WebP) y actualizá la ruta en `index.html` si cambia el nombre.

## Probar en local

Abrí `index.html` en el navegador o usá un servidor estático simple:

```bash
npx serve .
```

## Deploy en Vercel (resumen)

1. Subí el proyecto a GitHub. Lo ideal es que `index.html` esté en la **raíz del repositorio** (como en esta carpeta `daiana-web/`).
2. En Vercel: **Add New Project** → importá el repo.  
3. Si el repo tiene una subcarpeta (ej. todo dentro de `daiana-web/`), en **Project Settings → General → Root Directory** elegí esa carpeta.  
4. Framework preset: **Other** o detección automática de sitio estático.  
5. **Build command:** vacío. **Output directory:** `.` (raíz del proyecto configurado).  
6. Deploy. No hace falta `vercel.json` para un sitio estático simple.

### Conectar GitHub a Vercel

- Iniciá sesión en Vercel con GitHub.  
- Autorizá el acceso al repositorio cuando lo pida el asistente.  
- Cada `git push` a la rama principal redeploya automáticamente.

## Estructura

```
daiana-web/
  index.html
  favicon.svg
  robots.txt
  css/
    styles.css
    animations.css
  js/
    main.js
    form.js
  assets/
    img/
    icons/
```

## Licencia

Contenido y diseño para uso de Daiana Wawrysczuk.
