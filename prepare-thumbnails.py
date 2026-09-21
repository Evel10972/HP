"""Create lightweight copies for the moving homepage background."""

from pathlib import Path
from PIL import Image, ImageOps

assets = Path(__file__).resolve().parent / "assets"
output = assets / "thumbs"
output.mkdir(exist_ok=True)
extensions = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"}

for source in sorted(assets.iterdir()):
    if not source.is_file() or source.name.lower() in {"icon.png", "contact.png"} or source.suffix.lower() not in extensions:
        continue
    target = output / f"{source.stem}.webp"
    if target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
        continue
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        image.thumbnail((360, 640), Image.Resampling.LANCZOS)
        image.convert("RGB").save(target, "WEBP", quality=78, method=6)
    print(target.name)
