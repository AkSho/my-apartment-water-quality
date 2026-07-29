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
- /shower-filter-vs-water-softener: `src/routes/shower-filter-vs-water-softener.tsx` — `og:image` meta
- /do-shower-filters-work-for-hard-water: `src/routes/do-shower-filters-work-for-hard-water.tsx` — `og:image` meta
- /water-softener-for-apartment: `src/routes/water-softener-for-apartment.tsx` — `og:image` meta
- /portable-water-softener-for-shower: `src/routes/portable-water-softener-for-shower.tsx` — `og:image` meta
- /shower-head-water-softener: `src/routes/shower-head-water-softener.tsx` — `og:image` meta
- Water tool homepage: `index.html` — `og:image` meta property
- Water tool /hair: `hair/index.html` — `og:image` meta property
