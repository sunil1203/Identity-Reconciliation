import { Router } from "express";

import * as ContactController from "../controllers/contact.controller";

const router = Router();

// POST /identify
router.post("/identify", ContactController.identify);

export default router;