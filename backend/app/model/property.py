from pydantic import BaseModel, Field


# class UserInputs(BaseModel):
#     grossIncome: float = Field(..., gt=0, description="Required")
#     bedrooms: int = Field(..., gt=0, description="Required")
#     bathrooms: int = Field(..., gt=0, description="Required")
#     size: float = Field(..., gt=0, description="Required")
#     buildingSF: float = Field(..., gt=0, description="Required")
#     numberOfUnits: int = Field(..., gt=0, description="Required")
#     numberOfFloors: int = Field(..., gt=0, description="Required")
#     pricePerACLand: float = Field(..., gt=0, description="Required")
#     pricePerSFLand: float = Field(..., gt=0, description="Required")
#     numberOf1BedroomsUnits: int = Field(..., ge=0, description="Required")
#     numberOf2BedroomsUnits: int = Field(..., ge=0, description="Required")
#     floorAreaRatio: float = Field(..., gt=0, description="Required")
#     numberOfParkingSpaces: int = Field(..., ge=0, description="Required")
#     numberOfStudiosUnits: int = Field(..., ge=0, description="Required")
#     typicalFloorSF: float = Field(..., gt=0, description="Required")
#     numberOf3BedroomsUnits: int = Field(..., ge=0, description="Required")
#     landAreaAC: float = Field(..., gt=0, description="Required")
#     landAreaSF: float = Field(..., gt=0, description="Required")
#     starRating: float = Field(
#         ..., ge=0, le=5, description="Rating must be between 0 and 5"
#     )
#     # netIncome: float = Field(..., gt=0, description="Required")
#     yearBuilt: int = Field(..., gt=0, description="Required")
#     age: int = Field(..., ge=0, description="Required")

class UserInputs(BaseModel):
    netIncome: float = Field(..., gt=0, description="Required")
    buildingSF: float = Field(..., gt=0, description="Required")
    parkingSpaces: int = Field(..., ge=0, description="Required")
    studioUnits: int = Field(..., ge=0, description="Required")
    oneBedroomUnits: int = Field(..., ge=0, description="Required")
    twoBedroomUnits: int = Field(..., ge=0, description="Required")
    threeBedroomUnits: int = Field(..., ge=0, description="Required")


class ContactInfo(BaseModel):
    name: str = Field(..., description="Required")
    email: str = Field(..., description="Required")
    phone: str = Field(..., description="Required")
    message: str = Field(..., description="Required")
