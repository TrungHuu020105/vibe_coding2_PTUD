from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.deps import get_current_user, get_db
from ..models import BookTitle, Category
from ..schemas import CategoryCreate, CategoryOut, CategoryBase

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Category).order_by(Category.name).all()


@router.post("", response_model=CategoryOut)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    existed = db.query(Category).filter(Category.category_id == payload.category_id).first()
    if existed:
        raise HTTPException(status_code=400, detail="Mã chuyên ngành đã tồn tại")
    item = Category(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{category_id}", response_model=CategoryOut)
def update_category(category_id: str, payload: CategoryBase, db: Session = Depends(get_db), _=Depends(get_current_user)):
    item = db.query(Category).filter(Category.category_id == category_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy chuyên ngành")
    item.name = payload.name
    item.description = payload.description
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{category_id}")
def delete_category(category_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    used = db.query(BookTitle).filter(BookTitle.category_id == category_id).first()
    if used:
        raise HTTPException(status_code=400, detail="Chuyên ngành đang được sử dụng")
    item = db.query(Category).filter(Category.category_id == category_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy chuyên ngành")
    db.delete(item)
    db.commit()
    return {"message": "Đã xóa chuyên ngành"}
