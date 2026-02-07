import { Router } from "express";
import { register, credentials } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/credentials", credentials);

export default router;
