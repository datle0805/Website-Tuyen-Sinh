import { body } from "express-validator";

export const validateApplication = [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("dateOfBirth").isISO8601().withMessage("Valid date of birth is required"),
    body("gender").isIn(["male", "female", "other"]).withMessage("Invalid gender"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("educationLevel").isIn([
        'Mẫu giáo',
        'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5',
        'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9',
        'Lớp 10', 'Lớp 11', 'Lớp 12',
        'Đại học',
        'TOEIC'
    ]).withMessage("Invalid education level"),
];

export const validateAppointment = [
    body("appointmentDate").isISO8601().withMessage("Valid appointment date is required"),
    body("appointmentTime").notEmpty().withMessage("Appointment time is required"),
    body("appointmentLocation").optional().isString(),
    body("appointmentNotes").optional().isString(),
];

export const validateStatus = [
    body("status").isIn(["pending", "reviewing", "accepted", "rejected"]).withMessage("Invalid status"),
];
