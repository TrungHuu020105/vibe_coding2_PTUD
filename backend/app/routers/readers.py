from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.deps import get_db, get_current_user
from ..models import Loan, Reader
from ..schemas import ReaderCreate, ReaderOut, ReaderBase

router = APIRouter(prefix="/readers", tags=["readers"])


@router.get("", response_model=list[ReaderOut])
def list_readers(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Reader).order_by(Reader.reader_id).all()


@router.post("", response_model=ReaderOut)
def create_reader(payload: ReaderCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    existed = db.query(Reader).filter(Reader.reader_id == payload.reader_id).first()
    if existed:
        raise HTTPException(status_code=400, detail="Mã độc giả đã tồn tại")
    reader = Reader(**payload.model_dump())
    db.add(reader)
    db.commit()
    db.refresh(reader)
    return reader


@router.put("/{reader_id}", response_model=ReaderOut)
def update_reader(reader_id: str, payload: ReaderBase, db: Session = Depends(get_db), _=Depends(get_current_user)):
    reader = db.query(Reader).filter(Reader.reader_id == reader_id).first()
    if not reader:
        raise HTTPException(status_code=404, detail="Không tìm thấy độc giả")
    for key, value in payload.model_dump().items():
        setattr(reader, key, value)
    db.commit()
    db.refresh(reader)
    return reader


@router.delete("/{reader_id}")
def delete_reader(reader_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    active_loan = db.query(Loan).filter(Loan.reader_id == reader_id, Loan.status.in_(["borrowed", "late"])).first()
    if active_loan:
        raise HTTPException(status_code=400, detail="Độc giả đang mượn sách, không thể xóa")

    reader = db.query(Reader).filter(Reader.reader_id == reader_id).first()
    if not reader:
        raise HTTPException(status_code=404, detail="Không tìm thấy độc giả")
    db.delete(reader)
    db.commit()
    return {"message": "Đã xóa độc giả"}
