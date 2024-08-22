import express from "express";
import { verify } from "../middleware/verify.js";
import { createTask, getTask, getTasks, updateTask } from "../controllers/task.js";

const router = express.Router();

router.get("/", verify, getTasks);
router.post("/", verify, createTask);
router.get("/:id", verify, getTask);
router.put("/:id", verify, updateTask);

export default router;
