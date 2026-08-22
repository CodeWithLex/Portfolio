"""Optimize portfolio photos + build a labeled contact sheet for curation.

Reads:  C:/Users/User/Desktop/Portfolio Pics/{Christening,Me,Portraits,Wedding}
Writes: build/opt/{full,thumb}/<category>-<n>.jpg   (full: 1600px q80, thumb: 700px q72)
        build/contact-sheet.jpg                     (labeled grid for review)
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SRC = Path("C:/Users/User/Desktop/Portfolio Pics")
OUT = Path("build/opt")
CATS = ["Christening", "Me", "Portraits", "Wedding"]

OUT.mkdir(parents=True, exist_ok=True)
(OUT / "full").mkdir(exist_ok=True)
(OUT / "thumb").mkdir(exist_ok=True)

entries = []  # (label, source_path, out_name)

for cat in CATS:
    files = sorted(p for p in (SRC / cat).iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png"))
    for i, f in enumerate(files, 1):
        out_name = f"{cat.lower()}-{i}"
        for size, q, sub in ((1600, 80, "full"), (700, 72, "thumb")):
            dest = OUT / sub / f"{out_name}.jpg"
            if dest.exists():
                continue
            im = Image.open(f)
            im = im.convert("RGB")
            im.thumbnail((size, size), Image.LANCZOS)
            im.save(dest, "JPEG", quality=q, optimize=True, progressive=True)
        entries.append((f"{out_name}", f))

# ---- contact sheet: label on each thumb ----
TH_W, TH_H, PAD, LABEL_H = 320, 320, 10, 26
cols = 5
rows = (len(entries) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (TH_W + PAD) + PAD, rows * (TH_H + LABEL_H + PAD) + PAD), (15, 15, 15))
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("arial.ttf", 15)
except OSError:
    font = ImageFont.load_default()

for idx, (label, _) in enumerate(entries):
    r, c = divmod(idx, cols)
    x = PAD + c * (TH_W + PAD)
    y = PAD + r * (TH_H + LABEL_H + PAD)
    im = Image.open(OUT / "thumb" / f"{label}.jpg")
    im.thumbnail((TH_W, TH_H), Image.LANCZOS)
    sheet.paste(im, (x + (TH_W - im.width) // 2, y + (TH_H - im.height) // 2))
    draw.text((x, y + TH_H + 4), label, fill=(255, 255, 100), font=font)

sheet.save(OUT / "contact-sheet.jpg", "JPEG", quality=80)
print(f"optimized {len(entries)} images")
for label, src in entries:
    kb_full = (OUT / 'full' / f"{label}.jpg").stat().st_size // 1024
    print(f"{label:28s} {kb_full:5d} KB   <- {src.name}")
