# Neon sign concepts

## Neon wall sign (`canvas/Neon.dc.html`)

An orange-red neon sign carrying a lot of text, mounted on a clear acrylic backer with corner standoffs and a power cable. It uses real text, not a pixel grid, so every line can be retyped in the Design canvas.

**Content:**
- "Eastman Film Lab" wordmark as a lit Helvetica outline
- "film develop service" and the formats line (35mm · 120 · C-41 · E-6 · B&W)
- 필름 현상 · 스캔 · 인화 / DEVELOP · SCAN · PRINT
- The price list: C-41, B&W, E-6, 120, prints
- A film canister icon and @EASTMAN_LAB
- A blinking OPEN box, and 첫 방문이신가요? with chasing arrows pointing to the Kakao channel 이스트만랩

**Colors:** main tubes are Neon Red-Orange `#FF5A2C` and secondary tubes are Eastman Orange `#F6853D`; see the neon exception in `BRAND.md`.

**Animation:**
- Tubes hum faintly and some lines flicker.
- The "캔" tube is deliberately "dying", like a real worn neon tube.
- OPEN blinks and the arrows chase toward the Kakao channel name.
- Every animation loops within 12 seconds, so the video repeats smoothly.
- Animation stops for visitors whose device is set to reduce motion.

**Controls:** the canvas Tweaks panel has `neon` (tube color) and `animate` (turns the animation off).

## Files

- `canvas/Neon.dc.html`: the artboard. It's part of the "Eastman Sign Concepts" canvas: https://claude.ai/artifact/UHzDLAinPaijzW7ugXtuJF
- `videos/eastman-neon-wall.mp4`: a 12-second loop at 2100×1500 and 30 fps.

## Re-rendering

```sh
NODE_PATH=$(npm root -g) FFMPEG=/path/to/ffmpeg node tools/render-neon-video.mjs --scale 1.5
# a still frame instead of a video:
node tools/render-neon-video.mjs --still 0.2 --out neon.png
```
