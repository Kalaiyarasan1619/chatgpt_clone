"""In-memory chat persistence (matches Spring JPA shape for the React client)."""

from __future__ import annotations

import itertools
from threading import Lock

_lock = Lock()
_rows: list[dict] = []
_id_seq = itertools.count(1)


def append_turn(message: str, response: str, page_id: int) -> dict:
    with _lock:
        rid = next(_id_seq)
        row = {
            "id": rid,
            "message": message,
            "response": response,
            "pageId": page_id,
        }
        _rows.append(row)
        return row


def get_thread(page_id: int) -> list[dict]:
    with _lock:
        return sorted(
            (r for r in _rows if r["pageId"] == page_id),
            key=lambda r: r["id"],
        )


def get_recent_first_row_per_page() -> list[dict]:
    """Same semantics as Postgres DISTINCT ON (page_id) … ORDER BY page_id, id ASC, then id DESC."""
    with _lock:
        first_by_page: dict[int, dict] = {}
        for r in sorted(_rows, key=lambda x: (x["pageId"], x["id"])):
            pid = r["pageId"]
            if pid not in first_by_page:
                first_by_page[pid] = r
        out = list(first_by_page.values())
        out.sort(key=lambda r: r["id"], reverse=True)
        return out
