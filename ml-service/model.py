"""
Model loading + prediction logic.

DEMO MODE (current):
  A tiny scikit-learn classifier is trained in-memory on synthetic data
  when the service starts. This means the demo works instantly with
  zero external files - perfect for a live FDP walkthrough.

SWITCHING TO YOUR REAL PRE-TRAINED MODEL:
  Replace the "DEMO MODE" block below with:

      import joblib
      _model = joblib.load("model.pkl")
      MODEL_VERSION = "v1-production"

  Then update `predict()` to call `_model.predict(...)` using your
  model's actual expected input shape.
"""

from sklearn.ensemble import RandomForestClassifier
import numpy as np

from schemas import PredictRequest, PredictResponse

MODEL_VERSION = "v1-demo"

# ---------------------------------------------------------------------
# DEMO MODE - synthetic pre-trained model
# Trained once when the app starts (not on every request).
# ---------------------------------------------------------------------
_LABELS = ["Class A", "Class B", "Class C"]


def _train_demo_model():
    rng = np.random.RandomState(42)
    X = rng.rand(150, 4) * 10          # 150 samples, 4 features
    y = rng.randint(0, 3, 150)         # 3 classes
    clf = RandomForestClassifier(n_estimators=50, random_state=42)
    clf.fit(X, y)
    return clf


_model = _train_demo_model()


def predict(payload: PredictRequest) -> PredictResponse:
    """
    Takes validated input, runs it through the model,
    and returns a structured prediction.
    """
    features = np.array([[
        payload.feature1,
        payload.feature2,
        payload.feature3,
        payload.feature4,
    ]])

    pred_class = _model.predict(features)[0]
    probabilities = _model.predict_proba(features)[0]
    confidence = float(np.max(probabilities))

    return PredictResponse(
        prediction=_LABELS[pred_class],
        confidence=round(confidence, 4),
        model_version=MODEL_VERSION,
    )
