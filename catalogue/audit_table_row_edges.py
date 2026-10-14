"""Find white image masks covering the edges of gray specification cells.

This raster check complements full-page visual review. It caught the Tapscrew
Blue thumbnail mask that hid the bottom of the preceding table's last row.

    uv run --no-project --with pymupdf python catalogue/audit_table_row_edges.py path/to/catalogue.pdf
"""

from __future__ import annotations

import argparse
from collections import defaultdict
from pathlib import Path
from statistics import median

import pymupdf


def gray_cells(drawings: list[dict]) -> list[tuple[pymupdf.Rect, tuple[int, int, int]]]:
    cells = []
    for drawing in drawings:
        rect, fill = drawing["rect"], drawing["fill"]
        if drawing["type"] != "f" or fill is None:
            continue
        if rect.x0 < 20 or rect.width < 25 or not 7 < rect.height < 25:
            continue
        if not (.7 < fill[0] < .9 and max(fill) - min(fill) < .02):
            continue
        cells.append((rect, tuple(round(channel * 255) for channel in fill)))
    return cells


def median_color(samples: bytes, stride: int, y: int, x0: int,
                 x1: int) -> tuple[int, int, int]:
    return tuple(round(median(samples[y * stride + x * 3 + channel]
                              for x in range(x0, x1, 2)))
                 for channel in range(3))


def ruled_gray_cells(drawings: list[dict], samples: bytes, stride: int
                     ) -> list[tuple[pymupdf.Rect, tuple[int, int, int]]]:
    """Infer table rows from white cell rules when PDF shadings hide fills."""
    horizontal_rules = defaultdict(list)
    for drawing in drawings:
        rect, color = drawing["rect"], drawing["color"]
        if drawing["type"] != "s" or color is None:
            continue
        if not all(channel > .90 for channel in color):
            continue
        if (rect.x0 >= 20 and 25 < rect.width < 120 and
                rect.height < .2 and 110 < rect.y0 < 780):
            horizontal_rules[round(rect.y0, 1)].append((rect.x0, rect.x1))
    ys = sorted(y for y, segments in horizontal_rules.items()
                if len(segments) >= 4)
    cells = []
    for top, bottom in zip(ys, ys[1:]):
        if not 9 < bottom - top < 25:
            continue
        for left, right in horizontal_rules[top]:
            if left < 20:
                continue
            x0, x1 = round((left + 4) * 2), round((right - 4) * 2)
            y0, y1 = round((top + 2) * 2), round((bottom - 2) * 2)
            if x1 <= x0 or y1 <= y0:
                continue
            top_color = median_color(samples, stride, y0, x0, x1)
            bottom_color = median_color(samples, stride, y1, x0, x1)
            candidates = [color for color in (top_color, bottom_color)
                          if 150 < color[0] < 245 and max(color) - min(color) < 12]
            if candidates:
                cells.append((pymupdf.Rect(left, top, right, bottom),
                              min(candidates, key=lambda color: color[0])))
    return cells


def damaged_fraction(samples: bytes, stride: int, y: int, x0: int, x1: int,
                     expected: tuple[int, int, int]) -> float:
    damaged = 0
    total = 0
    for x in range(x0, x1, 2):
        offset = y * stride + x * 3
        if max(abs(samples[offset + channel] - expected[channel])
               for channel in range(3)) > 25:
            damaged += 1
        total += 1
    return damaged / total if total else 0


def audit(path: Path) -> bool:
    flagged = []
    cell_count = 0
    vector_cell_count = 0
    ruled_cell_count = 0
    with pymupdf.open(path) as document:
        for number, page in enumerate(document, 1):
            drawings = page.get_drawings()
            vector_cells = gray_cells(drawings)
            pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
            samples = pixmap.samples
            ruled_cells = ruled_gray_cells(drawings, samples, pixmap.stride)
            vector_cell_count += len(vector_cells)
            ruled_cell_count += len(ruled_cells)
            cells = vector_cells + ruled_cells
            cell_count += len(cells)
            for rect, color in cells:
                x0, x1 = round((rect.x0 + 4) * 2), round((rect.x1 - 4) * 2)
                if x1 <= x0:
                    continue
                for edge, y in (("top", round((rect.y0 + 2) * 2)),
                                ("bottom", round((rect.y1 - 2) * 2))):
                    if not 0 <= y < pixmap.height:
                        continue
                    fraction = damaged_fraction(samples, pixmap.stride,
                                                y, x0, x1, color)
                    if fraction > .18:
                        flagged.append((number, edge, rect, fraction))
        print(f"Scanned {len(document)} pages, {cell_count} gray cell samples "
              f"({vector_cell_count} vector fills, {ruled_cell_count} "
              f"ruled cells), {cell_count * 2} row edges.")
    for number, edge, rect, fraction in flagged:
        print(f"FAIL page {number}, {edge} edge, "
              f"cell ({rect.x0:.1f}, {rect.y0:.1f}, "
              f"{rect.x1:.1f}, {rect.y1:.1f}), damaged {fraction:.0%}")
    if not flagged:
        print("PASS: no gray table row edges covered by a white mask or image")
    return not flagged


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path, help="PDF to audit; no catalogue is bundled with this tool")
    args = parser.parse_args()
    raise SystemExit(0 if audit(args.pdf) else 1)
