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
        console.log("Database connected");
        await client.query(`
            CREATE TABLE IF NOT EXISTS charts (
                user_id TEXT PRIMARY KEY,
                charts JSONB NOT NULL
            );
        `);

    })
    .catch(err => console.error(" Connection error", err.stack));

// Get charts for a user
app.get("/charts/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await client.query("SELECT charts FROM charts WHERE user_id = $1", [userId]);
        res.json({ userId, charts: result.rows.length ? result.rows[0].charts : [] });
    } catch (error) {
        console.error(" Error fetching charts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/charts/:userId", async (req, res) => {
    const { userId } = req.params;
    const { charts } = req.body;
    try {
        await client.query(
            `INSERT INTO charts (user_id, charts) 
             VALUES ($1, $2) 
             ON CONFLICT (user_id) 
             DO UPDATE SET charts = EXCLUDED.charts`,
            [userId, JSON.stringify(charts)]
        );
        res.json({ message: " Charts saved successfully!" });
    } catch (error) {
        console.error(" Error saving charts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));