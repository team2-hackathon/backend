require("dotenv").config();
const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
PORT = process.env.PORT || 8080;
const app = express();
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

// if user deos not exist in db, create user

//GET

app.post("/checkAuth", ClerkExpressRequireAuth({}), async (req, res) => {
  const connection = await db.promise().getConnection();
  try {
    console.log(req.body);

    const query = "SELECT * FROM users WHERE user_auth_id = ?";
    const [rows] = await connection.execute(query, [req.auth.userId]);

    if (rows.length === 0) {
      console.log("User Added");
      const query =
        "INSERT INTO users (user_auth_id, user_name, user_email, user_full_name) VALUES (?, ?, ?, ?)";
      const [res] = await connection.execute(query, [
        req.auth.userId,
        req.body.username,
        req.body.email,
        req.body.fullName,
      ]);
      console.log(res);
    }
    res.send("Success. User Authenticated");gi
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
});

//CREATE EXAMPLE
app.get("/create", async (req, res) => {
  const { username, email } = req.body;
  const connection = await db.promise().getConnection();
  try {
    const query =
      "INSERT INTO users (user_auth_id, user_name, user_email) VALUES (?, ?, ?)";
    const [result] = await connection.execute(query, [
      "4SsFJnfkN9Ouzsdpi3j9fyZ111",
      "John",
      "john@email.cim",
    ]);

    res
      .status(201)
      .json({ message: "User added successfully", userId: result.insertId });
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
