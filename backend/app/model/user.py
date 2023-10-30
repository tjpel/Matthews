from pydantic import BaseModel


class RecordedData(BaseModel):
    name: str
    email: str
    phone: str
    message: str

    address: str
    result: float
