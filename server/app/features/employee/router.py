from fastapi import APIRouter, Depends, status

from core.dependencies import get_employee_service
from features.employee.schemas import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeUpdate,
    EmployeeUpdateSelf,
    PasswordChange,
)
from features.employee.service import EmployeeService

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=list[EmployeeResponse])
async def list_employees(
    service: EmployeeService = Depends(get_employee_service),
):
    return await service.list()


@router.get("/{id}", response_model=EmployeeResponse)
async def get_employee(
    id: int,
    service: EmployeeService = Depends(get_employee_service),
):
    return await service.get(id)


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    payload: EmployeeCreate,
    service: EmployeeService = Depends(get_employee_service),
):
    return await service.create(payload.model_dump())


@router.patch("/{id}", response_model=EmployeeResponse)
async def update_employee(
    id: int,
    payload: EmployeeUpdate,
    service: EmployeeService = Depends(get_employee_service),
):
    return await service.update(id, payload.model_dump())


@router.patch("/{id}/me", response_model=EmployeeResponse)
async def update_employee_self(
    id: int,
    payload: EmployeeUpdateSelf,
    service: EmployeeService = Depends(get_employee_service),
):
    return await service.update(id, payload.model_dump(exclude_none=True))


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    id: int,
    service: EmployeeService = Depends(get_employee_service),
):
    await service.delete(id)


@router.patch("/{id}/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_employee_password(
    id: int,
    payload: PasswordChange,
    service: EmployeeService = Depends(get_employee_service),
):
    await service.change_password(id, payload.model_dump())