from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "FakaInvest Core API"
    API_V1_STR: str = "/api/v1"
    
    # PostgreSQL Configuration
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "fakainvest"
    POSTGRES_PORT: str = "5432"

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        # Use SQLite so it runs instantly without requiring a Docker/Postgres setup:
        return "sqlite+aiosqlite:///./fakainvest.db"

    # JWT Authentication (Used to verify tokens from Next.js BFF)
    JWT_SECRET_KEY: str = "your-nextjs-jwt-secret-key"
    JWT_ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()
