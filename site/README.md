# Eastman Film Lab website

A static website for Eastman Film Lab. It follows the patterns from the Nice Film Club teardown (`docs/research/nicefilmclub/`), redrawn in Eastman's brand from `BRAND.md`.

There's no build step and no framework: plain HTML, one CSS file and one small JS file.

## Pages

| File | What's on it |
|---|---|
| `index.html` | LED marquee video hero, a ticker, the 3-step process (develop → scan → print), service cards with starting prices, first-visit Kakao QR, errored film states, a short FAQ |
| `pricing.html` | The full price list, copied from the menu board, plus an estimate builder (process → format → scan quality → rolls → prints) with a running total. On phones the total is a bar pinned to the bottom of the screen. |
| `guide.html` | How to drop film off, how files come back, film storage, film states, the full FAQ, and a Visit section |

## Editing

- **Prices:** edit them in `pricing.html` only. Each price cell has a `data-price` key, and the estimate builder reads its numbers from those cells. The starting prices on the `index.html` service cards and in two FAQ answers in `guide.html` are typed out by hand, so update those too.
- **Price unit:** `data-unit="1000"` on `#builder`, so `6.0` means 6,000원.
- **Copy:** every factual claim comes from the in-store boards in `assets/reference/`. Don't add turnaround times, an address or opening hours until they're confirmed.
- **Colors and fonts:** `css/site.css` imports `assets/brand/tokens.css`. Use only those tokens.

## Running and deploying

The pages link to shared repo assets (`../assets/…`, `../designs/led-marquee/…`), so serve the repo root:

```sh
python3 -m http.server 8000   # then open http://localhost:8000/site/
```

To deploy, publish the repo root (for example GitHub Pages from the root) and the site is at `/site/`.

## Still needed

- Address, opening hours and a map for the Visit section in `guide.html`. It's marked with a TODO comment, and for now it sends visitors to the Kakao channel.
- Real photos of the shop and of scans. The hero uses the LED marquee render for now.
- A domain, and absolute `og:image` URLs once the domain is known.
