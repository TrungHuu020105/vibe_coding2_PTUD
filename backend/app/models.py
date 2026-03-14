from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(20), nullable=False, default="librarian")
    active = Column(Boolean, default=True)


class Reader(Base):
    __tablename__ = "readers"

    reader_id = Column(String(20), primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    class_name = Column(String(50), nullable=False)
    dob = Column(Date, nullable=False)
    gender = Column(String(20), nullable=False)
    active = Column(Boolean, default=True)


class Category(Base):
    __tablename__ = "categories"

    category_id = Column(String(20), primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)

    titles = relationship("BookTitle", back_populates="category")


class BookTitle(Base):
    __tablename__ = "book_titles"

    title_id = Column(String(20), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    publisher = Column(String(200), nullable=False)
    page_count = Column(Integer, nullable=False)
    size = Column(String(50), nullable=False)
    author = Column(String(150), nullable=False)
    quantity = Column(Integer, default=0)
    category_id = Column(String(20), ForeignKey("categories.category_id"), nullable=False)

    category = relationship("Category", back_populates="titles")
    copies = relationship("BookCopy", back_populates="title")


class BookCopy(Base):
    __tablename__ = "book_copies"

    copy_id = Column(String(20), primary_key=True, index=True)
    title_id = Column(String(20), ForeignKey("book_titles.title_id"), nullable=False)
    status = Column(String(20), nullable=False, default="available")
    acquired_date = Column(Date, nullable=False)

    title = relationship("BookTitle", back_populates="copies")


class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    copy_id = Column(String(20), ForeignKey("book_copies.copy_id"), nullable=False)
    reader_id = Column(String(20), ForeignKey("readers.reader_id"), nullable=False)
    librarian_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    borrow_date = Column(Date, nullable=False)
    return_date = Column(Date, nullable=True)
    status = Column(String(20), nullable=False, default="borrowed")
    borrow_condition = Column(String(50), nullable=False, default="Tot")
    return_condition = Column(String(50), nullable=True)
