from dotenv import find_dotenv
from pydantic import computed_field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=find_dotenv(), env_file_encoding="utf-8", extra="ignore"
    )

    server_url: str
    api_v1_route: str

    cors_allowed_origins: list[str]

    session_secret: str
    session_max_age_days: int

    argon2_secret: str

    google_client_id: str
    google_client_secret: str

    google_service_account_key_file: str
    google_sheets_id: str

    postgres_host: str
    postgres_user: str
    postgres_password: str
    postgres_db: str

    @computed_field
    @property
    def database_url(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            host=self.postgres_host,
            username=self.postgres_user,
            password=self.postgres_password,
            path=self.postgres_db,
        )


config = Config()
