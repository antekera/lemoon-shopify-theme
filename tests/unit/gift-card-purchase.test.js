import { expect, test, vi } from 'vitest';
import { addGiftCard } from '../../assets/lemoon-gift-card-purchase.js';
const data = () => {
  const form = new FormData();
  form.set('id', '900123'); form.set('quantity', '1');
  form.set('properties[__shopify_send_gift_card_to_recipient]', 'true');
  form.set('properties[Recipient email]', 'regalo@example.test');
  form.set('properties[Recipient name]', 'Persona de prueba');
  form.set('properties[Message]', 'Un regalo para ti.');
  return form;
};
test('native cart submission preserves the selected denomination and recipient properties', async () => {
  const form = data();
  const fetcher = vi.fn(async () => ({ ok:true, json:async () => ({variant_id:900123,quantity:1}) }));
  expect(await addGiftCard(form, '/es/cart/add.js', fetcher)).toEqual({variant_id:900123,quantity:1});
  expect(fetcher).toHaveBeenCalledWith('/es/cart/add.js', expect.objectContaining({method:'POST',body:form}));
  expect(form.get('properties[__shopify_send_gift_card_to_recipient]')).toBe('true');
  expect(form.get('properties[Recipient email]')).toBe('regalo@example.test');
});
test('a rejected gift card never resolves as a successful cart addition', async () => {
  const fetcher = vi.fn(async () => ({ok:false,json:async () => ({status:422,description:'Unavailable'})}));
  await expect(addGiftCard(data(),'/cart/add.js',fetcher)).rejects.toThrow('gift_cart_rejected');
});
test('HTML from a password page never masquerades as a successful cart addition', async () => {
  const fetcher = vi.fn(async () => ({ok:true,json:async () => { throw new SyntaxError('HTML'); }}));
  await expect(addGiftCard(data(),'/cart/add.js',fetcher)).rejects.toThrow();
});
test('a success response must confirm the chosen variant and quantity', async () => {
  for (const body of [{}, {variant_id:900124,quantity:1},{variant_id:900123,quantity:0}]) {
    const fetcher=vi.fn(async()=>({ok:true,json:async()=>body}));
    await expect(addGiftCard(data(),'/cart/add.js',fetcher)).rejects.toThrow('gift_cart_unconfirmed');
  }
});
test('invalid or duplicate variant ids never leave the browser', async () => {
  for (const id of ['','invalid','0','-1']) {
    const form=data(); form.set('id',id); const fetcher=vi.fn();
    await expect(addGiftCard(form,'/cart/add.js',fetcher)).rejects.toThrow('gift_variant_invalid');
    expect(fetcher).not.toHaveBeenCalled();
  }
  const form=data(); form.append('id','900124'); const fetcher=vi.fn();
  await expect(addGiftCard(form,'/cart/add.js',fetcher)).rejects.toThrow('gift_variant_invalid');
  expect(fetcher).not.toHaveBeenCalled();
});
test('submission is limited to a same-origin native cart path', async () => {
  for (const path of ['https://other.example/cart/add.js','//other.example/cart/add.js','/checkout','/cart/add.js?redirect=https://other.example']) {
    const fetcher=vi.fn();
    await expect(addGiftCard(data(),path,fetcher)).rejects.toThrow('gift_cart_endpoint_invalid');
    expect(fetcher).not.toHaveBeenCalled();
  }
});

test('the purchase form cannot silently submit a different quantity', async () => {
  const form=data(); form.set('quantity','2'); const fetcher=vi.fn();
  await expect(addGiftCard(form,'/cart/add.js',fetcher)).rejects.toThrow('gift_quantity_invalid');
  expect(fetcher).not.toHaveBeenCalled();
});

test('adding another matching card confirms the cumulative line quantity', async () => {
  const fetcher=vi.fn(async()=>({ok:true,json:async()=>({variant_id:900123,quantity:2})}));
  await expect(addGiftCard(data(),'/cart/add.js',fetcher)).resolves.toEqual({variant_id:900123,quantity:2});
});
