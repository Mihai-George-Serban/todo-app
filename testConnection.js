import { pool } from "./db.js";

pool.query("SELECT * FROM todo", (err, res) => {
    if (err) {
        console.log(err.stack);
    } else {
        console.log(res.rows);
    }
});