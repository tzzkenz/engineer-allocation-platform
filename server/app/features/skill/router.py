from fastapi import APIRouter, Depends, status

from core.dependencies import get_skill_service 
from features.skill.schemas import SkillCreate, SkillPatch, SkillResponse
from features.skill.service import SkillService

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("", response_model=list[SkillResponse])
async def list_skills(
    service: SkillService = Depends(get_skill_service),
):
    return await service.list()


@router.get("/{id}", response_model=SkillResponse)
async def get_skill_by_id(
    id: int,
    service: SkillService = Depends(get_skill_service),
):
    return await service.get_by_id(id)


@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    payload: SkillCreate,
    service: SkillService = Depends(get_skill_service),
):
    return await service.create(payload.model_dump())


@router.patch("/{id}", response_model=SkillResponse)
async def update_skill(
    id: int,
    payload: SkillPatch,
    service: SkillService = Depends(get_skill_service),
):
    return await service.update(id, payload.model_dump(exclude_none=True))


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    id: int,
    service: SkillService = Depends(get_skill_service),
):
    await service.delete(id)