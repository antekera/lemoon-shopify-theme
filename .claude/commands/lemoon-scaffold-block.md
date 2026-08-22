Scaffold a new reusable snippet (block partial) for the Lemoon theme.

The user will provide a snippet name (e.g. "card-testimonial" or "icon-star").

Steps:

1. Convert the name to kebab-case for the filename (e.g. `snippets/card-testimonial.liquid`)
2. Read 1-2 existing snippets from `snippets/` for reference (prefer similar type if identifiable)
3. Create the snippet file in `snippets/` with:
   - A clear HTML structure using semantic elements
   - All variables accepted as explicit parameters (no reliance on parent scope)
   - A comment block at the top listing all accepted parameters and their types, e.g.:
     ```liquid
     {%- comment -%}
       Parameters:
       - title {String}
       - image {Image}
       - url {String}
     {%- endcomment -%}
     ```
4. Show the user the `{% render %}` call they need to use to include this snippet, with all parameters

Follow all conventions in `.claude/rules/liquid-conventions.md`.
