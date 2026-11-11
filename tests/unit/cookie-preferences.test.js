import { afterEach, expect, test, vi } from 'vitest';
import { loadCustomerPrivacy, privacyChoices, savePrivacyChoices } from '../../assets/lemoon-cookie-preferences.js';
const api = () => ({currentVisitorConsent: vi.fn(), setTrackingConsent: vi.fn()});
afterEach(() => vi.useRealTimers());

test('loading an existing native service never records consent', async () => {
  const native = api();
  expect(await loadCustomerPrivacy({Shopify:{customerPrivacy:native}})).toBe(native);
  expect(native.setTrackingConsent).not.toHaveBeenCalled();
});
test('uses the documented Shopify feature loader when the API is not yet present', async () => {
  const native=api(); const environment={Shopify:{}};
  environment.Shopify.loadFeatures=vi.fn((features,callback)=>{environment.Shopify.customerPrivacy=native;callback();});
  expect(await loadCustomerPrivacy(environment)).toBe(native);
  expect(environment.Shopify.loadFeatures).toHaveBeenCalledWith([{name:'consent-tracking-api',version:'0.1'}],expect.any(Function));
  expect(native.setTrackingConsent).not.toHaveBeenCalled();
});
test('a missing native service fails within a bounded wait', async () => {
  vi.useFakeTimers();
  const pending=expect(loadCustomerPrivacy({},200)).rejects.toThrow('privacy_service_unavailable');
  await vi.advanceTimersByTimeAsync(200); await pending;
});
test('unrecorded choices reflect Shopify effective permissions without recording consent', () => {
  const native = {
    analyticsProcessingAllowed: vi.fn(() => true),
    marketingAllowed: vi.fn(() => false),
    preferencesProcessingAllowed: vi.fn(() => true),
    setTrackingConsent: vi.fn(),
  };
  native.currentVisitorConsent = vi.fn(() => ({analytics:'', marketing:'', preferences:''}));
  expect(privacyChoices(native)).toEqual({analytics:true, marketing:false, preferences:true});
  expect(native.analyticsProcessingAllowed).toHaveBeenCalledOnce();
  expect(native.marketingAllowed).toHaveBeenCalledOnce();
  expect(native.preferencesProcessingAllowed).toHaveBeenCalledOnce();
  expect(native.setTrackingConsent).not.toHaveBeenCalled();
});
test('effective permissions govern the displayed choices even when recorded consent differs', () => {
  const native = {
    currentVisitorConsent: vi.fn(() => ({analytics:'yes', marketing:'no', preferences:'yes', sale_of_data:'yes'})),
    analyticsProcessingAllowed: vi.fn(() => false),
    marketingAllowed: vi.fn(() => true),
    preferencesProcessingAllowed: vi.fn(() => false),
  };
  expect(privacyChoices(native)).toEqual({analytics:false, marketing:true, preferences:false});
});
test('unavailable, throwing, or nonboolean permission methods report unavailable instead of inventing a state', () => {
  const allAllowed = { analyticsProcessingAllowed: () => true, marketingAllowed: () => true, preferencesProcessingAllowed: () => true };
  for (const override of [
    {analyticsProcessingAllowed: undefined},
    {marketingAllowed: () => 'yes'},
  ]) expect(() => privacyChoices({...allAllowed, ...override})).toThrow('privacy_service_unavailable');
  expect(() => privacyChoices({...allAllowed, preferencesProcessingAllowed: () => { throw new Error('native failure'); }})).toThrow();
  expect(() => privacyChoices({})).toThrow('privacy_service_unavailable');
});
test('saves only explicit boolean choices and preserves the independent data-sale setting', async () => {
  const native=api(); native.currentVisitorConsent.mockReturnValue({analytics:'yes',marketing:'no',preferences:'no',sale_of_data:'no'});
  native.setTrackingConsent.mockImplementation((selection,callback)=>callback());
  await savePrivacyChoices(native,{analytics:true,marketing:'yes',preferences:false,sale_of_data:true});
  expect(native.setTrackingConsent).toHaveBeenCalledWith({analytics:true,marketing:false,preferences:false},expect.any(Function));
});
test('does not report success if Shopify did not retain the requested choice', async () => {
  const native=api(); native.currentVisitorConsent.mockReturnValue({analytics:'no',marketing:'no',preferences:'no'});
  native.setTrackingConsent.mockImplementation((selection,callback)=>callback());
  await expect(savePrivacyChoices(native,{analytics:true})).rejects.toThrow('privacy_save_failed');
});
test('a missing save callback times out rather than implying consent was recorded', async () => {
  vi.useFakeTimers(); const native=api();
  const pending=expect(savePrivacyChoices(native,{analytics:true},200)).rejects.toThrow('privacy_save_failed');
  await vi.advanceTimersByTimeAsync(200);await pending;
});
test('handles native save exceptions', async () => {
  const native=api(); native.setTrackingConsent.mockImplementation(()=>{throw new Error('native failure');});
  await expect(savePrivacyChoices(native,{})).rejects.toThrow('native failure');
});
test('a native callback error fails even when an earlier choice already matches', async () => {
  const native=api();
  native.currentVisitorConsent.mockReturnValue({analytics:'no',marketing:'no',preferences:'no'});
  native.setTrackingConsent.mockImplementation((selection,callback)=>callback({error:'Failed to fetch'}));
  await expect(savePrivacyChoices(native,{analytics:false,marketing:false,preferences:false})).rejects.toThrow('privacy_save_failed');
});
