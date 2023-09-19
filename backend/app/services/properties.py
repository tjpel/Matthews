from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

class Property(BaseModel):
    state: str
    city: str
    zipcode: int
    address: str

class User_inputs(BaseModel):
    gross_revenue: float  # Gross revenue from the property
    square_footage: float  # Total square footage of the property
    bedrooms: int  # Number of bedrooms
    bathrooms: int  # Number of bathrooms
    age: int  # Age of the property in years
    location_zip: int  # Zip code of the location
    has_garage: bool  # Whether the property has a garage
    has_pool: bool  # Whether the property has a pool
    lot_size: float  # Size of the lot in square feet
    property_type: str  # Type of property e.g. Single-Family, Condo, etc.
    amenities: list[str]  # List of amenities e.g. ["Fireplace", "Central Air"]
