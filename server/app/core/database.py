from collections.abc import AsyncGenerator

from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from core.config import settings


class Base(DeclarativeBase):
    """Base class for ORM mapped classes (entities)."""


engine = create_async_engine(
    settings.database_url, echo=False, pool_size=10, max_overflow=20
)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
