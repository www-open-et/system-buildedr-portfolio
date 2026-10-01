# FKDEAL / YAYEHUT physical identity

## Where to find it

- `/cards/`: five variants, front/back switching, full-color/monochrome previews, studio, flat, stack, illustrated in-hand, and stylized desk presentations.
- `/yayehut/`: merchant-facing QR destination with marketplace and Telegram choices.
- The portfolio footer links to the card collection.

## Artwork delivery

Select each variant and side, then use **Download artwork**. The exported SVG contains real vector QR modules, editable text, and a solid bleed background. Front and back share the same orientation; the printer should impose the files for their duplex equipment.

Trim: **85 × 55 mm**. Export: **91 × 61 mm**, including 3 mm bleed on every edge. The trim rectangle is at SVG coordinates `(0, 0)` through `(850, 550)`; the export viewBox begins at `(-30, -30)`. Content starts at least 5 mm inside trim. Do not scale to fit a larger page.

These are **RGB vector masters, not press-certified CMYK PDFs**. The display presentations are digital material studies, not photographs of produced cards. The in-hand view is an illustration.

## Print handoff

1. Open the SVG in Illustrator, Affinity Designer, or equivalent. Confirm the physical dimensions and ensure text has not substituted unexpectedly. Masters use Arial/Helvetica; outline text before supplying final files.
2. Convert using the printer's stock-specific CMYK ICC profile. Use single-channel K for QR codes and fine dark text. Have the printer specify rich black for large dark surfaces.
3. Export PDF/X-4 with an 85 × 55 mm TrimBox and 3 mm bleed. Let the printer add crop marks outside bleed.
4. Print a full-size hard proof to assess the smallest secondary labels, stroke weights, contrast, and contact details. Increase small text if the selected stock or printing process does not reproduce it clearly.
5. Scan each QR from the actual proof on multiple phones. Preserve the built-in four-module white quiet zone; do not recolor, invert, decorate, emboss, or apply reflective varnish over QR areas.
6. Use approximately 400 GSM stock with a matte or optional soft-touch finish. Square corners reinforce the grid. Optional clear spot UV or a shallow emboss may be applied to the wordmark only; supply a separate finishing plate approved by the printer.

## Palette

| Token | RGB master | Use |
| --- | --- | --- |
| Ink | #242722 | Founder, primary text |
| Ivory | #F7F5EE | Reverse sides |
| Growth | #D5E99E | Yayehut |
| Mineral | #E8E9E3 | Technology |
| Slate | #344342 | Fintech |
| Warm paper | #EEEAE1 | Personal |

Use the collection's black-and-white switch to export neutral alternatives. Exact CMYK builds depend on the printer's ICC profile rather than an unprofiled hex conversion.

## QR destinations and deployment

- Founder, Technology, Fintech, Personal: `https://fkadeal.open.et`
- Yayehut: `https://fkadeal.open.et/yayehut/`
- Yayehut landing-page choices: `https://shop.yayehut.com` and `https://t.me/yayehut`.

Deploy the new landing page to `fkadeal.open.et` and verify its live URL **before ordering physical cards**. QR codes are generated locally with `qrcode.react`; they do not rely on a third-party QR image service. Phone: `+251932970631`, displayed on Founder and Yayehut cards, with a tap-to-call link on the merchant landing page.

## Campaign language

Use **Helping 1,000 businesses grow by 2027.** The number represents a target, never a count of existing merchants. No progress value is invented. The brief gives both October 1 and December 31, 2027 as deadlines; the artwork uses the requested year-only marketing wording pending confirmation of the exact operational date. The final narrative favors October 1, 2027.

Extend the same “Helping / 1,000 / businesses grow by 2027” arrangement to posters, social tiles, onboarding, and presentations. Keep “Helping” and the deadline attached to the number so a cropped campaign asset does not imply the target has already been achieved.
