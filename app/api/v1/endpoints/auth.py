import uuid as _uuid

from asyncpg import Connection
from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_db
from app.core.security import create_access_token
from app.schemas.auth import LoginRequest, LoginResponse

SEEDED_BUSINESS_ID = "3c267080-c916-4b5a-bb1d-61119ebc7596"

router = APIRouter()


@router.post("/auth/login", response_model=LoginResponse)
async def login(body: LoginRequest, db: Connection = Depends(get_db)):
    if "@" not in body.email or not body.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    row = await db.fetchrow(
        "SELECT id, business_id FROM users WHERE email = $1", body.email
    )

    if row:
        business_id = str(row["business_id"])
    else:
        business_id = SEEDED_BUSINESS_ID
        user_id = _uuid.uuid4()
        await db.execute(
            "INSERT INTO users (id, business_id, email, role) VALUES ($1, $2, $3, 'admin')",
            user_id,
            _uuid.UUID(business_id),
            body.email,
        )

    token = create_access_token({"sub": body.email, "business_id": business_id})
    return LoginResponse(access_token=token)
