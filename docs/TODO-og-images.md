# TODO: Branded OG Images

Both sites currently use existing product/content photos as og:image placeholders.
Proper 1200x630 branded OG images are a pending design deliverable.

## Requirements
- Dimensions: 1200x630 px
- Text and faces must be inside the center 1:1 safe zone (630x630 centered)
- One image per site minimum

## Current placeholders
- **agsoftener.com**: `https://agsoftener.com/assets/hero.png` (product hero shot)
- **myapartmentwaterquality.com**: `https://www.myapartmentwaterquality.com/assets/mineral-buildup-showerhead.jpg`

## Where to update once ready
- PDP: `src/routes/__root.tsx` — `og:image` meta property
- Water tool homepage: `index.html` — `og:image` meta property
- Water tool /hair: `hair/index.html` — `og:image` meta property
