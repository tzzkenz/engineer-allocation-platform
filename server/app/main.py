from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from features.system_role.router import router
from exceptions.handler import register_exception_handlers

app = FastAPI(
    title="Employee CRUD API",
    description="Documentation for CRUD API of Engineer Allocation Platform",
    version="1.0.0",
)
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

register_exception_handlers(app)


@app.get("/health", tags=["Health Check"])
def health():
    return {"message": "App is healthy"}
