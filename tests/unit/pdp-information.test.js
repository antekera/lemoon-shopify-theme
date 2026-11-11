import { describe, it, expect } from 'vitest';
import { pdpInformationContext, pdpInformationEngine, renderStandardDescriptionBlock } from '../helpers/pdp-information-renderer.mjs';

describe('PDP merchant information and policy-backed confidence', () => {
  it('uses the merchant first paragraph for the intro and preserves the complete description in details', () => {
    const context = pdpInformationContext();
    const engine = pdpInformationEngine();
    const intro = engine.renderFileSync('lemoon-product-intro', context);
    const details = engine.renderFileSync('lemoon-frame-information', { ...context, instance_id: 'pdp-test' });
    expect(intro).toContain('Un marco de acetato para cada día.');
    expect(intro).not.toContain('segundo párrafo');
    expect(details).toContain(context.product.description);
    expect(details).not.toContain('data-pdp-size-open');
    expect(details).not.toMatch(/<h[1-6][^>]*>\s*Características del producto\s*<\/h[1-6]>/);
    expect(details.match(/data-mm=/g)).toHaveLength(5);
  });

  it('omits an absent intro and never invents dimensions from a textual size', () => {
    const context = pdpInformationContext('size-only');
    context.product.description = '';
    context.product.metafields.custom.frame_size.value = 'Mediano (54-17-145)';
    const engine = pdpInformationEngine();
    expect(engine.renderFileSync('lemoon-product-intro', context).trim()).toBe('');
    const details = engine.renderFileSync('lemoon-frame-information', { ...context, instance_id: 'pdp-empty' });
    expect(details).not.toContain('data-mm=');
    expect(details).toContain('Las medidas de este armazón aún no están disponibles.');
  });

  it('escapes the plain-text intro while retaining its merchant wording', () => {
    const context = pdpInformationContext();
    context.product.description = '<p>Acetato & metal <em>liviano</em>.</p><p>Detalles.</p>';
    const html = pdpInformationEngine().renderFileSync('lemoon-product-intro', context);
    expect(html).toContain('Acetato &amp; metal liviano.');
    expect(html).not.toContain('<em>');
  });

  it('preserves existing entities without double escaping or turning encoded markup into HTML', () => {
    const context = pdpInformationContext();
    context.product.description = '<p>Diseño &amp; comodidad con &#8212; acetato&nbsp;ligero. &lt;script&gt;alert(1)&lt;/script&gt;<img src="x" onerror="alert(2)"></p>';
    const html = pdpInformationEngine().renderFileSync('lemoon-product-intro', context);
    expect(html).toContain('Diseño &amp; comodidad con &#8212; acetato&nbsp;ligero.');
    expect(html).not.toMatch(/&amp;(?:amp;|#8212;|nbsp;|lt;|gt;)/);
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toMatch(/<script|<img|onerror=/);
  });

  it('links actual policies, preserves the delivery start conditions and excludes sample benefits', () => {
    const context = pdpInformationContext();
    const html = pdpInformationEngine().renderFileSync('lemoon-pdp-purchase-confidence', context);
    expect(html).toContain('href="/policies/refund-policy"');
    expect(html).toContain('href="/policies/shipping-policy"');
    expect(html).toMatch(/6 meses/);
    expect(html).toContain('5 a 13 días hábiles');
    expect(html).toMatch(/pago/);
    expect(html).toMatch(/receta/);
    expect(html).not.toMatch(/365|30 días|gratis|Webpay/);
  });

  it('does not fabricate links, deadlines or payment methods when configuration is missing', () => {
    const context = pdpInformationContext();
    context.shop = {};
    const html = pdpInformationEngine().renderFileSync('lemoon-pdp-purchase-confidence', context);
    expect(html).not.toMatch(/href=|5 a 13|data-payment-type|6 meses/);
    const configured = pdpInformationContext();
    configured.shop.metafields.custom.plazo_entrega_receta.value = '';
    const withoutEstimate = pdpInformationEngine().renderFileSync('lemoon-pdp-purchase-confidence', configured);
    expect(withoutEstimate).not.toContain('5 a 13');
    expect(withoutEstimate).toContain('/policies/shipping-policy');
  });

  it('renders only the payment methods actually supplied by the shop', () => {
    const context = pdpInformationContext();
    context.shop.enabled_payment_types = ['visa', 'master'];
    const html = pdpInformationEngine().renderFileSync('lemoon-pdp-purchase-confidence', context);
    expect(html.match(/data-payment-type=/g)).toHaveLength(2);
    expect(html).toContain('data-payment-type="visa"');
    expect(html).toContain('data-payment-type="master"');
    expect(html).not.toContain('paypal');
  });

  it('does not infer prescription compatibility from configurator choices', () => {
    const context = pdpInformationContext();
    const engine = pdpInformationEngine();
    context.product.metafields.custom.prescription_type = { value: ['Monofocal'] };
    const withPrescription = engine.renderFileSync('lemoon-frame-information', { ...context, instance_id: 'verified-prescription' });
    context.product.metafields.custom.prescription_type.value = ['Sin receta'];
    const withoutPrescription = engine.renderFileSync('lemoon-frame-information', { ...context, instance_id: 'without-prescription' });
    context.product.metafields.custom.prescription_type.value = [];
    const empty = engine.renderFileSync('lemoon-frame-information', { ...context, instance_id: 'no-prescription' });
    delete context.product.metafields.custom.prescription_type;
    const missing = engine.renderFileSync('lemoon-frame-information', { ...context, instance_id: 'missing-prescription' });
    for (const html of [withPrescription, withoutPrescription, empty, missing]) {
      expect(html).not.toContain('Compatibilidad con receta');
      expect(html).not.toContain('Admite receta');
    }
    expect(withPrescription).not.toMatch(/Filtro azul|Fotocromático|Progresivo/);
  });

  it('omits invalid weight and renders a list of face shapes as readable text', () => {
    const context = pdpInformationContext();
    context.product.metafields.custom.frame_weight.value = -2;
    context.product.metafields.custom.face_shapes_compatible = { type: 'list.single_line_text_field', value: ['ovalado', 'corazón'] };
    const html = pdpInformationEngine().renderFileSync('lemoon-frame-information', { ...context, instance_id: 'partial-characteristics' });
    expect(html).not.toContain('-2 g');
    expect(html).not.toContain('<dt>Peso</dt>');
    expect(html).not.toMatch(/<dd>\s*g<\/dd>/);
    expect(html).toContain('Ovalado, corazón');
    expect(html).not.toContain('[object');
  });

  it('keeps the selected SKU in the product details without repeating it in the description block', () => {
    const context = pdpInformationContext();
    context.product.selected_or_first_available_variant = { sku: 'SYNTHETIC-001' };
    context.section = { blocks: [{ type: 'description' }] };
    expect(renderStandardDescriptionBlock(context)).not.toContain('SYNTHETIC-001');
    context.section.blocks.push({ type: 'buy_buttons' });
    expect(renderStandardDescriptionBlock(context)).not.toContain('SYNTHETIC-001');
    context.section.blocks = [{ type: 'description' }];
    context.product.description = '';
    expect(renderStandardDescriptionBlock(context)).not.toContain('SYNTHETIC-001');
    expect(pdpInformationEngine().renderFileSync('lemoon-frame-information', { ...context, instance_id: 'sku-test', show_sku: true })).toContain('SYNTHETIC-001');
  });
});
