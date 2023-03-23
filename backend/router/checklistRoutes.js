import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

import {
  getMyChecklist,
  deleteChecklistById,
  createChecklist,
} from "../controllers/checklistController.js";

router.route("/").get(getMyChecklist).post(protect, createChecklist);
router.route("/:id").delete(protect, deleteChecklistById);

export default router;
