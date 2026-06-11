import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

bearer_scheme = HTTPBearer()


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    payload = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta
        or timedelta(
            minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
        )
    )
    payload.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(
        payload,
        os.getenv("JWT_SECRET_KEY", "fallback-secret"),
        algorithm=os.getenv("JWT_ALGORITHM", "HS256"),
    )


def verify_access_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            os.getenv("JWT_SECRET_KEY", "fallback-secret"),
            algorithms=[os.getenv("JWT_ALGORITHM", "HS256")],
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


get_current_user = verify_access_token
