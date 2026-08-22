# Lemoon icon library

The **Icon** component set in Figma and [`lemoon-icon.liquid`](../../snippets/lemoon-icon.liquid) are the shared source for Lemon’s UI icons.

- Canvas: 24 × 24px
- Stroke: 1.75px, round caps and joins
- Color: semantic `currentColor` in Shopify; use a semantic Figma text/stroke color in designs
- Do not resize individual path geometry. Scale the component or SVG uniformly.

Available names: `search`, `user`, `shopping-bag`, `heart`, `x`, `arrow-left`, `arrow-right`, `chevron-right`, `chevron-down`, `check`, `shield-check`, `package`, `rotate-ccw`, `message-circle`, `instagram`, `tiktok`, `star`, `info`.

## Shopify

```liquid
{% render 'lemoon-icon', icon: 'search', size: 24, label: 'Buscar' %}
```

For decorative icons, omit `label` to apply `aria-hidden="true"`.

## Current Figma reuse

- **Input:** `Search` for `Icon=Leading`; `ChevronRight` for `Icon=Trailing`.
- **Select:** `ChevronDown`.
- **Product Card:** `Heart` for the wishlist action.
- **Announcement Bar:** `ArrowLeft`, `ArrowRight`, `X`, `Instagram`, and `TikTok` at their context-appropriate sizes.

Always use an `Icon` component instance in these components rather than a text glyph or a newly drawn vector.
