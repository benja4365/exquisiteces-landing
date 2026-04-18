# DESIGN.md — Exquisiteces by Laura

> Brand design system for Exquisiteces by Laura — artisan healthy pastry brand from Córdoba, Argentina.
> Use this file to generate any UI, landing page, social asset, or printed piece that must look and feel like this brand.

---

## Brand Essence

**Name:** Exquisiteces by Laura  
**Tagline:** Sin harina. Sin azúcar. Con todo el sabor.  
**Founded:** 2016, Córdoba, Argentina  
**Voice:** Warm, intimate, premium but never elitist. Like a friend who makes extraordinary things by hand.  
**Aesthetic:** Artisan editorial — Bon Appétit magazine warmth meets organic handmade soul.

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|---|---|---|---|
| **Crema Artesanal** | `#F4EFE4` | 244, 239, 228 | Primary background — always |
| **Rosa Exquisiteces** | `#C8185A` | 200, 24, 90 | Brand accent, CTAs, titles, buttons |
| **Espresso Cálido** | `#1C1007` | 28, 16, 7 | Primary text, logo, borders |

### Secondary Colors

| Name | Hex | RGB | Usage |
|---|---|---|---|
| **Canela** | `#C07840` | 192, 120, 64 | Warm accents, prices, eyebrows, decorative lines |
| **Salvia Natural** | `#5C8A5E` | 92, 138, 94 | Nature, health, botanical details |
| **Chocolate** | `#3D2514` | 61, 37, 20 | Body text on light backgrounds |
| **Crema Clara** | `#FAF7F2` | 250, 247, 242 | Section backgrounds, card fills |
| **Crema Oscura** | `#EDE7D5` | 237, 231, 213 | Subtle section variation, borders |

### Color Rules — NON-NEGOTIABLE

- ❌ **NEVER** use pure black `#000000`
- ❌ **NEVER** use pure white `#FFFFFF`
- ❌ Rosa over Salvia — low contrast, forbidden
- ❌ Espresso over Rosa — too aggressive, forbidden
- ✅ Maximum **3 colors per piece**
- ✅ Crema Artesanal as base background always
- ✅ All shadows must have warm beige-brown undertone, never cool grey

### Dark Backgrounds

When using dark backgrounds, use **Espresso Cálido** `#1C1007` — never pure black.
Text on dark: Crema Artesanal `#F4EFE4` at full opacity, or at 55% for secondary text.

---

## Typography

### Font Stack

| Role | Font | Fallback | Weight |
|---|---|---|---|
| **Display / Headlines** | Fraunces | Georgia, serif | 300, 400, 500 |
| **Display italic** | Fraunces Italic | Georgia italic | 300i, 400i |
| **Body / UI** | DM Sans | system-ui, sans-serif | 300, 400, 500 |

**Google Fonts import:**
```
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap
```

### Type Scale

| Element | Font | Size | Weight | Style |
|---|---|---|---|---|
| Hero headline | Fraunces | clamp(3.2rem, 5vw, 5.5rem) | 300 | Normal + italic accent |
| Section title | Fraunces | clamp(2.4rem, 4vw, 4rem) | 300 | Italic on accent word |
| Product name | Fraunces | 1.5rem | 400 | Normal |
| Quote / blockquote | Fraunces | clamp(1.8rem, 2.5vw, 2.8rem) | 300 | Italic |
| Stat number | Fraunces | 2.8rem | 300 | Normal |
| Body text | DM Sans | 0.95rem | 300 | Normal |
| Small body | DM Sans | 0.85rem | 400 | Normal |
| Eyebrow / label | DM Sans | 0.72rem | 400 | Uppercase, 0.18em tracking |
| Button | DM Sans | 0.82–0.9rem | 500 | Normal, 0.06em tracking |
| Nav links | DM Sans | 0.8rem | 400 | Uppercase, 0.1em tracking |

### Typography Rules

