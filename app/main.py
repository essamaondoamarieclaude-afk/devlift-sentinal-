from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.api.v1.endpoints.agents import router as agents_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.dashboard import router as dashboard_router
from app.api.v1.endpoints.orchestrator import router as orchestrator_router
from app.api.v1.endpoints.test_db import router as test_router
from app.core.database import close_db_pool, init_db_pool


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up Sentinel Backend")
    await init_db_pool()
    yield
    await close_db_pool()
    print("Shutting down Sentinel Backend")


app = FastAPI(
    title="Devlift Sentinel",
    description="Backend for Devlift Sentinel — AI-powered code analysis & monitoring",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(orchestrator_router, prefix="/api/v1")
app.include_router(test_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Sentinel Backend OK"}


@app.get("/health")
async def health():
    return {"status": "alive"}
