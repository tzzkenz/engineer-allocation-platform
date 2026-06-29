from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_employee_service
from app.features.employee.schemas import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeUpdate,
    PasswordChange,
)
from app.features.employee.service import EmployeeService

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


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    id: int,
    service: EmployeeService = Depends(get_employee_service),
):
    await service.delete(id)
    return {"message": f"Employee {id} marked as deleted."}

@router.patch("/{id}/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_employee_password(
    id: int,
    payload: PasswordChange,
    service: EmployeeService = Depends(get_employee_service),
):
    await service.change_password(id, payload.model_dump())
    return {"message": f"Password Changed for Employee ID: {id}"}