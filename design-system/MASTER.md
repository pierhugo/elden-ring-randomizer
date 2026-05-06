# Design System: Elden Ring Randomizer Tracker

## Philosophy
- No AI slop - grounded, cohesive visual identity
- Dense layout for information navigation
- Elden Ring fantasy aesthetic - dark, gold, ancient

## Colors (OKLCH)

### Backgrounds
- `--bg-primary`: #0a0908 (deep charcoal black)
- `--bg-secondary`: #141210 (slightly lighter)
- `--bg-tertiary`: #1e1c1a (card backgrounds)
- `--bg-elevated`: #262220 (hover states, elevated cards)

### Gold Accent (Primary Brand)
- `--gold-500`: #c5a059 (main gold - borders, icons)
- `--gold-400`: #d4b06a (lighter gold - text, active)
- `--gold-600`: #a68545 (darker gold)
- `--gold-300`: #e3c97a (highlight gold)

### Text
- `--text-primary`: #e8e4dc (off-white, warm)
- `--text-secondary`: #a09a8c (muted warm gray)
- `--text-tertiary`: #6b6560 (very muted)

### Semantic
- `--boss-major`: #d4b06a (gold for major bosses)
- `--boss-regular`: #8b7355 (muted bronze for regular)
- `--hint-color`: #a68545 (item hints)

### Borders
- `--border-subtle`: #2a2624 (subtle borders)
- `--border-default`: #3d3835 (default borders)
- `--border-gold`: #c5a059 (gold accent borders)

## Typography

### Font Families
- **Display/Titles**: "Cinzel", serif - uppercase, serif, fantasy feel
  - Google Fonts: Cinzel
- **Body/UI**: "Source Sans 3", sans-serif - readable, clean
  - Google Fonts: Source Sans 3
- **Mono/Code**: "JetBrains Mono", monospace - for data, seeds

### Sizes
- Page title: 1.5rem, uppercase, tracking-widest
- Section headers: 1.125rem, uppercase, tracking-wide
- Card titles: 0.875rem
- Body: 0.8125rem
- Small/Labels: 0.6875rem

## Spacing System
- Consistent 4px base unit
- xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 24px, 2xl: 32px

## Layout
- Dense - minimal padding, max information
- Cards grid: 1 col mobile, 2 col tablet, 3 col desktop
- No unnecessary whitespace

## Components

### BossCard
- Dark background (#1e1c1a)
- Subtle border (#2a2624)
- Gold accent on major boss
- No hover animation - just border color change
- Dense padding

### ItemCard
- Same style as BossCard
- Gold accent for header

### RegionSection
- Gold accent bar on left
- Dense grid layout

### No Hovers
- No scale transforms
- No animations
- Subtle border color changes only when necessary

## Effects
- No shadows
- No gradients
- No blur
- Flat, solid colors
- Solid 1px borders

## Anti-Patterns Avoided
- ❌ Saturated colors everywhere
- ❌ Hover animations
- ❌ Scale effects
- ❌ Glass morphism
- ❌ Neon glows
- ❌ Rainbow colors
- ❌ Too many accent colors