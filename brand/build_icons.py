# -*- coding: utf-8 -*-
"""Generate the turnstile (⊢) site-icon set for the logic knowledge base.

Single source of geometry: the 512 design (mark box [92,420]^2, stroke 64,
18% safe margin). Smaller sizes use hand-snapped integer rectangles so the
16/32/48 favicons stay crisp instead of resampled.

Run:  python brand/build_icons.py
"""
import os
import struct

from PIL import Image, ImageDraw, ImageFont

IVORY = (0xF5, 0xEF, 0xE3)   # warm ivory, sampled from public/og.png
NAVY = (0x0D, 0x2A, 0x44)    # deep ink navy, matches app/icon.png
RUST = (0xAE, 0x4F, 0x2D)    # muted rust, sampled from public/og.png

# size -> (box origin x0/y0, box size B, stroke S); box is always centered
GEO = {
    512: (92, 328, 64),
    180: (32, 116, 22),
    48: (9, 30, 6),
    32: (6, 20, 4),
    16: (3, 10, 2),
}
ACCENT_SPLIT_512 = 324  # x where the rust tip starts in the accent variant

OUT = os.path.dirname(os.path.abspath(__file__))


def turnstile(size, accent=False):
    x0, b, s = GEO[size]
    x1 = x0 + b
    cx = size // 2
    im = Image.new("RGB", (size, size), IVORY)
    d = ImageDraw.Draw(im)
    d.rectangle([x0, x0, x0 + s, x1], fill=NAVY)  # vertical bar
    y0 = cx - s // 2
    d.rectangle([x0, y0, x1, y0 + s], fill=NAVY)  # horizontal arm
    if accent:
        rx0 = x1 - round((ACCENT_SPLIT_512 - GEO[512][0]) / GEO[512][1] * b)
        d.rectangle([rx0, y0, x1, y0 + s], fill=RUST)
    return im


SVG = ('<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
       'viewBox="0 0 512 512">\n'
       '  <rect width="512" height="512" fill="#F5EFE3"/>\n'
       '{mark}\n'
       '</svg>\n')

MARK_PLAIN = '  <path fill="#0D2A44" d="M92 92h64v132h264v64H156v132H92Z"/>'
MARK_ACCENT = ('  <path fill="#0D2A44" d="M92 92h64v132h168v64H156v132H92Z"/>\n'
               '  <rect x="324" y="224" width="96" height="64" fill="#AE4F2D"/>')


def write_svg(name, mark):
    with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
        f.write(SVG.format(size=512, mark=mark))


def preview(images):
    """Contact sheet: native sizes plus nearest-neighbour enlargements."""
    big = [im.resize((im.width * k, im.height * k), Image.NEAREST)
           for im, k in zip(images, (8, 4, 3))]
    native = images  # 16, 32, 48
    pad = 24
    w = (pad + sum(i.width for i in native) + pad
         + pad * 2 + sum(i.width for i in big) + pad)
    row1 = pad + 40 + max(i.height for i in big)
    h = row1 + pad + 40 + 180 + pad
    sheet = Image.new("RGB", (w, h), (0x88, 0x8C, 0x92))
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 16)
    except OSError:
        font = ImageFont.load_default()
    y = pad + 40
    x = pad
    for label, im in [("16px", native[0]), ("32px", native[1]), ("48px", native[2])]:
        sheet.paste(im, (x, y))
        d.text((x, y - 28), label, fill=(255, 255, 255), font=font)
        x += im.width + pad
    x += pad * 2
    for label, im in [("16px x8", big[0]), ("32px x4", big[1]), ("48px x3", big[2])]:
        sheet.paste(im, (x, y))
        d.text((x, y - 28), label, fill=(255, 255, 255), font=font)
        x += im.width + pad
    y2 = row1 + pad + 40
    sheet.paste(images[3], (pad, y2))
    d.text((pad, y2 - 28), "180px (apple touch)", fill=(255, 255, 255), font=font)
    return sheet


def ico_sizes(path):
    with open(path, "rb") as f:
        data = f.read()
    count = struct.unpack("<H", data[4:6])[0]
    sizes = []
    for i in range(count):
        off = 6 + i * 16
        w = data[off] or 256
        h = data[off + 1] or 256
        sizes.append((w, h))
    return sizes


def main():
    im16 = turnstile(16)
    im32 = turnstile(32)
    im48 = turnstile(48)
    im180 = turnstile(180)
    im512 = turnstile(512)
    im512a = turnstile(512, accent=True)

    im512.save(os.path.join(OUT, "turnstile-icon-512.png"))
    im512a.save(os.path.join(OUT, "turnstile-icon-accent-512.png"))
    im180.save(os.path.join(OUT, "apple-touch-icon-180.png"))
    im48.save(os.path.join(OUT, "favicon-48.png"))
    im32.save(os.path.join(OUT, "favicon-32.png"))
    im16.save(os.path.join(OUT, "favicon-16.png"))

    ico = os.path.join(OUT, "favicon.ico")
    im48.save(ico, sizes=[(16, 16), (32, 32), (48, 48)],
              append_images=[im16, im32])
    print("favicon.ico sizes:", ico_sizes(ico))

    write_svg("turnstile-icon.svg", MARK_PLAIN)
    write_svg("turnstile-icon-accent.svg", MARK_ACCENT)

    preview([im16, im32, im48, im180]).save(os.path.join(OUT, "size-preview.png"))
    print("done ->", OUT)


if __name__ == "__main__":
    main()
