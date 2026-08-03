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

## Add Hotvitlon Project to Projects Carousel

## Steps

- [x] 1. Copy `index.html` + 300 frame images from `C:\Users\PC\Downloads\ezgif-28510ce4df1ce231-jpg` to `public/hotvitlon/`
- [x] 2. Add Hotvitlon project card to SET 1 of `index.html` carousel
- [x] 3. Add Hotvitlon project card to SET 2 (duplicate for seamless loop)
- [x] 4. Build verified - Success ✅

## Fix Broken Images & Hotvitlon Landing Page

## Steps

- [x] 1. Create `public/hotvitlon/index.html` — GOLDEN EGG landing page (300-frame scroll animation, relative frame paths)
- [x] 2. Update `index.html` — convert project-card image paths + hotvitlon link to relative paths (SET 1)
- [x] 3. Update `index.html` — convert project-card image paths + hotvitlon link to relative paths (SET 2)
- [x] 4. Update `arts.html` — convert 14 artwork image paths `/Portfolio/assets/pics/picN.jpg` → `assets/pics/picN.jpg`
- [x] 5. Build verified - Success ✅
