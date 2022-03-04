const express = require("express");
const Exceljs = require("exceljs")
const app = express();
const requstip = require("request-ip");
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
      () => {
        res.send(result);
        console.log(name, nation, contact, message, date);
      };
    }
  });
});

// 아이피 주소 받아오기 IPv6
app.get("/", (req, res) => {
  res.send("ip check");
  console.log("client IP" + requstip.getClientIp(req));
});

app.get("/check", (req, res) => {
  res.send("서버 연결 확인");
});

app.listen(4000, () => {
  console.log("back running");
});

setInterval(() => {
  var today = new Date();
  var year = today.getFullYear();
  var month = ("0" + (today.getMonth() + 1)).slice(-2);
  var day = ("0" + (today.getDate())).slice(-2);
  var dateString = year + "-" + month + "-" + day;


  function check() {
    let sqlDate = `SELECT name, nation, contact, message, date FROM customer WHERE date LIKE "2022-${month}-${day}%"`;
    db.query(sqlDate, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        console.log(rows);
        let result = JSON.parse(JSON.stringify(rows));
        addExcel(result)
      }
    });
  }
  check();

  function addExcel(event) {
    const workbook = new Exceljs.Workbook();
    workbook.creator = "jlucy";
    const worksheet = workbook.addWorksheet("유저 리스트");
    worksheet.columns = [
      {header: '이름', key: 'name'},
      {header: '국가', key: 'nation'},
      {header: '연락처', key: 'contact'},
      {header: '문의내용', key: 'message'},
      {header: '날짜', key: 'date'},
    ]
    const rawData = event;
    console.log(rawData)
    rawData.map((data, index)=>{
      worksheet.addRow(data)
    })
    workbook.xlsx.writeFile(`./test.xlsx`);
  }

}, 360000);