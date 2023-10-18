from pydantic import BaseModel, Field, root_validator, validator
from typing import List


class geometrySchema(BaseModel):
    type: str
    coordinates: List[float]


class Address(BaseModel):
    latitude: float
    longitude: float
    geometry: geometrySchema
    country: str
    countryCode: str
    countryFlag: str
    county: str
    distance: float
    city: str
    stateCode: str
    state: str
    layer: str
    formattedAddress: str

    # @root_validator
    # def check_latitude_longitude(cls, values):
    #     latitude, longitude = values.get('latitude'), values.get('longitude')
    #     if latitude is None or longitude is None:
    #         raise ValueError("You must add a valid address")
    #     return values


class UserInputs(BaseModel):
    grossIncome: float = Field(..., gt=0, description="Required")
    bedrooms: int = Field(..., gt=0, description="Required")
    bathrooms: int = Field(..., gt=0, description="Required")
    size: float = Field(..., gt=0, description="Required")
    buildingSF: float = Field(..., gt=0, description="Required")
    numberOfUnits: int = Field(..., gt=0, description="Required")
    numberOfFloors: int = Field(..., gt=0, description="Required")
    pricePerACLand: float = Field(..., gt=0, description="Required")
    pricePerSFLand: float = Field(..., gt=0, description="Required")
    numberOf1BedroomsUnits: int = Field(..., ge=0, description="Required")
    numberOf2BedroomsUnits: int = Field(..., ge=0, description="Required")
    floorAreaRatio: float = Field(..., gt=0, description="Required")
    numberOfParkingSpaces: int = Field(..., ge=0, description="Required")
    numberOfStudiosUnits: int = Field(..., ge=0, description="Required")
    typicalFloorSF: float = Field(..., gt=0, description="Required")
    numberOf3BedroomsUnits: int = Field(..., ge=0, description="Required")
    landAreaAC: float = Field(..., gt=0, description="Required")
    landAreaSF: float = Field(..., gt=0, description="Required")
    starRating: float = Field(
        ..., ge=0, le=5, description="Rating must be between 0 and 5"
    )
    # netIncome: float = Field(..., gt=0, description="Required")
    yearBuilt: int = Field(..., gt=0, description="Required")
    age: int = Field(..., ge=0, description="Required")


class ContactInfo(BaseModel):
    name: str = Field(..., description="Required")
    email: str = Field(..., description="Required")
    phone: str = Field(..., description="Required")
    message: str = Field(..., description="Required")
