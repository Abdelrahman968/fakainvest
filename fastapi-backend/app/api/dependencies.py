from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db

# Future additions: JWT authentication validator from Next.js could be added here
# e.g., async def get_current_user(token: str = Depends(oauth2_scheme)): ...

async def get_db_session() -> AsyncSession:
    async for session in get_db():
        yield session
