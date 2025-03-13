import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "todo_app",
    password: "MiTzZa91!",
    port: 5432,
});

export { pool };