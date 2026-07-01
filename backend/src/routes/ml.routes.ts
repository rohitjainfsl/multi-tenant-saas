import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * POST /ml/predict
 *
 * Protected — requires a valid accessToken cookie.
 * Accepts the 4 input features in the request body and
 * forwards them to the Python ML service's POST /predict endpoint.
 *
 * Request body: { feature1: number, feature2: number, feature3: number, feature4: number }
 * Response:     { success: true, prediction: string, confidence: number, model_version: string }
 */
router.post('/predict', protect, async (req, res): Promise<void> => {
  try {
    // 1. Extract input features from the request body
    const { feature1, feature2, feature3, feature4 } = req.body as {
      feature1?: number;
      feature2?: number;
      feature3?: number;
      feature4?: number;
    };

    // 2. Validate all four features are present
    if (
      feature1 === undefined ||
      feature2 === undefined ||
      feature3 === undefined ||
      feature4 === undefined
    ) {
      res.status(400).json({
        success: false,
        message:
          'All four features are required: feature1, feature2, feature3, feature4.',
      });
      return;
    }

    // 3. Guard against missing env var
    const mlServiceUrl = process.env.ML_SERVICE_URL;
    if (!mlServiceUrl) {
      res.status(500).json({
        success: false,
        message: 'ML_SERVICE_URL environment variable is not configured.',
      });
      return;
    }

    // 4. Forward the correctly shaped payload to the Python service
    const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feature1, feature2, feature3, feature4 }),
    });

    // 5. Propagate any error status from the ML service upstream
    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      res.status(mlResponse.status).json({
        success: false,
        message: `ML service returned an error: ${errorText}`,
      });
      return;
    }

    const mlResult = await mlResponse.json() as {
      prediction: string;
      confidence: number;
      model_version: string;
    };
    res.json({ success: true, ...mlResult });
  } catch (error) {
    // Network failure, timeout, or unexpected runtime error
    console.error('[ml/predict]', error);
    res.status(502).json({
      success: false,
      message: 'Failed to reach the ML service. Please try again later.',
    });
  }
});

export default router;
