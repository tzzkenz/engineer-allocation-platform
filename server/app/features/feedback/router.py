from fastapi import APIRouter, Depends, status

from core.dependencies import get_feedback_service
from features.feedback.schemas import FeedbackCreate, FeedbackResponse, FeedbackUpdate
from features.feedback.service import FeedbackService
from features.auth.dependencies import get_current_user
from features.auth.schemas import TokenPayload

router = APIRouter(prefix="/feedbacks", tags=["Feedbacks"])


@router.get("", response_model=list[FeedbackResponse])
async def list_feedbacks(
    service: FeedbackService = Depends(get_feedback_service),
):
    return await service.list_all()


@router.get("/{feedback_id}", response_model=FeedbackResponse)
async def get_feedback(
    feedback_id: int,
    service: FeedbackService = Depends(get_feedback_service),
):
    return await service.get(feedback_id)


@router.get("/project/{project_id}", response_model=list[FeedbackResponse])
async def get_feedbacks_for_project(
    project_id: int,
    service: FeedbackService = Depends(get_feedback_service),
):
    return await service.get_by_project_id(project_id)


@router.post(
    "/{project_id}/create",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_feedback(
    project_id: int,
    payload: FeedbackCreate,
    service: FeedbackService = Depends(get_feedback_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.create(
        data=payload, project_id=project_id, created_by=current_user.id
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
