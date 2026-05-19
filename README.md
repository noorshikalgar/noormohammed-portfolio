# Noor Portfolio

A personal portfolio built with React, TypeScript, and Vite.

The current default experience is a raw-markdown-inspired landing page with editor-style navigation, syntax-influenced color treatment, and a minimal content-first layout.

## Stack

- React 19
- TypeScript
- Vite
- Custom CSS
- Lucide icons
- Nginx for static serving in container builds

## Project Structure

```txt
src/
  App.tsx
  main.tsx
  styles.css
  data/
  components/
  vendor/
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

- The app is designed as a static frontend.
- Styling includes a vendored local CSS foundation under `src/vendor/picoforge`.
- Alternative archived portfolio views still exist in the codebase and can be accessed through query-based view modes.

## Credits

- Syntax Zed theme inspiration: https://github.com/syntaxfm/syntax-zed-theme
