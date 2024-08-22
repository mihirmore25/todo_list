import express from "express";
import { verify } from "../middleware/verify.js";
import { createTask, getTask, getTasks } from "../controllers/task.js";

const router = express.Router();

router.get("/", verify, getTasks);
router.post("/", verify, createTask);
router.get("/:id", verify, getTask);

export default router;
