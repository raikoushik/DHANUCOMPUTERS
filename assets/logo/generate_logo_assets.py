"""Generate logo and favicon PNG/ICO files from the SVG masters.

Requires Playwright with Firefox:
  pip install playwright
  playwright install firefox
"""
from pathlib import Path
import struct
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).parent
LOGO_SVG = ROOT / "dhanutech-logo.svg"
SYMBOL_SVG = ROOT / "dhanutech-symbol.svg"


def render_svg_to_pngs():
    logo_svg = LOGO_SVG.read_text(encoding="utf-8")
    symbol_svg = SYMBOL_SVG.read_text(encoding="utf-8")

    with sync_playwright() as p:
        browser = p.firefox.launch()
        page = browser.new_page()

        for size in (1024, 512):
            page.set_viewport_size({"width": size, "height": size})
            page.set_content(f"<html><body style='margin:0;background:transparent'>{logo_svg}</body></html>")
            page.locator("svg").first.screenshot(path=str(ROOT / f"dhanutech-logo-{size}.png"))

        for size in (1024, 512, 180, 64, 48, 32, 16):
            page.set_viewport_size({"width": size, "height": size})
            page.set_content(f"<html><body style='margin:0;background:transparent'>{symbol_svg}</body></html>")
            page.locator("svg").first.screenshot(path=str(ROOT / f"dhanutech-symbol-{size}.png"))

        browser.close()


def write_named_outputs():
    mapping = {
        16: "favicon-16x16.png",
        32: "favicon-32x32.png",
        48: "favicon-48x48.png",
        64: "favicon-64x64.png",
        180: "apple-touch-icon-180x180.png",
    }
    for size, out_name in mapping.items():
        (ROOT / out_name).write_bytes((ROOT / f"dhanutech-symbol-{size}.png").read_bytes())


def build_ico():
    png_files = [ROOT / f"favicon-{s}x{s}.png" for s in (16, 32, 48, 64)]
    images = []
    for path in png_files:
        size = int(path.stem.split("-")[1].split("x")[0])
        images.append((size, path.read_bytes()))

    ico = bytearray(struct.pack("<HHH", 0, 1, len(images)))
    offset = 6 + 16 * len(images)

    for size, data in images:
        ico += struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(data), offset)
        offset += len(data)

    for _, data in images:
        ico += data

    (ROOT / "favicon.ico").write_bytes(ico)


def main():
    render_svg_to_pngs()
    write_named_outputs()
    build_ico()
    print("Generated logo/favicons in", ROOT)


if __name__ == "__main__":
    main()
