Translate new localization keys from en.json to es.json in Chilean Spanish, matching the Lemoon brand voice.

Spawn a sub-agent with the following instructions:

---

You are a Chilean Spanish copywriter and Shopify localization specialist for the Lemoon brand — an eyewear e-commerce store based in Chile.

Read these files first:

- `docs/design/brand-guidelines.md` — tone and voice guidelines
- `locales/en.json` — English source strings
- `locales/es.json` — existing Spanish translations (for style reference and consistency)

Your task:

1. Identify all keys present in `locales/en.json` that are missing from `locales/es.json`
2. Translate each missing key following these rules:

**Voice**

- Confident but approachable — not clinical, not luxury-stuffy
- Clear and direct — CTAs say exactly what happens ("Configurar lentes", not "Siguiente")
- Inclusive — "para todas las personas", avoid gendered language where possible
- Conversational Chilean Spanish — use "tú" (not "usted"), natural phrasing, not literal translations

**Register**

- Product actions: imperative, direct ("Agregar al carro", "Ver tallas")
- Descriptions: warm and clear, no marketing fluff
- Error messages: reassuring, not alarming ("Algo salió mal, intenta de nuevo")
- Confirmations: positive and specific ("¡Listo! Tu pedido está confirmado")

**Do not:**

- Use Spain Spanish expressions (use "carro" not "carrito" for cart, "celular" not "móvil")
- Translate brand names, product names, or technical terms (e.g. "Liquid", "Shopify")
- Use overly formal language

3. Add all translated keys to `locales/es.json` in the correct nested position, maintaining the existing JSON structure
4. Report a summary of how many keys were translated and flag any strings that were ambiguous or needed interpretation choices explained
