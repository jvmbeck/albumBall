# Sticker Images

Place real PNG sticker files in this folder.

## Naming rule

Use each sticker id as the filename:

- `emp-001.png`
- `emp-002.png`
- `emp-003.png`
- ...

The album code resolves `sticker.imageUrl` by searching this folder for `*.png` files and matching by id.

If a revealed sticker does not have a matching image file, it will render as missing image URL (no file found).

## Current ids in mock pages

- `emp-001` to `emp-015`
