from apiclient import discovery
from google.oauth2 import service_account

from app.core.config import config
from app.model.user import RecordedData

scopes = ["https://www.googleapis.com/auth/spreadsheets"]
secret_file = config.google_service_account_key_file

credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=scopes)
service = discovery.build("sheets", "v4", credentials=credentials)

spreadsheet_id = config.google_sheets_id


def record(values: RecordedData):
    data = {
        "values": [list(values.model_dump().values())]
    }

    service.spreadsheets().values().append(
        spreadsheetId=spreadsheet_id,
        range="A2:F2",
        valueInputOption="USER_ENTERED",
        body=data
    ).execute()
