require("dotenv").config();
const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const app = express();
PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

//GET

app.get("/get", async (req, res) => {
  const connection = await db.promise().getConnection();
  try {
    const [rows, fields] = await connection.execute("SELECT * FROM users");
    res.send(rows);
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
});

//CREATE EXAMPLE
app.post("/create", async (req, res) => {
  const { username, email } = req.body;
  const connection = await db.promise().getConnection();
  try {
    const query = "INSERT INTO users (username, email) VALUES (?, ?)";
    const [result] = await connection.execute(query, [username, email]);

    res
      .status(201)
      .json({ message: "User created successfully", userId: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating user" });
  } finally {
    connection.release();
  }
});

app.listen(PORT, () => {
  console.log(
    `Express is throwing a party on port Fiesta http://localhost:${PORT}`
  );
});
