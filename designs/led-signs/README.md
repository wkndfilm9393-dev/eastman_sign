# LED blade sign concepts

These are animated LED sign concepts in the style of the viral European pharmacy-cross signs, with a film-lab shape in place of the cross. They're drawn in Eastman orange `#F6853D` on black; see `BRAND.md` at the repo root.

| Concept | Shape | Video |
|---|---|---|
| A | 35mm frame with sprocket holes cut through the sign | `videos/eastman-led-a-35mm-frame.mp4` |
| B | Round lens aperture | `videos/eastman-led-b-aperture.mp4` |
| C | 35mm film canister with the spool on top | `videos/eastman-led-c-film-canister.mp4` |

All three run the same ~63-second program loop:
1. Wordmark scroll
2. Film-leader countdown (3-2-1)
3. Spinning 3D canister
4. Spiral tunnel pulsing at 120 BPM
5. Camera iris opening and closing
6. Film strip that speeds up until it blurs
7. Spinning 3D "E"
8. "Light leak" pattern
9. 현상 · 스캔 · 인화 scroll
10. OPEN, then the current time
11. Strobe

The strobe flashes 2.5 times a second, below the three-flashes-per-second photosensitivity guideline.

## Files

- `canvas/`: the Claude Design canvas source. `Main.dc.html` holds the sign engine, and `Aperture` and `Canister` import it with a different `shape`. Live canvas: https://claude.ai/artifact/UHzDLAinPaijzW7ugXtuJF
- `videos/`: rendered MP4s, 1200×1500, 30 fps, one full loop each, so they can play on repeat.

## Re-rendering

```sh
NODE_PATH=$(npm root -g) FFMPEG=/path/to/ffmpeg node tools/render-led-videos.mjs --scale 1.5
```

Flags:
- `--fps`: frame rate (default 30)
- `--seconds`: length (default 63.4, one full loop)
- `--scale`: resolution multiplier on 800×1000 (default 1)
- `--shapes`: which signs to render (default `frame,aperture,canister`)

The script needs Playwright's Chromium and network access to Google Fonts for Noto Sans KR. The OPEN/clock scene shows the time in Asia/Seoul at the moment of rendering.
