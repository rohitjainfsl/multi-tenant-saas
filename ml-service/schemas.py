"""
Pydantic schemas for request/response validation.

This defines a generic 4-feature tabular input (like the classic
iris-style example) - swap field names/types to match your real model.
"""

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    """Input features sent to the model for prediction."""
    feature1: float = Field(..., example=5.2, description="First input feature")
    feature2: float = Field(..., example=3.1, description="Second input feature")
    feature3: float = Field(..., example=1.4, description="Third input feature")
    feature4: float = Field(..., example=0.2, description="Fourth input feature")


class PredictResponse(BaseModel):
    """Model's prediction result."""
    model_config = {"protected_namespaces": ()}

    prediction: str
    confidence: float
    model_version: str
