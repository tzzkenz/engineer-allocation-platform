from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    database_url: str
    app_env: str = "development"
    debug: bool = False

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env")


settings = Settings()
