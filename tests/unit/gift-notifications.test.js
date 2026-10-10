import { expect, test } from 'vitest';
import { notificationContext, renderNotification } from '../helpers/gift-notification-renderer.mjs';
test('self-purchase shows the real native code, amount and card destination', () => {
  const html=renderNotification('gift-card-created');
  expect(html).toContain('Tu tarjeta de regalo');
  expect(html).toContain('$60.000 CLP');
  expect(html).toContain('A1B2 3C4D 5E6F 7G8H');
  expect(html).toContain('href="https://example.test/gift-card/sample"');
  expect(html).not.toContain('Válida hasta');
});
test('a recipient gets their name, sender and optional personal message', () => {
  const ctx=notificationContext();
  Object.assign(ctx.gift_card,{recipient:{nickname:'Sofi',name:'Sofía',email:'sofi@example.test'},customer:{name:'Camila',email:'camila@example.test'},message:'Para tus próximos lentes.\nCon cariño.'});
  const html=renderNotification('gift-card-created',ctx);
  expect(html.replace(/<[^>]*>/g, '')).toContain('Hola Sofi'); expect(html).toContain('Camila');
  expect(html).toContain('Para tus próximos lentes.<br');
});
test('names and message cannot inject HTML into the notification', () => {
  const ctx=notificationContext();
  Object.assign(ctx.gift_card,{recipient:{name:'<img src=x onerror=alert(1)>',email:'r@example.test'},customer:{name:'<script>bad()</script>'},message:'<a href="https://other.example">Click</a>'});
  const html=renderNotification('gift-card-created',ctx);
  expect(html).toContain('&lt;img'); expect(html).toContain('&lt;script&gt;');
  expect(html).not.toContain('<script>'); expect(html).not.toContain('<a href="https://other.example">');
});
test('missing sender uses the configured store and recipient falls back to email', () => {
  const ctx=notificationContext(); ctx.gift_card.recipient={email:'persona@example.test'};
  const html=renderNotification('gift-card-created',ctx);
  expect(html.replace(/<[^>]*>/g, '')).toContain('Hola persona@example.test'); expect(html.replace(/<[^>]*>/g, '')).toContain('de Lemoon');
});
test('expiration and wallet appear only when actually provided by Shopify', () => {
  const ctx=notificationContext(); Object.assign(ctx.gift_card,{expires_on:'2027-10-10',pass_url:'https://example.test/wallet'});
  const html=renderNotification('gift-card-created',ctx);
  expect(html).toContain('Válida hasta el 10/10/2027'); expect(html).toContain('href="https://example.test/wallet"');
  expect(renderNotification('gift-card-created')).not.toContain('Agregar a Apple Wallet');
});
test('configured logo is optional and uses actual shop branding', () => {
  const ctx=notificationContext();ctx.shop.email_logo_url='https://example.test/logo.png';
  expect(renderNotification('gift-card-created',ctx)).toContain('src="https://example.test/logo.png"');
  expect(renderNotification('gift-card-created')).toContain('Lemoon');
});
test('RTL layout preserves a left-to-right redemption code', () => {
  const ctx=notificationContext();ctx.locale_direction='rtl';
  const html=renderNotification('gift-card-created',ctx);
  expect(html).toContain('dir="rtl"'); expect(html).toContain('dir="ltr"');
});

test('receipt confirms the recipient and preserves the buyer copy', () => {
  const ctx=notificationContext();ctx.gift_card.recipient={name:'Sofía',email:'sofia@example.test'};
  const html=renderNotification('gift-card-receipt',ctx);
  expect(html.replace(/<[^>]*>/g,'')).toContain('Tu tarjeta de regalo se envió a Sofía');
  expect(html).toContain('A1B2 3C4D 5E6F 7G8H');
});
test('scheduled receipt never claims the card was already sent', () => {
  const ctx=notificationContext();Object.assign(ctx.gift_card,{recipient:{name:'Sofía',email:'sofia@example.test'},send_on:'2026-12-25'});
  const html=renderNotification('gift-card-receipt',ctx);
  expect(html.replace(/<[^>]*>/g,'')).toContain('programada para Sofía el 25/12/2026');
  expect(html).not.toContain('se envió a');
});
