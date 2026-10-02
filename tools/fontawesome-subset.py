#!/usr/bin/env python3
"""Self-hosted Font Awesome subset.

The site uses ~60 Font Awesome icons. Instead of the full CDN build (~90 KB CSS and
~250 KB of fonts), assets/vendor/fontawesome/ holds a CSS file and woff2 fonts that
only contain the icons the built site references.

  generate  Rebuild the subset from a built site (needs `pip install fonttools brotli`):
              bundle exec jekyll build
              python3 tools/fontawesome-subset.py generate _site
  check     Fail when the built site uses an icon missing from the subset (stdlib only,
            runs in CI):
              python3 tools/fontawesome-subset.py check _site

Run `generate` after adding an icon class (e.g. `fas fa-trophy`) anywhere on the site.
"""

import io
import json
import re
import sys
import tarfile
import urllib.request
from pathlib import Path

FA_VERSION = "7.3.1"
ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets" / "vendor" / "fontawesome"
CSS_NAME = "fontawesome.min.css"
MANIFEST = OUT_DIR / "manifest.json"
FONTS = ("fa-solid-900", "fa-regular-400", "fa-brands-400")

TOKEN_RE = re.compile(r"(?<![\w-])fa-([a-z0-9]+(?:-[a-z0-9]+)*)")
CONTENT_RE = re.compile(r'"\\([ef][0-9a-f]{3})"')
ICON_RULE_RE = re.compile(r'([^{}]+)\{--fa:"(\\[0-9a-f]+|\\.|[^"\\])"\}')
FONT_FACE_RE = re.compile(r"@font-face\{[^}]*\}")


def scan_site(site: Path):
    """Return (fa-* tokens, private-use codepoints used by CSS `content`)."""
    tokens, codes = set(), set()
    for path in site.rglob("*"):
        if path.suffix not in {".html", ".js", ".json", ".css"} or not path.is_file():
            continue
        if OUT_DIR.name in path.parts and "vendor" in path.parts:
            continue
        text = path.read_text(errors="ignore")
        tokens.update(TOKEN_RE.findall(text))
        if path.suffix == ".css":
            codes.update(CONTENT_RE.findall(text))
    return tokens, codes


def fetch_package():
    url = f"https://registry.npmjs.org/@fortawesome/fontawesome-free/-/fontawesome-free-{FA_VERSION}.tgz"
    with urllib.request.urlopen(url) as resp:
        data = resp.read()
    files = {}
    with tarfile.open(fileobj=io.BytesIO(data)) as tar:
        for member in tar.getmembers():
            name = member.name.removeprefix("package/")
            if name == "css/all.min.css" or name.startswith("webfonts/"):
                files[name] = tar.extractfile(member).read()
    return files


def generate(site: Path):
    from fontTools import subset  # noqa: PLC0415 (optional dependency)

    tokens, css_codes = scan_site(site)
    files = fetch_package()
    css = files["css/all.min.css"].decode()

    icon_names, used_codes = set(), set(css_codes)

    def keep_icon_rule(match):
        selectors = [s.strip() for s in match.group(1).split(",")]
        kept = [s for s in selectors if s.startswith(".fa-") and s[4:] in tokens]
        if not kept:
            return ""
        icon_names.update(s[4:] for s in kept)
        content = match.group(2)
        if re.fullmatch(r"\\[0-9a-f]+", content):
            used_codes.add(content[1:])
        else:
            used_codes.add(format(ord(content[-1]), "x"))
        return ",".join(kept) + '{--fa:"' + content + '"}'

    css = ICON_RULE_RE.sub(keep_icon_rule, css)
    css = FONT_FACE_RE.sub("", css)
    faces = [
        ("Font Awesome 7 Brands", 400, "fa-brands-400"),
        ("Font Awesome 7 Free", 400, "fa-regular-400"),
        ("Font Awesome 7 Free", 900, "fa-solid-900"),
    ]
    css += "".join(
        f'@font-face{{font-family:"{family}";font-style:normal;font-weight:{weight};'
        f'font-display:block;src:url(webfonts/{font}.woff2) format("woff2")}}'
        for family, weight, font in faces
    )

    (OUT_DIR / "webfonts").mkdir(parents=True, exist_ok=True)
    (OUT_DIR / CSS_NAME).write_text(css)

    unicodes = sorted(int(code, 16) for code in used_codes)
    for font in FONTS:
        options = subset.Options()
        options.flavor = "woff2"
        options.layout_features = ["*"]
        ttfont = subset.load_font(io.BytesIO(files[f"webfonts/{font}.woff2"]), options)
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=unicodes)
        subsetter.subset(ttfont)
        subset.save_font(ttfont, str(OUT_DIR / "webfonts" / f"{font}.woff2"), options)

    ignored = sorted(tokens - icon_names)
    MANIFEST.write_text(
        json.dumps(
            {"version": FA_VERSION, "icons": sorted(icon_names), "ignored": ignored, "codes": sorted(used_codes)},
            indent=2,
        )
        + "\n"
    )
    print(f"{len(icon_names)} icons, {len(unicodes)} glyphs -> {OUT_DIR.relative_to(ROOT)}")


def check(site: Path):
    manifest = json.loads(MANIFEST.read_text())
    known = set(manifest["icons"]) | set(manifest["ignored"])
    tokens, css_codes = scan_site(site)
    missing = sorted(tokens - known) + sorted(f"\\{code}" for code in css_codes - set(manifest["codes"]))
    if missing:
        print("Font Awesome subset is missing: " + ", ".join(missing))
        print("Run: python3 tools/fontawesome-subset.py generate _site")
        return 1
    print(f"Font Awesome subset covers all {len(tokens)} fa-* tokens")
    return 0


def main(argv):
    if len(argv) != 3 or argv[1] not in {"generate", "check"}:
        print(__doc__)
        return 2
    site = Path(argv[2])
    if argv[1] == "generate":
        generate(site)
        return 0
    return check(site)


if __name__ == "__main__":
    sys.exit(main(sys.argv))