- Headlines always in Fraunces, never DM Sans
- Accent/emotional word in headline → Fraunces italic + Rosa color
- Body text always in DM Sans
- Eyebrows (section labels above titles) → DM Sans uppercase with flanking lines
- Line height: 1.0–1.1 for display, 1.6–1.8 for body
- ❌ Never Inter, Roboto, Arial, or system-ui for display text

---

## Spacing & Layout

### Base Unit: 8px

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | 8px | Tight gaps, inline spacing |
| `--space-sm` | 16px | Component padding small |
| `--space-md` | 24–28px | Card padding, standard gaps |
| `--space-lg` | 40–48px | Section internal spacing |
| `--space-xl` | 64–80px | Section padding mobile |
| `--space-2xl` | 100px | Section padding desktop |

### Grid

- Desktop: 12-column, max-width 1100–1200px, centered
- Content columns: 1, 2, or 3 — never 4+ for product displays
- Negative space: generous — 30–40% empty space per composition
- Asymmetric layouts preferred over perfectly centered grids

### Border Radius

- Cards / containers: `16–20px`
- Buttons: `100px` (fully rounded pill)
- Badges / tags: `100px`
- Images: `20–24px`
- ❌ Never sharp 0px corners on brand elements

---

## Components

### Buttons

**Primary (Rosa):**
```css
background: #C8185A;
color: #ffffff;
padding: 16px 32px;
border-radius: 100px;
font: 500 0.85rem/1 'DM Sans';
letter-spacing: 0.06em;
box-shadow: 0 4px 20px rgba(200,24,90,0.15);
transition: background 0.3s, transform 0.2s;
```
Hover: `background: #A31249`, `transform: translateY(-2px)`

**Secondary (Outline Rose):**
```css
border: 1.5px solid #C8185A;
color: #C8185A;
background: transparent;
padding: 12px 28px;
border-radius: 100px;
```
Hover: fill with `#C8185A`, text white

**Ghost (Text with arrow):**
```css
color: #3D2514;
font: 400 0.85rem 'DM Sans';
```
After pseudo: `→`, slides right on hover

### Cards

```css
background: #FAF7F2;
border: 1px solid rgba(28,16,7,0.07);
border-radius: 20px;
padding: 24–28px;
transition: transform 0.4s, box-shadow 0.4s;
```
Hover: `transform: translateY(-8px)`, `box-shadow: 0 24px 60px rgba(28,16,7,0.10)`

### Eyebrow Labels

```css
font: 400 0.72rem/1 'DM Sans';
letter-spacing: 0.18em;
text-transform: uppercase;
color: #C07840; /* Canela */
```
With flanking lines: `::before` and `::after` → 40px wide, 1px height, Canela color

### Badges / Tags

```css
font: 400 0.65–0.72rem/1 'DM Sans';
letter-spacing: 0.08–0.1em;
text-transform: uppercase;
padding: 5–7px 12–16px;
border-radius: 100px;
border: 1px solid [color];
```
Variants: Rosa (brand accent), Sage (health/nature), Canela (warmth)

### Stats / Numbers

```css
font: 300 2.8rem/1 'Fraunces';
color: #FAF7F2; /* on dark bg */
```
Accent suffix (g, %, +): Fraunces italic, Canela color

---

## Photography & Visual Style

**Reference:** Bon Appétit magazine editorial food photography

### Camera & Technical
- Camera: Canon EOS R5 (or equivalent reference)
- White balance: Fixed 4500K warm — never auto, never cool
- ISO: 100–400 max, no noise
- Exposure: 0 to +0.3, slightly lifted

### Lighting
- Single diffused light source, upper left, 45° elevation, 10 o'clock position
- Warm 4500K throughout entire frame — no exceptions
- Shadows fall toward lower right
- Shadow character: soft, gradual, warm beige-brown undertone
- No hard shadow edges anywhere
- No pure black in shadows — darkest zone = warm espresso brown
- No pure white in highlights — brightest zone = warm cream with golden undertone

### Color Palette for Photos
- Dominant tones: warm cream, beige, amber, espresso brown
- Accent: muted rose, sage green, honey gold
- ❌ No cool grays, no blues, no clinical whites

