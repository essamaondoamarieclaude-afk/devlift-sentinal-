import os
import traceback

import asyncpg
from asyncpg import Pool

pool: Pool | None = None


def get_dsn() -> str:
    return os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")


async def init_db_pool():
    global pool
    dsn = get_dsn()
    print(f"Connecting to database ...")
    try:
        pool = await asyncpg.create_pool(
            dsn=dsn,
            min_size=1,
            max_size=10,
            timeout=120,
            command_timeout=60,
            max_inactive_connection_lifetime=30,
        )
        print("Database pool created successfully")
    except Exception as e:
        print(f"Failed to create database pool: {e}")
        traceback.print_exc()
        pool = None


async def close_db_pool():
    global pool
    if pool:
        await pool.close()
        pool = None
        print("Database pool closed")


async def get_db():
    if pool is None:
        raise RuntimeError("Database pool is not initialized")
    async with pool.acquire(timeout=10) as conn:
        yield conn
