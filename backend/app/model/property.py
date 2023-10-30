from pydantic import BaseModel, Field


class UserInputs(BaseModel):
    netIncome: float = Field(..., gt=0, description="Required")
    buildingSF: float = Field(..., gt=0, description="Required")
    parkingSpaces: int = Field(..., ge=0, description="Required")
    studioUnits: int = Field(..., ge=0, description="Required")
    oneBedroomUnits: int = Field(..., ge=0, description="Required")
    twoBedroomUnits: int = Field(..., ge=0, description="Required")
    threeBedroomUnits: int = Field(..., ge=0, description="Required")