### Composition
- Three depth planes always: soft foreground / sharp hero / warm bokeh background
- 2–3mm contact shadow directly under each object (physical anchor)
- Generous negative space (30–40% of frame)
- Organic surfaces preferred: wood, linen, stone — never seamless studio backdrop
- Artisan imperfections welcome and intentional

### Style Rules
- ❌ No AI-generated look
- ❌ No plastic surfaces
- ❌ No artificial saturation
- ❌ No Instagram filters or HDR
- ✅ Photorealistic, natural, editorial
- ✅ Visible texture on all surfaces
- ✅ Handmade imperfections intentional

---

## Motion & Animation

### Principles
- Subtle and purposeful — never decorative for its own sake
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out sharp) for reveals
- Duration: 0.3s for micro-interactions, 0.6–0.8s for reveals

### Scroll Reveal
```css
opacity: 0 → 1;
transform: translateY(32px) → translateY(0);
duration: 0.8s;
easing: cubic-bezier(0.16, 1, 0.3, 1);
stagger: 0.1s between siblings;
```
Trigger: IntersectionObserver at 12% visibility threshold

### Hover States
- Cards: `translateY(-8px)` + warm shadow deepens
- Buttons primary: `translateY(-2px)` + shadow intensifies
- Links: color → Rosa, smooth 0.3s

### WhatsApp Float Button
- Pulse ring animation: scale 0.9 → 1.3, opacity 1 → 0, 2.5s infinite
- Ring color: `rgba(37,211,102,0.5)`

---

## Iconography & Decorative Elements

### Brand Mark
- Whisk + botanical botanical illustration in Rosa `#C8185A`
- Circular badge version: "PASTELERÍA SALUDABLE BY LAURA · EXQUISITECES ·"
- Vertical stacked version: whisk top + "PASTELERÍA SALUDABLE / EXQUISITECES / by Laura"

### Botanical Elements
- Fine-line herbs, branches, seeds — engraving illustration style
- Color: Salvia `#5C8A5E` or Canela `#C07840`
- Used as subtle background decoration, section dividers

### Decorative Patterns
- Oversized Fraunces italic text as watermark background (3–5% opacity)
- Thin 1px horizontal rules in Canela for section separators
- Organic blob shapes as background elements (not sharp geometric)

### What to Avoid
- ❌ Sharp rectangles with perfect corners
- ❌ Perfect circles used as decorative shapes
- ❌ Starburst / offer graphics
- ❌ Multi-color gradients
- ❌ Drop shadows with cool/neutral color

---

## Voice & Copy

### Tone
- Warm and personal — Laura speaks directly, first person
- Premium but accessible — quality without snobbery
- Short sentences. Ellipses for pause… Like this.
- Never clinical, never dietetic-sounding

### Key Messages
- "Sin harina. Sin azúcar. Con todo el sabor."
- "El placer que cuida."
- "Dulce sin culpa."
- "Hecho a mano, con amor, desde 2016."

### Copy Patterns
- Headline: Fraunces 300 normal + one italic Rosa word
- CTA: DM Sans 500, action verb first ("Pedir", "Ver", "Descubrir")
- Badge labels: Sin azúcar / Sin harina / Sin conservantes
- Eyebrow before section title: context label in Canela uppercase

---

## Do / Don't Summary

| ✅ Do | ❌ Don't |
|---|---|
| Warm cream backgrounds | Pure white or pure black backgrounds |
| Fraunces for all headlines | Inter, Roboto, Arial for headlines |
| Rosa as main accent | Multiple competing accent colors |
| Rounded pill buttons | Sharp-cornered buttons |
| Organic, editorial layouts | Rigid symmetric grids |
| Warm 4500K photography | Cool-toned or desaturated photos |
| Artisan imperfections | Overly perfect, sterile visuals |
| 3 colors max per piece | Rainbow / colorful compositions |
| Generous negative space | Cluttered, text-heavy layouts |
| Soft bokeh backgrounds | Flat solid color studio backdrops |
