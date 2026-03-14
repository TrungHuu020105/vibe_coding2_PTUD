from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.deps import get_current_user, get_db
from ..models import BookCopy, Loan, Reader, User
from ..schemas import LoanCreate, LoanOut, LoanReturn

router = APIRouter(prefix="/loans", tags=["loans"])


@router.get("", response_model=list[LoanOut])
def list_loans(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Loan).order_by(Loan.id.desc()).all()


@router.post("", response_model=LoanOut)
def create_loan(payload: LoanCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reader = db.query(Reader).filter(Reader.reader_id == payload.reader_id, Reader.active == True).first()  # noqa: E712
    if not reader:
        raise HTTPException(status_code=400, detail="Độc giả không hợp lệ")

    existing = db.query(Loan).filter(Loan.reader_id == payload.reader_id, Loan.status.in_(["borrowed", "late"])).first()
    if existing:
        raise HTTPException(status_code=400, detail="Mỗi độc giả chỉ được mượn 1 sách tại 1 thời điểm")

    copy = db.query(BookCopy).filter(BookCopy.copy_id == payload.copy_id).first()
    if not copy or copy.status != "available":
        raise HTTPException(status_code=400, detail="Bản sao sách không khả dụng")

    loan = Loan(
        copy_id=payload.copy_id,
        reader_id=payload.reader_id,
        librarian_id=current_user.id,
        borrow_date=payload.borrow_date,
        status="borrowed",
        borrow_condition=payload.borrow_condition,
    )
    copy.status = "borrowed"
    db.add(loan)
    db.commit()
    db.refresh(loan)
    return loan


@router.post("/{loan_id}/return", response_model=LoanOut)
def return_book(loan_id: int, payload: LoanReturn, db: Session = Depends(get_db), _=Depends(get_current_user)):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan or loan.status not in ["borrowed", "late"]:
        raise HTTPException(status_code=400, detail="Phiếu mượn không hợp lệ")

    due_date = loan.borrow_date + timedelta(days=14)
    loan.return_date = payload.return_date
    loan.return_condition = payload.return_condition
    loan.status = "late" if payload.return_date > due_date else "returned"

    copy = db.query(BookCopy).filter(BookCopy.copy_id == loan.copy_id).first()
    copy.status = payload.return_condition if payload.return_condition in ["damaged", "lost"] else "available"

    db.commit()
    db.refresh(loan)
    return loan
