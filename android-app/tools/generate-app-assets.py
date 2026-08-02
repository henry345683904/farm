from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
RESOURCE_ROOT = ROOT / "android" / "app" / "src" / "main" / "res"
BRAND_ROOT = ROOT / "brand"


def make_icon(size=1024):
    image = Image.new("RGBA", (size, size), "#69ccef")
    draw = ImageDraw.Draw(image)

    draw.rectangle((0, size * 0.52, size, size), fill="#70d35b")
    draw.ellipse((-size * 0.18, size * 0.43, size * 0.58, size * 1.08), fill="#55b94e")
    draw.ellipse((size * 0.48, size * 0.47, size * 1.18, size * 1.05), fill="#45a94a")

    shadow = (size * 0.19, size * 0.76, size * 0.84, size * 0.9)
    draw.ellipse(shadow, fill=(32, 92, 44, 80))

    outline = "#604b48"
    wool = "#fff8e9"
    wool_shadow = "#ebd5bd"
    circles = [
        (0.18, 0.39, 0.43, 0.68),
        (0.27, 0.27, 0.54, 0.59),
        (0.42, 0.22, 0.69, 0.55),
        (0.57, 0.27, 0.82, 0.59),
        (0.2, 0.53, 0.46, 0.79),
        (0.36, 0.56, 0.62, 0.83),
        (0.53, 0.53, 0.79, 0.8),
    ]
    stroke = max(8, size // 58)
    for index, box in enumerate(circles):
        scaled = tuple(int(value * size) for value in box)
        draw.ellipse(scaled, fill=wool if index < 5 else wool_shadow, outline=outline, width=stroke)

    face_box = tuple(int(value * size) for value in (0.54, 0.36, 0.86, 0.73))
    draw.rounded_rectangle(face_box, radius=int(size * 0.14), fill="#efa0a0", outline=outline, width=stroke)
    draw.ellipse(tuple(int(value * size) for value in (0.49, 0.43, 0.59, 0.56)), fill="#f6b8b4", outline=outline, width=stroke)
    draw.ellipse(tuple(int(value * size) for value in (0.82, 0.43, 0.92, 0.56)), fill="#f6b8b4", outline=outline, width=stroke)

    for x in (0.63, 0.76):
        draw.ellipse((int(x * size), int(0.46 * size), int((x + 0.07) * size), int(0.57 * size)), fill="white")
        draw.ellipse((int((x + 0.025) * size), int(0.49 * size), int((x + 0.06) * size), int(0.56 * size)), fill="#241c20")
        draw.ellipse((int((x + 0.035) * size), int(0.5 * size), int((x + 0.048) * size), int(0.52 * size)), fill="white")

    draw.ellipse(tuple(int(value * size) for value in (0.68, 0.58, 0.76, 0.64)), fill="#9f5960")
    draw.arc(tuple(int(value * size) for value in (0.64, 0.59, 0.72, 0.68)), 10, 115, fill="#6b383d", width=stroke)
    draw.arc(tuple(int(value * size) for value in (0.72, 0.59, 0.8, 0.68)), 65, 170, fill="#6b383d", width=stroke)
    draw.ellipse(tuple(int(value * size) for value in (0.58, 0.6, 0.64, 0.64)), fill="#ffbbc0")
    draw.ellipse(tuple(int(value * size) for value in (0.8, 0.6, 0.86, 0.64)), fill="#ffbbc0")

    for x in (0.33, 0.57):
        draw.rounded_rectangle(
            (int(x * size), int(0.72 * size), int((x + 0.075) * size), int(0.86 * size)),
            radius=int(size * 0.025),
            fill="#443839",
        )

    return image


def contain(source, width, height, scale=0.78, background=None):
    target = Image.new("RGBA", (width, height), background or (0, 0, 0, 0))
    side = int(min(width, height) * scale)
    resized = source.resize((side, side), Image.Resampling.LANCZOS)
    target.alpha_composite(resized, ((width - side) // 2, (height - side) // 2))
    return target


def save_png(image, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", optimize=True)


icon = make_icon()
save_png(icon, BRAND_ROOT / "app-icon-source.png")

densities = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

for directory, size in densities.items():
    resource_dir = RESOURCE_ROOT / directory
    save_png(icon.resize((size, size), Image.Resampling.LANCZOS), resource_dir / "ic_launcher.png")
    save_png(icon.resize((size, size), Image.Resampling.LANCZOS), resource_dir / "ic_launcher_round.png")
    foreground_size = int(size * 2.25)
    save_png(contain(icon, foreground_size, foreground_size, 0.7), resource_dir / "ic_launcher_foreground.png")

for splash_path in RESOURCE_ROOT.rglob("splash.png"):
    with Image.open(splash_path) as existing:
        width, height = existing.size
    splash = contain(icon, width, height, 0.22, "#69ccef")
    save_png(splash, splash_path)

print("Generated Happy Sheep Farm Android icons and splash screens.")
