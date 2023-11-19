from fastapi import APIRouter

import app.db.sheets as sheets
from app.model.user import RecordedData

routes = APIRouter(prefix="/data_collection")


@routes.post("/record")
def record(data: RecordedData):
    print("Beginning record request")

    sheets.record(data)
