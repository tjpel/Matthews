from typing import Any

from httpx_oauth.clients.openid import OpenID

from app.core.config import config


def create_client() -> OpenID:
    return OpenID(
        config.google_client_id,
        config.google_client_secret,
        "https://accounts.google.com/.well-known/openid-configuration",
    )


client = create_client()


async def get_user_info(access_token: str) -> dict[str, Any]:
    async with client.get_httpx_client() as httpx_client:
        result = await httpx_client.get(
            client.openid_configuration["userinfo_endpoint"],
            headers={
                **client.request_headers,
                "Authorization": f"Bearer {access_token}",
            },
        )
    return result.json()
