import { Router } from "express";
import * as applicationController from "./application.controller";
import { protect, admin } from "../../middleware/authMiddleware";
import * as validation from "./application.validation";

const router = Router();

router.post(
    "/",
    protect,
    validation.validateApplication,
    applicationController.submitApplication
);

router.get("/", protect, applicationController.getApplications);

router.get("/stats", protect, admin, applicationController.getApplicationStats);

router.get("/:id", protect, applicationController.getApplicationById);

router.patch(
    "/:id",
    protect,
    applicationController.updateApplication
);

router.patch(
    "/:id/status",
    protect,
    admin,
    validation.validateStatus,
    applicationController.updateApplicationStatus
);

router.patch(
    "/:id/appointment",
    protect,
    admin,
    validation.validateAppointment,
    applicationController.setAppointment
);

export default router;
