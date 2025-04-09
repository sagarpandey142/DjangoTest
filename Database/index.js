
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());


const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});


client.connect()
    .then(async () => {
        console.log(" Database connected");

        await client.query(`
            CREATE TABLE IF NOT EXISTS user_layout (
                user_id TEXT PRIMARY KEY,
                charts JSONB DEFAULT '{}'::jsonb,
                data JSONB DEFAULT '{}'::jsonb,
                table_values JSONB DEFAULT '{}'::jsonb
            );
        `);
    })
    .catch(err => console.error("Connection error", err.stack));

const isValidJsonObject = (obj) => {
    return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};


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
        console.error(" Error fetching layout:", error);
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
        console.error(" Error fetching tables:", error);
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
        console.error(" Error fetching table columns:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
