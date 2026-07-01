import codecs
import csv

from click import File
from fastapi import APIRouter, Depends, UploadFile, status
from fastapi.params import Query

from core.dependencies import get_employee_service
from features.employee.schemas import (
    EmployeeCreate,
    EmployeePaginatedResponse,
    EmployeeResponse,
    EmployeeSkillAddMultiple,
    EmployeeSkillResponse,
    EmployeeUpdate,
    EmployeeUpdateSelf,
    PasswordChange,
    UpdateInterest,
    UpdateProficiency,
)
from features.employee.service import EmployeeService
from features.auth.dependencies import get_current_user
from features.auth.schemas import TokenPayload

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.patch("/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_employee_password(
    payload: PasswordChange,
    service: EmployeeService = Depends(get_employee_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    await service.change_password(
        current_user.id, payload.model_dump(), current_user.id
    )


@router.get("", response_model=EmployeePaginatedResponse)
async def list_employees(
    identifier: str | None = Query(default=None, description="Flexible match filter accepting an exact ID, an exact Email, or a partial Name"),
    system_role_id: int | None = Query(default=None, description="Optional system role ID to filter candidates"),
    skill_ids: list[int] = Query(default=[], description="List of skill/stack requirement IDs to check intersection against"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1),
    service: EmployeeService = Depends(get_employee_service),
):
    return await service.list_all(
        page=page, 
        limit=limit, 
        identifier=identifier, 
        system_role_id=system_role_id, 
        skill_ids=skill_ids
    )
@router.get("/me", response_model=EmployeeResponse)
async def get_current_employee(
    service: EmployeeService = Depends(get_employee_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.get(current_user.id)


@router.get("/{id}", response_model=EmployeeResponse)
async def get_employee_by_id(
    id: int,
    service: EmployeeService = Depends(get_employee_service),
):
    return await service.get(id)


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    payload: EmployeeCreate,
    service: EmployeeService = Depends(get_employee_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.create(payload.model_dump(), current_user.id)


@router.post("/upload")
async def upload(
    file: UploadFile = File(...),
    service: EmployeeService = Depends(get_employee_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    csv_reader = csv.DictReader(codecs.iterdecode(file.file, "utf-8"))

    data = []
    for row in csv_reader:
        data.append(
            {
                **row,
                "experience": int(row["experience"]) if row.get("experience") else None,
                "system_role_id": int(row["system_role_id"])
                if row.get("system_role_id")
                else None,
            }
        )

    file.file.close()
    return await service.create_from_file(data, current_user.id)


@router.patch("/me", response_model=EmployeeResponse)
async def update_employee_self(
    payload: EmployeeUpdateSelf,
    service: EmployeeService = Depends(get_employee_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.update(
        current_user.id, payload.model_dump(exclude_none=True), current_user.id
    )


@router.patch("/{id}", response_model=EmployeeResponse)
async def update_employee(
    id: int,
    payload: EmployeeUpdate,
    service: EmployeeService = Depends(get_employee_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    return await service.update(id, payload.model_dump(), current_user.id)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    id: int,
    service: EmployeeService = Depends(get_employee_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    await service.delete(id, current_user.id)


@router.post("/{id}/skills", status_code=status.HTTP_201_CREATED)
async def add_employee_skills(
    id: int,
    payload: EmployeeSkillAddMultiple,
    service: EmployeeService = Depends(get_employee_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    await service.add_skills(id, payload, current_user.id)
    return {"message": "Skills assigned successfully"}


@router.patch(
    "/{id}/skills/{skill_id}/proficiency", status_code=status.HTTP_204_NO_CONTENT
)
async def update_skill_proficiency(
    id: int,
    skill_id: int,
    payload: UpdateProficiency,
    service: EmployeeService = Depends(get_employee_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    await service.update_skill_proficiency(id, skill_id, payload, current_user.id)


@router.patch(
    "/{id}/skills/{skill_id}/interest", status_code=status.HTTP_204_NO_CONTENT
)
async def update_skill_interest(
    id: int,
    skill_id: int,
    payload: UpdateInterest,
    service: EmployeeService = Depends(get_employee_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    await service.update_skill_interest(id, skill_id, payload, current_user.id)


@router.delete("/{id}/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_employee_skill(
    id: int,
    skill_id: int,
    service: EmployeeService = Depends(get_employee_service),
    current_user: TokenPayload = Depends(get_current_user),
):
    await service.remove_skill(id, skill_id, current_user.id)


@router.get("/{id}/skills", response_model=list[EmployeeSkillResponse])
async def get_employee_skills(
    id: int,
    service: EmployeeService = Depends(get_employee_service),
):
    return await service.get_skills(id)
