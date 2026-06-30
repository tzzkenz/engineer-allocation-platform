from sqlalchemy.exc import IntegrityError

from exceptions import ConflictException, NotFoundException, UnknownException
from features.feedback.repository import FeedbackRepository
from features.feedback.schemas import FeedbackCreate, FeedbackUpdate
from models.feedback import Feedback


class FeedbackService:
    def __init__(self, repo: FeedbackRepository):
        self.repo = repo

    async def get(self, feedback_id: int) -> Feedback:
        feedback = await self.repo.get_by_id(feedback_id)

        if not feedback:
            raise NotFoundException("Feedback not found")

        return feedback

    async def list_all(self) -> list[Feedback]:
        return await self.repo.list_all()

    async def get_by_project_id(self, project_id: int) -> list[Feedback]:
        feedbacks = await self.repo.get_by_project_id(project_id)
        return feedbacks

    async def create(
        self,
        data: FeedbackCreate,
        project_id: int,
        created_by: int,
    ) -> Feedback:
        try:
            feedback_id = await self.repo.create(
                note=data.note.strip(),
                feedback_type=data.feedback_type,
                project_id=project_id,
                created_by=created_by,
            )

            await self.repo.db.commit()
            return await self.repo.get_by_id(feedback_id)

        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Feedback already exists or violates constraints")

        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))

    async def update(
        self,
        feedback_id: int,
        data: FeedbackUpdate,
    ) -> Feedback:
        feedback = await self.get(feedback_id)

        update_data = {}

        if data.note is not None:
            update_data["note"] = data.note.strip()

        if data.feedback_type is not None:
            update_data["feedback_type"] = data.feedback_type

        if not update_data:
            return feedback

        try:
            feedback = await self.repo.update(feedback, **update_data)
            await self.repo.db.commit()
            await self.repo.db.refresh(feedback)
            return feedback

        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Database constraint violation during update")

        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))

    async def delete(self, feedback_id: int) -> None:
        feedback = await self.get(feedback_id)

        try:
            await self.repo.soft_delete(feedback)
            await self.repo.db.commit()

        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Cannot delete feedback due to constraints")

        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))
