#!/usr/bin/env python3
"""Check kramdown footnote citations in posts.

Posts cite sources as `text[^key].` and list definitions under the final
References heading after a `{:footnotes}` placeholder. kramdown renders an
undefined `[^key]` as literal text and silently drops unused definitions, so
this script catches those mistakes before they ship.

Definitions read `[^key]: [Publisher, Title (DATE)](url)`. DATE is the
source's original publication date: `2025-09-16` for articles and reports,
`Venue, Year` for papers, `arXiv, YYYY-MM` for preprints. Living pages (docs,
repositories, homepages, dashboards, statutes) carry none. The footnote preview
in assets/js/site-ui.js shows a trailing parenthetical with a year beside the
host.

  python3 tools/check-footnotes.py               # all _posts/*.md
  python3 tools/check-footnotes.py FILE [FILE …]

Errors (exit 1): undefined reference, duplicate definition key, two keys for
the same URL, footnotes without a `{:footnotes}` placeholder.
Warnings: definitions never cited (they do not render).
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FRONT_MATTER_RE = re.compile(r"\A---\n.*?\n---\n", re.DOTALL)
FENCE_RE = re.compile(r"^(```|~~~).*?^\1[^\n]*$", re.DOTALL | re.MULTILINE)
INLINE_CODE_RE = re.compile(r"`[^`\n]*`")
DEF_RE = re.compile(r"^\[\^([^\]\s]+)\]:[ \t]*(.*)$", re.MULTILINE)
REF_RE = re.compile(r"\[\^([^\]\s]+)\]")
URL_RE = re.compile(r"\]\((https?://\S+?)\)(?=\s|$)")
PLACEHOLDER_RE = re.compile(r"^\{:footnotes\}\s*$", re.MULTILINE)


def strip_code(text):
    """Blank out code so regex-like `[^a-z]` inside code is not read as a citation."""
    text = FENCE_RE.sub(lambda m: "\n" * m.group(0).count("\n"), text)
    return INLINE_CODE_RE.sub("", text)


def check(path):
    text = strip_code(FRONT_MATTER_RE.sub("", path.read_text()))
    errors, warnings = [], []

    defs = {}
    url_keys = {}
    for match in DEF_RE.finditer(text):
        key, body = match.groups()
        if key in defs:
            errors.append(f"duplicate definition [^{key}]")
            continue
        defs[key] = body
        url = URL_RE.search(body)
        if url:
            url_keys.setdefault(url.group(1), []).append(key)

    body_text = DEF_RE.sub("", text)
    refs = REF_RE.findall(body_text)

    for key in sorted(set(refs) - defs.keys()):
        errors.append(f"undefined reference [^{key}]")
    for key in sorted(defs.keys() - set(refs)):
        warnings.append(f"definition [^{key}] is never cited and will not render")
    for url, keys in url_keys.items():
        if len(keys) > 1:
            errors.append(f"same URL under several keys ({', '.join(keys)}): {url}")
    if defs and not PLACEHOLDER_RE.search(text):
        errors.append("footnotes without a `{:footnotes}` placeholder under the References heading")

    return errors, warnings


def main(argv):
    paths = [Path(arg) for arg in argv[1:]] or sorted((ROOT / "_posts").glob("*.md"))
    failed = False
    for path in paths:
        errors, warnings = check(path)
        for message in errors:
            print(f"{path}: error: {message}")
        for message in warnings:
            print(f"{path}: warning: {message}")
        failed = failed or bool(errors)
    if not failed:
        print(f"Footnotes OK in {len(paths)} file(s)")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
