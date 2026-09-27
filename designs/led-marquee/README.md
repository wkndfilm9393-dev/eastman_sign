# Suspended LED marquee: product render

A photoreal-style product shot of a hanging rectangular LED marquee sign. It's a real 3D scene rendered with three.js, not an AI image, so the text and dots are exact.

## The sign

- **Size:** 160 cm wide × 60 cm deep × 18 cm tall, hung from the ceiling on two slim black rods.
- **Four sides:** matte black LED-matrix panels, 10 mm dot pitch, in Eastman Orange `#F6853D`. The front is 156 × 16 dots and each end is 57 × 16 dots.
  - Front: `EASTMAN FILMLAB`, static.
  - Ends and back: `C-41 • B&W • E-6 • SCAN • PRINT • 35MM / 120`, scrolling. One full pass takes exactly 10 seconds, so the video loops.
- **Bottom:** a warm orange diffuser panel that glows downward like an architectural light fixture.
- **Camera:** below the sign at a three-quarter angle, 35 mm lens. Dark seamless studio backdrop with a faint orange haze.

The text is used exactly as specified: "EASTMAN FILMLAB", with no space. Elsewhere the brand writes it as "Eastman Film Lab".

## Files

- `eastman-led-marquee.png`: hero still, 2400×1600.
- `eastman-led-marquee.mp4`: 10-second loop, 1920×1280, 30 fps.
- `scene/index.html`: the three.js scene. `window.renderAt(seconds)` draws one frame.

## Re-rendering

```sh
npm i three@0.169.0 --prefix /tmp/three   # anywhere outside the repo
export NODE_PATH=$(npm root -g) THREE_DIR=/tmp/three/node_modules/three FFMPEG=/path/to/ffmpeg
node tools/render-marquee.mjs --still 2.2 --out designs/led-marquee/eastman-led-marquee.png
node tools/render-marquee.mjs --out designs/led-marquee/eastman-led-marquee.mp4
```

The render script runs Chromium's software WebGL (SwiftShader), so it works without a GPU.
