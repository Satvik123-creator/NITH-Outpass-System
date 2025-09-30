import { body, param } from "express-validator";

export const signupValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["student", "warden"])
    .withMessage("Role must be student or warden"),
];

export const loginValidator = [
  body().custom((value, { req }) => {
    if (!req.body.enrollmentNo && !req.body.employeeNo && !req.body.enrollment)
      throw new Error("enrollmentNo or employeeNo is required");
    return true;
  }),
  body("password").notEmpty().withMessage("Password is required"),
];

export const otpValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
];

export const forgotPasswordValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
];

export const resetPasswordValidator = [
  body("token").notEmpty().withMessage("Token is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

export const createOutpassValidator = [
  body("reason").trim().notEmpty().withMessage("Reason is required"),
  body("fromDate").notEmpty().withMessage("From date is required"),
  body("toDate").notEmpty().withMessage("To date is required"),
];

export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid id"),
];
