import json
import base64
import gzip

from apiclient import discovery
from google.oauth2 import service_account

from app.core.config import config
from app.model.user import RecordedData

scopes = ["https://www.googleapis.com/auth/spreadsheets"]

secret_gzip = base64.b64decode(config.google_service_account_secret)
secret_bytes = gzip.decompress(secret_gzip)
secret = json.loads(secret_bytes)

credentials = service_account.Credentials.from_service_account_info(secret, scopes=scopes)
service = discovery.build("sheets", "v4", credentials=credentials)

spreadsheet_id = config.google_sheets_id
sheets = service.spreadsheets().values()


def record(values: RecordedData):
    data = {
        "values": [[
            values.name,
            values.email,
            values.phone,
            values.address,
            values.result,
            values.message
        ]]
    }

    sheets.append(
        spreadsheetId=spreadsheet_id,
        range="A2:F2",
        valueInputOption="USER_ENTERED",
        body=data
    ).execute()
