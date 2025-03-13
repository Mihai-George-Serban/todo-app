import { pool } from "../db.js";

export const createTask = (req, res) => {
    const { task, completed } = req.body;
    const query = "INSERT INTO todo (task, completed) VALUES ($1, $2) RETURNING *";
    const values = [task, completed];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({ error: "Failed to add task"});
        }
        return res.status(201).json(result.rows[0]);
    });
};

export const getTasks = (req, res) => {
    const query = "SELECT * FROM todo WHERE deleted_at IS NULL";

    pool.query(query, (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({ error: "Failed to get task"});
        }
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No tasks found in the database" });
        }
        return res.status(200).json(result.rows);
    });
};

export const completeAllTasks = (req, res) => {
    const query = "UPDATE todo SET completed = true RETURNING *";

    pool.query(query, (err, result) => {
        if (err) {
            console.error("PostgreSQL Error:", err);
            return res.status(500).json({ error: "Failed to update tasks", details: err.message });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No tasks found to update"});
        }
        return res.status(200).json(result.rows);
    });
};

export const incompleteAllTasks = (req, res) => {
    const query = "UPDATE todo SET completed = false RETURNING *";

    pool.query(query, (err, result) => {
        if (err) {
            console.error("PostgreSQL Error:", err);
            return res.status(500).json({ error: "Failed to update tasks", details: err.message });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No tasks found to update"});
        }
        return res.status(200).json(result.rows);
    });
};

export const markTaskIncomplete = (req, res) => {
    const { id } = req.body;
    const query = "UPDATE todo SET completed = false WHERE id = $1 RETURNING *";
    const values = [id];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({ error: "Failed to update task"});
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found"});
        }
        return res.status(200).json(result.rows[0]);
    });
};

export const updateTask = (req, res) => {
    const { id, task, completed } = req.body;
    const query = "UPDATE todo SET task = $1, completed = $2 WHERE id = $3 RETURNING *";
    const values = [task, completed, id];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({ error: "Failed to update task"});
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found"});
        }
        return res.status(200).json(result.rows[0]);
    });
};

export const softDeleteTask = (req, res) => {
    const { id  }= req.params;
    const query = "UPDATE todo SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL RETURNING *";
    const values = [id];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({ error: "Failed to delete task"});
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found"});
        }
        return res.status(200).json({ message: "Task soft deleted successfully" });
    });
};

export const restoreTask = (req, res) => {
    const { id } = req.body;
    const query = "UPDATE todo SET deleted_at = NULL WHERE id = $1 RETURNING *";
    const values = [id];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({ error: "Failed to restore task" });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        return res.status(200).json({ message: "Task restored successfully", task: result.rows[0] });
    });
};

export const searchTasks = (req, res) => {
    const { keyword } = req.params;
    const query = "SELECT * FROM todo WHERE task ILIKE $1";
    const values = [`%${keyword}%`];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({ error: "Failed to get task"});
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found"});
        }
        return res.status(200).json(result.rows);
    });
};

export const updateTaskName = (req, res) => {
    const { id, keyword } = req.params;
    const query = "UPDATE todo SET task = $2 WHERE id = $1 RETURNING *";
    const values = [id, keyword];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({ error: "Failed to update task name"});
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found"});
        }
        return res.status(200).json(result.rows); 
    });
};