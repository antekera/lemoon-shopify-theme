#!/usr/bin/env python3
"""Offline, original deterministic PNGs and Shopify product import; no API writes."""
import csv
import hashlib
import json
from pathlib import Path
import struct
import zlib

ROOT = Path(__file__).resolve().parent

def chunk(kind, data):
    return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data) & 0xffffffff)

def image(index):
    width, height = 1200, 900
    rows = []
    rgba = bytearray()
    for y in range(height):
        row = bytearray()
        for x in range(width):
            # Fixed fine texture gives image decoding/network work beyond a flat swatch.
            noise = ((x//2 * 73856093) ^ (y//2 * 19349663) ^ (index * 83492791)) % 24
            lens = any((x-cx)**2 + (y-450)**2 < (140+index)**2 for cx in (390, 810))
            base = (28+index*3, 43, 53) if lens else (215+index, 205, 195)
            color = bytes(min(255, c+noise) for c in base)
            row.extend(color)
            rgba.extend(color + b'\xff')
        rows.append(b'\0' + row)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('!2I5B', width, height, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(b''.join(rows), 9)) + chunk(b'IEND', b''), hashlib.sha256(rgba).hexdigest()

def main():
    products = []
    for index in range(12):
        suffix = '' if index == 0 else f'-{index+1:02d}'
        handle = f'lighthouse-frame{suffix}'
        filename = f'{handle}.png'
        content, pixels = image(index)
        (ROOT / filename).write_bytes(content)
        products.append({'handle': handle, 'title': f'Lighthouse synthetic frame {index+1:02d}', 'status': 'ACTIVE', 'vendor': 'Lighthouse Lab', 'productType': 'Armazón', 'tags': ['lighthouse-v1'],
            'options': [{'name': 'Color', 'values': ['Arena', 'Negro']}],
            'variants': [{'title': title, 'price': '39990.00', 'sku': f'LH-V1-{index+1:02d}-{sku}'} for title, sku in [('Arena', 'ARENA'), ('Negro', 'NEGRO')]],
            'metafields': {'custom.lens_compatible': {'type': 'boolean', 'value': 'true'}, 'custom.lighthouse_fixture': {'type': 'single_line_text_field', 'value': 'lemoon-lighthouse-v1'}},
            'image': {'file': filename, 'width': 1200, 'height': 900, 'sha256': hashlib.sha256(content).hexdigest(), 'pixelSha256': pixels, 'alt': f'lemoon-lighthouse-v1 frame {index+1:02d}'}})
    manifest = {'version': 'lemoon-lighthouse-v1', 'shopId': '102677381410', 'products': products,
        'collection': {'handle': 'lighthouse-frames', 'title': 'Lighthouse synthetic frames', 'sortOrder': 'ALPHA_ASC', 'productHandles': [p['handle'] for p in products]},
        'settingsSha256': hashlib.sha256((ROOT/'settings.json').read_bytes()).hexdigest()}
    (ROOT/'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
    fields = ['Handle','Title','Body (HTML)','Vendor','Product Category','Type','Tags','Published','Option1 Name','Option1 Value','Variant SKU','Variant Price','Variant Requires Shipping','Variant Taxable','Variant Inventory Policy','Status','Collection']
    with (ROOT/'products.csv').open('w', newline='') as output:
        writer = csv.DictWriter(output, fieldnames=fields)
        writer.writeheader()
        for p in products:
            for i, v in enumerate(p['variants']):
                writer.writerow({'Handle': p['handle'], 'Title':p['title'] if i == 0 else '', 'Body (HTML)':'<p>Armazón sintético de laboratorio.</p>' if i == 0 else '', 'Vendor':'Lighthouse Lab' if i == 0 else '', 'Type':'Armazón' if i == 0 else '', 'Tags':'lighthouse-v1' if i == 0 else '', 'Published':'TRUE' if i == 0 else '', 'Option1 Name':'Color', 'Option1 Value':v['title'], 'Variant SKU':v['sku'], 'Variant Price':v['price'], 'Variant Requires Shipping':'TRUE', 'Variant Taxable':'FALSE', 'Variant Inventory Policy':'continue', 'Status':'active' if i == 0 else '', 'Collection':manifest['collection']['title'] if i == 0 else ''})
if __name__ == '__main__':
    main()
