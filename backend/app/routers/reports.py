from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..core.deps import get_current_user, get_db
from ..models import BookCopy, BookTitle, Loan, Reader

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/top-titles")
def top_titles(db: Session = Depends(get_db), _=Depends(get_current_user)):
    rows = (
        db.query(BookTitle.title_id, BookTitle.name, func.count(Loan.id).label("borrow_count"))
        .join(BookCopy, BookCopy.title_id == BookTitle.title_id)
        .join(Loan, Loan.copy_id == BookCopy.copy_id)
        .group_by(BookTitle.title_id, BookTitle.name)
        .order_by(func.count(Loan.id).desc())
        .limit(10)
        .all()
    )
    return [
        {"title_id": row.title_id, "name": row.name, "borrow_count": row.borrow_count}
        for row in rows
    ]


@router.get("/unreturned-readers")
def unreturned_readers(db: Session = Depends(get_db), _=Depends(get_current_user)):
    rows = (
        db.query(
            Loan.id,
            Loan.borrow_date,
            Reader.reader_id,
            Reader.full_name,
            BookCopy.copy_id,
            BookTitle.name.label("title_name"),
        )
        .join(Reader, Reader.reader_id == Loan.reader_id)
        .join(BookCopy, BookCopy.copy_id == Loan.copy_id)
        .join(BookTitle, BookTitle.title_id == BookCopy.title_id)
        .filter(Loan.status.in_(["borrowed", "late"]))
        .order_by(Loan.borrow_date.asc())
        .all()
    )
    today = date.today()
    return [
        {
            "loan_id": row.id,
            "borrow_date": row.borrow_date,
            "reader_id": row.reader_id,
            "reader_name": row.full_name,
            "copy_id": row.copy_id,
            "title_name": row.title_name,
            "days_open": (today - row.borrow_date).days,
        }
        for row in rows
    ]
