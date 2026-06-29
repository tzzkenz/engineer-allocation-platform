from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.feedback import Feedback, FeedbackType


class FeedbackRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, feedback_id: int) -> Feedback | None:
        stmt = select(Feedback).where(
            Feedback.id == feedback_id, Feedback.deleted_at.is_(None)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[Feedback]:
        stmt = select(Feedback).where(Feedback.deleted_at.is_(None))
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def create(
        self, note: str, feedback_type: FeedbackType, project_id: int, created_by: int
    ) -> Feedback:
        feedback = Feedback(
            note=note,
            feedback_type=feedback_type,
            project_id=project_id,
            created_by=created_by,
        )
        self.db.add(feedback)
        await self.db.flush()
        return feedback

    async def update(
        self,
        feedback: Feedback,
        note: str | None = None,
        feedback_type: FeedbackType | None = None,
    ) -> Feedback:
        if note is not None:
            feedback.note = note
        if feedback_type is not None:
            feedback.feedback_type = feedback_type
        await self.db.flush()
        return feedback

    async def soft_delete(self, feedback: Feedback) -> None:
        feedback.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()
