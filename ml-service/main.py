"""
ML Service - FastAPI
---------------------
This service exposes a pre-trained model via a REST API.

For this demo, model.py contains a small dummy model trained at
startup so the service runs immediately with zero setup.

To use YOUR real pre-trained model instead:
  1. Drop your trained file in this folder (e.g. model.pkl)
  2. In model.py, replace the dummy training block with:
       import joblib
       model = joblib.load("model.pkl")
  3. Update predict_input fields in schemas.py to match your model's
     actual input features.

Everything else (FastAPI routes, CORS, deployment config) stays the same.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

from schemas import PredictRequest, PredictResponse
from model import predict, MODEL_VERSION

app = FastAPI(
    title="ML Service",
    description="Serves predictions from a pre-trained model.",
    version="1.0.0",
)

# ---------------------------------------------------------------------
# CORS
# Allow your Node backend (and optionally frontend, for direct testing)
# to call this service. Set ALLOWED_ORIGIN via App Service Configuration
# in Azure -> Configuration -> Application settings.
# ---------------------------------------------------------------------
allowed_origin = os.environ.get("ALLOWED_ORIGIN", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[allowed_origin] if allowed_origin != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Quick check that the service is up."""
    return {"service": "ml-service", "status": "running", "model_version": MODEL_VERSION}


@app.get("/health")
def health():
    """
    Health check endpoint.
    Azure App Service / load balancers can ping this to confirm
    the container is alive.
    """
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictResponse)
def predict_endpoint(payload: PredictRequest):
    """
    Main prediction endpoint.

    Example request body:
    {
        "feature1": 5.2,
        "feature2": 3.1,
        "feature3": 1.4,
        "feature4": 0.2
    }
    """
    try:
        result = predict(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


if __name__ == "__main__":
    # Only used for local dev (python main.py).
    # In Azure, gunicorn + uvicorn worker is used instead (see Startup Command).
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
