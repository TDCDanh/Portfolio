# Color Scheme Change: Green → Blue

## Steps

- [x] 1. Create TODO.md
- [x] 2. Update `favicon.svg` - Change green `#00e676` / `#00c853` to blue `#448AFF` / `#2979FF`
- [x] 3. Update `favicon.svg` base64 data URI in `index.html`
- [x] 4. Update CSS variables in `index.html` (`--accent`, `--accent-dim`, `--accent-glow`, `--accent-glow2`, `--border`)
- [x] 5. Update all hardcoded green color values in `index.html`
- [x] 6. Update `main.jsx` - Change `behindGlowColor` and `innerGradient`
- [x] 7. Update `ProfileCard.jsx` - Change default `behindGlowColor`
- [x] 8. Update `ProfileCard.css` - Change default `--behind-glow-color`
- [x] 9. Build verified - Success ✅

## Background: Dark Green → Dark Blue

## Steps

- [x] 1. Update `index.html` CSS variables: `--bg`, `--bg2`, `--bg3`, `--surface`, `--surface2`, `--text`, `--text2`, `--text3`
- [x] 2. Update `index.html` nav background color match
- [x] 3. Build verified - Success ✅

## 3D Model Viewer below Projects Section

## Steps

- [x] 1. Create `src/ModelViewer.jsx` - React component using `@react-three/fiber` Canvas + `@react-three/drei` OrbitControls & useGLTF
- [x] 2. Create `src/ModelViewer.css` - Styled wrapper with responsive sizing
- [x] 3. Update `index.html` - Add `<div id="model-viewer-root">` inside `#projects` section with section label
- [x] 4. Update `src/main.jsx` - Import and mount `ModelViewer` component
- [x] 5. Build verified - Success ✅
