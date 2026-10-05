from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"
    llm_model: str = "gpt-4o-mini"
    demo_mode: bool = True
    max_upload_size_mb: int = 10
    database_url: str = "sqlite+aiosqlite:///./finsarthi.db"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
        extra = "ignore"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def llm_available(self) -> bool:
        return bool(self.openai_api_key) and not self.demo_mode


@lru_cache
def get_settings() -> Settings:
    return Settings()
