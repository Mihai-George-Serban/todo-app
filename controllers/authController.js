import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if  (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email and password are required" });
    }
    try {
        const checkQuery = "SELECT * FROM users WHERE username = $1 OR email = $2";
        const checkValues = [username, email];
        const checkResult = await pool.query(checkQuery, checkValues);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: "Username or email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
        const values = [username, email, hashedPassword];
        const result = await pool.query(query, values);
        await pool.query("SELECT setval(\'users_id_seq\', (SELECT MAX(id) FROM users))");
        const user = result.rows[0];
        delete user.password;
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating user", details: err.message });
    }
};

export const getUsers = async (req, res) => {
    const query = "SELECT * FROM users";

    try {
        const result = await pool.query(query);
        if (result.rows.length == 0) {
            return res.status(200).json({ message: "There are currently no users in the database" });
        }
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.stack);
        return res.status(500).json({ error: "Failed to get users" });
    }
};

export const login = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email and password are required" });
    }
    try {
        const query = "SELECT * FROM users WHERE username = $1 AND email = $2";
        const values = [username, email];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: "JWT secret not set" });
        }
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error logging in", details: err.message });
    }
};