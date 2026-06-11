import asyncio
import os

import asyncpg
from dotenv import load_dotenv

load_dotenv()


async def check():
    conn = await asyncpg.connect(os.getenv("DATABASE_URL"), timeout=10)
    cols = await conn.fetch(
        "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='users'"
    )
    for c in cols:
        print(f"{c['column_name']}  {c['data_type']}  nullable={c['is_nullable']}")
    await conn.close()


asyncio.run(check())
