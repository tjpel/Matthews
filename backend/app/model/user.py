import datetime

from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column

from pydantic import BaseModel

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime.datetime] = mapped_column(server_default=func.now())
    name: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)

    session_cycle: Mapped[int] = mapped_column(default=0)

    password_hash: Mapped[str | None]
    google_id: Mapped[str | None] = mapped_column(unique=True)


class RecordedData(BaseModel):
    name: str
    email: str
    phone: str
    message: str

    address: str
    result: float
