import { validationResult } from "express-validator";

export default function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation failed for path:", req.originalUrl, "errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
