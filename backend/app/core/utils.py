from sqlalchemy import func
from sqlalchemy.orm import Session

from ..models import BookCopy, BookTitle


def recalc_title_quantity(db: Session, title_id: str) -> None:
    total = (
        db.query(func.count(BookCopy.copy_id))
        .filter(BookCopy.title_id == title_id, BookCopy.status != "removed")
        .scalar()
    )
    title = db.query(BookTitle).filter(BookTitle.title_id == title_id).first()
    if title:
        title.quantity = int(total or 0)
        db.commit()
