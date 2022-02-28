const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "yg_admin",
  host: "ls-64a316e1863dbd10d24178a071ec8fa22bec593f.ciilmyupcbcw.ap-northeast-2.rds.amazonaws.com",
  password: ".o);VrW&Dl{0{0^;78-sF`tkEVY]nOo2",
  database: "Customers",
});

app.post("/", (req, res) => {
  const name = req.body.name;
  const nation = req.body.nation;
  const email = req.body.email;
  const phone = req.body.phone;
  const message = req.body.message;
  const sqlPost =
    "INSERT INTO customer (name, nation, email, phone, message) VALUES (?, ?, ?, ?, ?)";
  db.query(sqlPost, [name, nation, email, phone, message], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      () => res.send(result);
    }
  });
});

app.listen(4000, () => {
  console.log("back running");
});
