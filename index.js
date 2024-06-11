require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("Connted To Database");
  }
});

// GET METHOD
app.get("/", (req, res) => {
  const query = "SELECT * FROM todotasks";
  db.query(query, (err, tasks) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.render("todo.ejs", { tasks: tasks });
    }
  });
});

app.post("/", (req, res) => {
  const { content } = req.body;
  const query = "INSERT INTO todotasks (content) VALUES (?)";
  db.query(query, [content], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      res.redirect("/");
    }
  });
});

app.post("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const query = "UPDATE todotasks SET content = ? WHERE id = ?";
  db.query(query, [content, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.redirect("/");
    }
  });
});

app.post("/remove/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM todotasks WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is Up On ${process.env.PORT}`);
});
