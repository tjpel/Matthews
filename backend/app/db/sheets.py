from typing import Any

from apiclient import discovery
from google.oauth2 import service_account

from app.core.config import config


try:
    scopes = ["https://www.googleapis.com/auth/spreadsheets"]
    secret_file = config.google_service_account_key_file

    credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=scopes)
    service = discovery.build("sheets", "v4", credentials=credentials)

    spreadsheet_id = config.google_sheets_id

except OSError as e:
    print(e)


def append(values: list[list[Any]]):
    data = {
        "values": values
    }

    res = service.spreadsheets().values().append(
        spreadsheetId=spreadsheet_id,
        range="A2:F2",
        valueInputOption="USER_ENTERED",
        body=data
    ).execute()

    print(res)
