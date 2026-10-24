# Current composition — minimal portrait study

## Anatomical portrait update

The current particle face uses the MediaPipe canonical face topology with a softly narrowed lower jaw, connected upper cranium and back of head, shaped ears and neck. Attribution and Apache-2.0 license are included in `THIRD_PARTY_NOTICES.md` and `public/models/mediapipe-LICENSE`. Run `node scripts/prepare-face.mjs` only when updating the source OBJ; the derived JSON is already checked in.

Particles are sampled by triangle surface area with extra density around eyes, nose and lips. View-dependent opacity emphasizes the silhouette while the middle of the face stays dark. There is no wireframe overlay. Pointer-follow has a limited yaw, and drag allows a wider profile inspection before a smooth automatic return. This remains a temporary anatomical portrait, not the final Vee likeness.

The current page shows only a full-height Vee particle portrait and four image-only cards in the background. All visible navigation, headings, captions, reset button, About/Projects sections and footer are removed from the page. The original modular components remain available in source for future work.

The portrait is scaled to fill approximately 90% of the screen height. Cards are 142×85 CSS pixels before perspective projection, half the original 284×170 artwork size, and sit at negative Z coordinates behind Vee. drei Html blending occlusion allows the 3D portrait to obscure cards. The only active card still opens the real KasperskyOS case. Screen-reader labels remain without visible text. Mobile uses the same minimal scene with a narrower card spread and fewer particles. The pointer reacts and drag rotates the portrait; the automatic return remains.

# Vee Portfolio — Phase 1

Next.js 15 App Router + React 19 + TypeScript + Three.js + React Three Fiber + drei. Client-loaded WebGL, static export, no backend or AI services.

## Run

Requires Node.js 20.9+ (tested with Node 24). From the extracted project directory:

```sh
npm ci
npm run dev
```

Open http://localhost:4173. To use another port, run `npx next dev -p 3000`.

```sh
npm run typecheck
npm run build
```

The production output is `out/`. A static HTTP server can serve this directory. Do not open index.html through file://.

## Vercel

Import the source into a Git repository and import that repository in Vercel. Select Next.js, build command `npm run build`, install command `npm ci`; use the framework's detected output settings. No environment variables are required. This project uses `output: 'export'`; alternatively publish `out/` to any static host.

## Architecture / source tree

```
src/
  app/                  page.tsx, layout.tsx, globals.css
  components/
    SceneLoader.tsx     dynamic import, WebGL detection, React error boundary
    scene/              PortfolioScene, SceneCamera, BackgroundParticles, ProjectObjects
    vee/                VeeController, VeePlaceholder, VeeAvatar, types, surface
    portfolio/          ProjectCard, ProjectList
    ui/                 Header, SceneHint, AssistantPanel
  data/                 projects.ts, profile.ts
  lib/                  scene-config.ts, motion.ts
public/
  images/kos-cover.webp
  models/               put a future GLB here
scripts/dev.mjs         development launcher
```

- `VeeController` owns drag, constrained rotation, cursor response, automatic return and reset. No full-scene orbit controls.
- `surface.ts` creates a sculpted procedural head using cross-sections and localized facial relief: sockets, brow, bridge, nose tip, lips, chin; separate ears and neck. It is a placeholder, not a scanned face or final Vee likeness.
- `VeePlaceholder` renders one BufferGeometry point cloud, a dark head shell and dark neck. Shader animation uses uniforms; no geometry rebuild per frame. Geometry is disposed when unmounted.
- `VeeAvatar` loads a GLB with useGLTF and clones the skeleton. Pass `modelUrl="/models/vee.glb"` to `VeeController` to replace the particles. Normalize the future model to face +Z, centered on X, approximate bounds Y -2.2…2.6. Motion and scene placement stay outside the avatar renderer.
- Shared `VeeProps`: modelUrl, rotation, lookAtTarget, speaking, emotionalState, interactionEnabled, qualityLevel. Only rotation and base interaction are implemented. Other fields are reserved; eye tracking, speech and expressions are not implemented.
- `ProjectObjects` uses drei Html transform for real HTML cards at distinct XYZ coordinates. `ProjectList` gives independent access outside Canvas and replaces floating cards on mobile.
- `scene-config.ts` centralizes point counts and DPR. Default head sampling: 54,000 desktop / 14,000 mobile plus neck (22%) and ears (7%); one point-cloud draw call. Medium quality is available. No post-processing.
- `AssistantPanel` is an explicit dormant integration point, returning null.

## Interaction and accessibility

Desktop cursor parallax; head drag with limited rotation and automatic return after release; explicit Reset view button; semantic project links; focus-visible outlines; About/Projects anchors; skip link; reduced-motion disables idle, parallax, drift and transitions but keeps direct user drag. Cards remain stationary on hover, with contrast feedback. Mobile uses a separate horizontal touch list below the portrait; pan-y on Canvas preserves vertical page scrolling. Resume is clearly unavailable until a real document is supplied. Only the KasperskyOS case has an external link.

## Assets and limitations

KasperskyOS cover: https://re-hash.github.io/Mypage/assets/hero.png (user's supplied published case), resized to WebP. Other covers are explicitly prototype CSS illustrations, not published project screenshots. Demonstration cards are noninteractive articles. No invented links, metrics or achievements.

The image reference was not attached to this task. The procedural face follows the written direction and does not claim exact reference matching. Facial anatomy and female likeness need visual review and replacement with a licensed/custom GLB for Phase 2. No blinking, lip-sync, voice, AI chat or backend is implemented.

Fallback: Canvas support is probed before loading the dynamic scene; unsupported contexts and React scene loading failures show a static decorative portrait area and direct users to the independent HTML project list. No claim of device FPS; real laptop/mobile profiling remains required. Browser checks, build results and known limitations are reported separately in the delivery message.
