const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());

// Local Connection
// const dbConfig = mysql.createConnection({
//   host: "localhost",
//   database: "medi",
//   user: "root",
//   password: "",
// });

// Hosted Connection
const dbConfig = mysql.createConnection({
  host: "sql9.freesqldatabase.com",
  database: "sql9621204",
  user: "sql9621204",
  password: "eMxsvJk2lv",
});
dbConfig.connect((err) => {
  if (err) {
    console.log(err);
    throw err;
  } else {
    console.log("Database Connected");
  }
});

//ViewAllDrugs
app.get("/allDrugs", (req, res) => {
  let sql = `SELECT * FROM drugs  `;
  dbConfig.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      res.json(rows);
    }
  });
});
//SerarchAllDrugs InsideBody
app.get("/searchDrugs", (req, res) => {
  let searchTerm = req.body.item;

  let sql = `SELECT * FROM drugs WHERE d_name LIKE '${searchTerm}%' OR d_brand LIKE '${searchTerm}%' `;

  dbConfig.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      if (rows && rows.length > 0) {
        res.json(rows);
      } else {
        res.json("There is no such kind of Drug name or brand");
      }
    }
  });
});

//Insert Drugs
app.post("/addDrugs", (req, res) => {
  const { d_name, d_brand } = req.body;

  let check = `SELECT * FROM drugs WHERE d_name = '${d_name}' AND d_brand = '${d_brand}'`;
  let sql = `INSERT INTO drugs (d_name, d_brand) VALUES ('${d_name}','${d_brand}')`;
  dbConfig.query(check, (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error " });
    }
    if (rows.length > 0) {
      return res.status(409).json({ error: "Drug already exists" });
    } else {
      // If the drug does not exist, insert it into the database
      dbConfig.query(sql, (err) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to insert data into the database" });
        }
        return res.status(201).json({ message: "Drug inserted successfully" });
      });
    }
  });
});

app.listen(port, () => {
  console.log("App is running on port :", port);
});
