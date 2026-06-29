import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.features.system_role.router import router
from app.features.employee.router import router as employee_router

app = FastAPI(
    title="Employee CRUD API",
    description="Documentation for CRUD API of Engineer Allocation Platform",
    version="1.0.0",
)
app.include_router(router)
app.include_router(employee_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.get("/health", tags=["Health Check"])
def health():
    return {"message": "App is healthy"}
