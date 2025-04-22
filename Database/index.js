
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
app.use(express.json());
app.use(cors({
    origin:"*",
    credentials:true
}));

const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});

client.connect()
    .then(async () => {
        console.log("Database connected");

        await client.query(`
            CREATE TABLE IF NOT EXISTS user_layout (
                user_id TEXT PRIMARY KEY,
                charts JSONB DEFAULT '{}'::jsonb,
                data JSONB DEFAULT '{}'::jsonb,
                table_values JSONB DEFAULT '{}'::jsonb
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                password TEXT NOT NULL
            );
        `);
    })
    .catch(err => console.error("Connection error", err.stack));

const isValidJsonObject = (obj) => {
    return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};

app.post("/register", async (req, res) => {
    const { user_id, password } = req.body;
    if (!user_id || !password) {
        return res.status(400).json({ error: "user_id and password are required." });
    }
    try {
        await client.query(
            `INSERT INTO users (user_id, password) VALUES ($1, $2)`,
            [user_id, password]
        );
        res.json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// app.get("/innerflap-min-chart", async (req, res) => {
   

//     try {
//         const result = await client.query(
//             `SELECT get_innerflap_min_chart_json2(11,13) AS data`,
            
//         );
//         res.json({ result: result.rows[0].data });
//     } catch (error) {
//         console.error("Error calling function:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

app.get("/innerflap-min-chart/:param1/:param2", async (req, res) => {
    const { param1, param2 } = req.params;
    try {
        const result = await client.query(
            `SELECT get_innerflap_min_chart_json2($1, $2) AS data`,
            [param1, param2]
        );
        res.json({ result: result.rows[0].data });
    } catch (error) {
        console.error("Error calling function:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post("/login", async (req, res) => {
    const { user_id, password } = req.body;
    if (!user_id || !password) {
        return res.status(400).json({ error: "user_id and password are required." });
    }
    try {
        const result = await client.query(
            `SELECT * FROM users WHERE user_id = $1 AND password = $2`,
            [user_id, password]
        );
        if (result.rows.length > 0) {
            res.json({ message: "Login successful!", user_id });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/layout/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await client.query("SELECT * FROM user_layout WHERE user_id = $1", [userId]);
        if (result.rows.length) {
            res.json(result.rows[0]);
        } else {
            res.json({
                user_id: userId,
                charts: {},
                data: {},
                table_values: {}
            });
        }
    } catch (error) {
        console.error("Error fetching layout:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/layout/:userId", async (req, res) => {
    const { userId } = req.params;
    const { charts = {}, data = {}, table_values = {} } = req.body;

    if (!isValidJsonObject(charts) || !isValidJsonObject(data) || !isValidJsonObject(table_values)) {
        return res.status(400).json({
            error: "Invalid input. `charts`, `data`, and `table_values` must be valid JSON objects.",
        });
    }

    try {
        await client.query(
            `INSERT INTO user_layout (user_id, charts, data, table_values)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id)
             DO UPDATE SET 
                charts = EXCLUDED.charts,
                data = EXCLUDED.data,
                table_values = EXCLUDED.table_values`,
            [userId, charts, data, table_values]
        );
        res.json({ message: "Layout saved successfully!" });
    } catch (error) {
        console.error("Error saving layout:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/tables", async (req, res) => {
    try {
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE';
        `);
        const tables = result.rows.map(row => row.table_name);
        res.json({ tables });
    } catch (error) {
        console.error("Error fetching tables:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/table-columns/:tableName", async (req, res) => {
    const { tableName } = req.params;
    try {
        const result = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = $1
        `, [tableName]);
        res.json({
            table: tableName,
            columns: result.rows
        });
    } catch (error) {
        console.error("Error fetching table columns:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
