from fastapi import APIRouter, Depends
from asyncpg import Connection

from app.core.database import get_db

router = APIRouter()


@router.get("/db")
async def db_test(db: Connection = Depends(get_db)):
    row = await db.fetchrow("SELECT 1 AS test")
    return {"status": "connected", "result": row["test"]}
