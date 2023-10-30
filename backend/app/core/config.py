from dotenv import find_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=find_dotenv(), env_file_encoding="utf-8", extra="ignore"
    )

    server_url: str
    api_v1_route: str

    cors_allowed_origins: list[str]

    google_service_account_key_file: str
    google_sheets_id: str


config = Config()
