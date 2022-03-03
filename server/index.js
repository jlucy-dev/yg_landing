const express = require("express");
const app = express();
const requstip= require("request-ip");
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
  const contact = req.body.contact;
  const message = req.body.message;
  const date = new Date();
  const sqlPost =
    "INSERT INTO customer (name, nation, contact, message, date) VALUES (?, ?, ?, ?, ?)";
  db.query(sqlPost, [name, nation, contact, message, date], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      () => res.send(result);
    }
  });
});

// 아이피 주소 받아오기 IPv6
app.get("/", (req, res) => {
  res.send("ip check");
  console.log("client IP" + requstip.getClientIp(req))
})

app.get("/check", (req, res) => {
  res.send("서버 연결 확인");
});

app.listen(4000, () => {
  console.log("back running");
});
