from fastapi import APIRouter, Depends, status

from core.dependencies import get_feedback_service
from features.feedback.schemas import FeedbackCreate, FeedbackResponse, FeedbackUpdate
from features.feedback.service import FeedbackService

router = APIRouter(prefix="/feedbacks", tags=["Feedbacks"])


@router.get("", response_model=list[FeedbackResponse])
async def list_feedbacks(
    service: FeedbackService = Depends(get_feedback_service),
):
    return await service.list()


@router.get("/{feedback_id}", response_model=FeedbackResponse)
async def get_feedback(
    feedback_id: int,
    service: FeedbackService = Depends(get_feedback_service),
):
    return await service.get(feedback_id)


@router.post(
    "/{project_id}/create",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_feedback(
    project_id: int,
    payload: FeedbackCreate,
    service: FeedbackService = Depends(get_feedback_service),
):
    return await service.create(
        data=payload,
        project_id=project_id,
        created_by=1,  # TODO: change after setting up auth
    )


@router.patch("/{feedback_id}", response_model=FeedbackResponse)
async def update_feedback(
    feedback_id: int,
    payload: FeedbackUpdate,
    service: FeedbackService = Depends(get_feedback_service),
):
    return await service.update(feedback_id, payload)


@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_feedback(
    feedback_id: int,
    service: FeedbackService = Depends(get_feedback_service),
):
    await service.delete(feedback_id)
