import express from "express";
import { verify } from "../middleware/verify.js";
import {
    deleteTask,
    createTask,
    getTask,
    getTasks,
    updateTask,
} from "../controllers/task.js";

const router = express.Router();

// verify is a middleware which will check 
// if the user is authenticated or not
router.get("/", verify, getTasks);
router.post("/", verify, createTask);
router.get("/:id", verify, getTask);
router.put("/:id", verify, updateTask);
router.post("/:id", verify, deleteTask);

export default router;
