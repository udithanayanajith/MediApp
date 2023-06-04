const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const connection = require("../lib/db.js");

// http://localhost:3000/api/signup
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  //   bcrypt.hash(password, 10, (err, hash) => {
  //     if (err) {
  //       return res.status(500).json({ error: err.message });
  //     }

  // Store the user in the database
  connection.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "User registered successfully" });
    }
  );
  //   });
});

// Login endpoint
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Check if user exists
      if (results.length === 0) {
        return res
          .status(401)
          .json({ error: "Authentication failed user exists" });
      }

      // Compare passwords
      if (password === results[0].password) {
        // Generate and return the JWT token
        const token = jwt.sign(
          { username: results[0].username },
          "secret", // Replace with your own secret key
          { expiresIn: "1h" }
        );

        res.json({ token });
      } else {
        res.status(401).json({ error: "Authentication failed" });
      }
    }
  );
});

module.exports = router;
