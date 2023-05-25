const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;

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
//SerarchAllDrugs
app.get("/searchDrugs", (req, res) => {
  const searchTerm = req.query.item;
  let sql = `SELECT * FROM drugs WHERE d_name LIKE '${searchTerm}%' OR d_brand LIKE '${searchTerm}%' `;

  dbConfig.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log("App is running on port :", port);
});
