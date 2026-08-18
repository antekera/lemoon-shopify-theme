---
description: Section schema conventions and boilerplate patterns for Lemoon
---

# Section Schema Conventions

## Schema structure

Every section ends with a `{% schema %}` block. Standard structure:

```json
{
  "name": "t:sections.section-name.name",
  "class": "section",
  "tag": "section",
  "disabled_on": {
    "groups": ["header", "footer"]
  },
  "settings": [...],
  "blocks": [...],
  "max_blocks": 12,
  "presets": [
    {
      "name": "t:sections.section-name.presets.name"
    }
  ]
}
```

## Required padding settings

Always include padding settings at the bottom of `settings[]`:

```json
{
  "type": "header",
  "content": "t:sections.all.padding.section_padding_heading"
},
{
  "type": "range",
  "id": "padding_top",
  "min": 0,
  "max": 100,
  "step": 4,
  "unit": "px",
  "label": "t:sections.all.padding.padding_top",
  "default": 36
},
{
  "type": "range",
  "id": "padding_bottom",
  "min": 0,
  "max": 100,
  "step": 4,
  "unit": "px",
  "label": "t:sections.all.padding.padding_bottom",
  "default": 36
}
```

Apply padding in Liquid:

```liquid
style="padding-top: {{ section.settings.padding_top }}px; padding-bottom: {{ section.settings.padding_bottom }}px;"
```

## Common setting types

| Type           | Use for                          |
| -------------- | -------------------------------- |
| `text`         | Short single-line strings        |
| `textarea`     | Multi-line text                  |
| `richtext`     | Formatted text with bold/links   |
| `image_picker` | Image selection                  |
| `color`        | Color picker                     |
| `color_scheme` | Theme color scheme selector      |
| `select`       | Fixed list of options            |
| `checkbox`     | Boolean toggle                   |
| `range`        | Numeric slider                   |
| `collection`   | Collection picker                |
| `product`      | Product picker                   |
| `url`          | Link input                       |
| `header`       | Visual grouping label (no value) |

## Localization keys

All `name`, `label`, `content`, `info`, and `default` (text) values must reference translation keys in `locales/en.json` and `locales/es.json`. Never hardcode strings in the schema.

## Blocks

- Give each block type a unique `type` string (kebab-case)
- Always include `"limit": N` on blocks that shouldn't repeat unlimitedly
- Use `{{ block.shopify_attributes }}` on each block's root element

## disabled_on

Sections that are not meant for the header or footer group should include:

```json
"disabled_on": {
  "groups": ["header", "footer"]
}
```
