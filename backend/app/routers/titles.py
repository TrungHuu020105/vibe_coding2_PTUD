from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.deps import get_current_user, get_db
from ..models import BookCopy, BookTitle, Category
from ..schemas import BookTitleCreate, BookTitleOut, BookTitleBase

router = APIRouter(prefix="/titles", tags=["titles"])


@router.get("", response_model=list[BookTitleOut])
def list_titles(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(BookTitle).order_by(BookTitle.name).all()


@router.post("", response_model=BookTitleOut)
def create_title(payload: BookTitleCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    existed = db.query(BookTitle).filter(BookTitle.title_id == payload.title_id).first()
    if existed:
        raise HTTPException(status_code=400, detail="Mã đầu sách đã tồn tại")

    category = db.query(Category).filter(Category.category_id == payload.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Chuyên ngành không tồn tại")

    title = BookTitle(**payload.model_dump(), quantity=0)
    db.add(title)
    db.commit()
    db.refresh(title)
    return title


@router.put("/{title_id}", response_model=BookTitleOut)
def update_title(title_id: str, payload: BookTitleBase, db: Session = Depends(get_db), _=Depends(get_current_user)):
    title = db.query(BookTitle).filter(BookTitle.title_id == title_id).first()
    if not title:
        raise HTTPException(status_code=404, detail="Không tìm thấy đầu sách")
    for key, value in payload.model_dump().items():
        setattr(title, key, value)
    db.commit()
    db.refresh(title)
    return title


@router.delete("/{title_id}")
def delete_title(title_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    used = db.query(BookCopy).filter(BookCopy.title_id == title_id).first()
    if used:
        raise HTTPException(status_code=400, detail="Đầu sách đã có bản sao")
    title = db.query(BookTitle).filter(BookTitle.title_id == title_id).first()
    if not title:
        raise HTTPException(status_code=404, detail="Không tìm thấy đầu sách")
    db.delete(title)
    db.commit()
    return {"message": "Đã xóa đầu sách"}
