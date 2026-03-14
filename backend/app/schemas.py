from datetime import date
from pydantic import BaseModel, ConfigDict


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    username: str
    full_name: str
    role: str
    active: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: str
    role: str
    active: bool = True


class UserOut(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ReaderBase(BaseModel):
    full_name: str
    class_name: str
    dob: date
    gender: str
    active: bool = True


class ReaderCreate(ReaderBase):
    reader_id: str


class ReaderOut(ReaderBase):
    reader_id: str
    model_config = ConfigDict(from_attributes=True)


class CategoryBase(BaseModel):
    name: str
    description: str | None = None


class CategoryCreate(CategoryBase):
    category_id: str


class CategoryOut(CategoryCreate):
    model_config = ConfigDict(from_attributes=True)


class BookTitleBase(BaseModel):
    name: str
    publisher: str
    page_count: int
    size: str
    author: str
    category_id: str


class BookTitleCreate(BookTitleBase):
    title_id: str


class BookTitleOut(BookTitleCreate):
    quantity: int
    model_config = ConfigDict(from_attributes=True)


class BookCopyBase(BaseModel):
    title_id: str
    status: str
    acquired_date: date


class BookCopyCreate(BookCopyBase):
    copy_id: str


class BookCopyOut(BookCopyCreate):
    model_config = ConfigDict(from_attributes=True)


class LoanCreate(BaseModel):
    copy_id: str
    reader_id: str
    borrow_date: date
    borrow_condition: str = "Tot"


class LoanReturn(BaseModel):
    return_date: date
    return_condition: str = "Tot"


class LoanOut(BaseModel):
    id: int
    copy_id: str
    reader_id: str
    librarian_id: int
    borrow_date: date
    return_date: date | None = None
    status: str
    borrow_condition: str
    return_condition: str | None = None
    model_config = ConfigDict(from_attributes=True)
