from datetime import date

from app.core.security import get_password_hash
from app.database import Base, SessionLocal, engine
from app.models import BookCopy, BookTitle, Category, Loan, Reader, User


def ensure_user(db, username: str, password: str, full_name: str, role: str) -> User:
    user = db.query(User).filter(User.username == username).first()
    if user:
        user.full_name = full_name
        user.role = role
        user.active = True
        db.commit()
        db.refresh(user)
        return user

    user = User(
        username=username,
        password_hash=get_password_hash(password),
        full_name=full_name,
        role=role,
        active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def ensure_category(db, category_id: str, name: str, description: str | None = None) -> None:
    item = db.query(Category).filter(Category.category_id == category_id).first()
    if not item:
        db.add(Category(category_id=category_id, name=name, description=description))
        db.commit()


def ensure_reader(db, reader_id: str, full_name: str, class_name: str, dob: date, gender: str) -> None:
    item = db.query(Reader).filter(Reader.reader_id == reader_id).first()
    if not item:
        db.add(
            Reader(
                reader_id=reader_id,
                full_name=full_name,
                class_name=class_name,
                dob=dob,
                gender=gender,
                active=True,
            )
        )
        db.commit()


def ensure_title(
    db,
    title_id: str,
    name: str,
    publisher: str,
    page_count: int,
    size: str,
    author: str,
    category_id: str,
) -> None:
    item = db.query(BookTitle).filter(BookTitle.title_id == title_id).first()
    if not item:
        db.add(
            BookTitle(
                title_id=title_id,
                name=name,
                publisher=publisher,
                page_count=page_count,
                size=size,
                author=author,
                category_id=category_id,
                quantity=0,
            )
        )
        db.commit()


def ensure_copy(db, copy_id: str, title_id: str, status: str, acquired_date: date) -> None:
    item = db.query(BookCopy).filter(BookCopy.copy_id == copy_id).first()
    if not item:
        db.add(
            BookCopy(
                copy_id=copy_id,
                title_id=title_id,
                status=status,
                acquired_date=acquired_date,
            )
        )
        db.commit()


def recalc_quantity(db) -> None:
    titles = db.query(BookTitle).all()
    for t in titles:
        qty = db.query(BookCopy).filter(BookCopy.title_id == t.title_id, BookCopy.status != "removed").count()
        t.quantity = qty
    db.commit()


def ensure_sample_loans(db, librarian_id: int) -> None:
    has_data = db.query(Loan).first()
    if has_data:
        return

    db.add(
        Loan(
            copy_id="CP001",
            reader_id="DG001",
            librarian_id=librarian_id,
            borrow_date=date(2026, 3, 1),
            status="borrowed",
            borrow_condition="Tot",
            return_date=None,
            return_condition=None,
        )
    )
    db.add(
        Loan(
            copy_id="CP003",
            reader_id="DG002",
            librarian_id=librarian_id,
            borrow_date=date(2026, 2, 20),
            status="returned",
            borrow_condition="Tot",
            return_date=date(2026, 2, 28),
            return_condition="Tot",
        )
    )

    cp1 = db.query(BookCopy).filter(BookCopy.copy_id == "CP001").first()
    cp3 = db.query(BookCopy).filter(BookCopy.copy_id == "CP003").first()
    if cp1:
        cp1.status = "borrowed"
    if cp3:
        cp3.status = "available"

    db.commit()


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        admin = ensure_user(db, "admin", "admin123", "Quản trị hệ thống", "admin")
        ensure_user(db, "thuthu1", "123456", "Trần Thị Lan", "librarian")

        ensure_category(db, "CN001", "Công nghệ thông tin", "Tài liệu ngành CNTT")
        ensure_category(db, "CN002", "Kinh tế", "Tài liệu ngành Kinh tế")

        ensure_reader(db, "DG001", "Nguyễn Văn An", "KTPM01", date(2004, 5, 15), "Nam")
        ensure_reader(db, "DG002", "Trần Thị Bình", "KTPM02", date(2004, 8, 20), "Nữ")
        ensure_reader(db, "DG003", "Lê Minh Châu", "QTKD01", date(2003, 12, 1), "Nữ")

        ensure_title(db, "DS001", "Lập trình Python cơ bản", "NXB Giáo dục", 320, "16x24", "Nguyễn A", "CN001")
        ensure_title(db, "DS002", "Cấu trúc dữ liệu", "NXB Khoa học", 410, "16x24", "Trần B", "CN001")
        ensure_title(db, "DS003", "Nguyên lý Kế toán", "NXB Tài chính", 280, "16x24", "Lê C", "CN002")

        ensure_copy(db, "CP001", "DS001", "available", date(2025, 9, 1))
        ensure_copy(db, "CP002", "DS001", "available", date(2025, 9, 2))
        ensure_copy(db, "CP003", "DS002", "available", date(2025, 9, 3))
        ensure_copy(db, "CP004", "DS003", "available", date(2025, 9, 4))

        recalc_quantity(db)
        ensure_sample_loans(db, admin.id)

        print("Da nap du lieu test thanh cong.")
        print("Tai khoan: admin/admin123 va thuthu1/123456")
    finally:
        db.close()


if __name__ == "__main__":
    main()
