from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .core.security import get_password_hash
from .database import Base, SessionLocal, engine
from .models import User
from .routers import auth, categories, copies, loans, readers, reports, titles, users

app = FastAPI(title="Library Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        existed = db.query(User).filter(User.username == "admin").first()
        if not existed:
            admin = User(
                username="admin",
                password_hash=get_password_hash("admin123"),
                full_name="Quản trị hệ thống",
                role="admin",
                active=True,
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(readers.router)
app.include_router(categories.router)
app.include_router(titles.router)
app.include_router(copies.router)
app.include_router(loans.router)
app.include_router(reports.router)


@app.get("/")
def root():
    return {"message": "API quản lý thư viện đang hoạt động"}
