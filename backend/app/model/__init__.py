# Provide an import route for alembic to ensure models are loaded for --autogenerate.
from app.db.base import Base  # noqa

from .user import User
