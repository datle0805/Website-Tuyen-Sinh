import { Router } from "express";
import { register, credentials, createAdmin } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/credentials", credentials);
router.post("/register-admin", createAdmin);


export default router;
