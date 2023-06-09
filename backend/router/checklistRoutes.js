import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

import {
  getMyChecklist,
  deleteChecklistById,
  createChecklist,
  updateChecklist,
} from "../controllers/checklistController.js";

router.route("/").get(protect, getMyChecklist).post(protect, createChecklist);
router
  .route("/:id")
  .post(protect, updateChecklist)
  .delete(protect, deleteChecklistById);

export default router;
