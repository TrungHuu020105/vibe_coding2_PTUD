from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.deps import get_current_user, get_db
from ..core.utils import recalc_title_quantity
from ..models import BookCopy, BookTitle, Loan
from ..schemas import BookCopyCreate, BookCopyOut, BookCopyBase

router = APIRouter(prefix="/copies", tags=["copies"])


@router.get("", response_model=list[BookCopyOut])
def list_copies(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(BookCopy).order_by(BookCopy.acquired_date.desc()).all()


@router.post("", response_model=BookCopyOut)
def create_copy(payload: BookCopyCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    existed = db.query(BookCopy).filter(BookCopy.copy_id == payload.copy_id).first()
    if existed:
        raise HTTPException(status_code=400, detail="Mã sách đã tồn tại")
    title = db.query(BookTitle).filter(BookTitle.title_id == payload.title_id).first()
    if not title:
        raise HTTPException(status_code=400, detail="Đầu sách không tồn tại")

    copy = BookCopy(**payload.model_dump())
    db.add(copy)
    db.commit()
    db.refresh(copy)
    recalc_title_quantity(db, copy.title_id)
    return copy


@router.put("/{copy_id}", response_model=BookCopyOut)
def update_copy(copy_id: str, payload: BookCopyBase, db: Session = Depends(get_db), _=Depends(get_current_user)):
    copy = db.query(BookCopy).filter(BookCopy.copy_id == copy_id).first()
    if not copy:
        raise HTTPException(status_code=404, detail="Không tìm thấy bản sao")

    old_title_id = copy.title_id
    for key, value in payload.model_dump().items():
        setattr(copy, key, value)
    db.commit()
    db.refresh(copy)
    recalc_title_quantity(db, old_title_id)
    recalc_title_quantity(db, copy.title_id)
    return copy


@router.delete("/{copy_id}")
def delete_copy(copy_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    copy = db.query(BookCopy).filter(BookCopy.copy_id == copy_id).first()
    if not copy:
        raise HTTPException(status_code=404, detail="Không tìm thấy bản sao")

    active_loan = db.query(Loan).filter(Loan.copy_id == copy_id, Loan.status.in_(["borrowed", "late"])).first()
    if active_loan:
        raise HTTPException(status_code=400, detail="Sách đang được mượn")

    copy.status = "removed"
    db.commit()
    recalc_title_quantity(db, copy.title_id)
    return {"message": "Đã loại bỏ bản sao"}
