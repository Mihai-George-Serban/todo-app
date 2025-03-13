import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { createTask, getTasks, completeAllTasks, incompleteAllTasks, markTaskIncomplete, updateTask, softDeleteTask, restoreTask, searchTasks, updateTaskName } from "../controllers/taskController.js";

const router = express.Router();

router.post("/", authenticateJWT, createTask);
router.get("/", authenticateJWT, getTasks);
router.put("/complete-all", authenticateJWT, completeAllTasks);
router.put("/incomplete-all", authenticateJWT, incompleteAllTasks);
router.put("/:id/incomplete", authenticateJWT, markTaskIncomplete);
router.put("/:id", authenticateJWT, updateTask);
router.delete("/:id", authenticateJWT, softDeleteTask);
router.put("/:id/restore", authenticateJWT, restoreTask);
router.get("/search/:keyword", authenticateJWT, searchTasks);
router.put("/update/:id/:keyword", authenticateJWT, updateTaskName);

export default router;