const express = require("express");
const Exceljs = require("exceljs");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const { google } = require("googleapis");

let corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createConnection({
  user: "landing_admin",
  host: "ls-263fc3828541b8b413276c89878b882284afc285.ciilmyupcbcw.ap-northeast-2.rds.amazonaws.com",
  password: "(3p1r#c_6=`>FaD[=K>d:-qx>L9ugI>X",
  database: "yg_database",
});

app.post("/", (req, res) => {
  console.log(req.body);
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
      };
    }
  });
});

// 아이피 주소 받아오기 IPv6

app.get("/check", (req, res) => {
  res.send("서버 연결 확인");
});

app.listen(4000, () => {
  console.log("back running");
});

// 시간 정보

let today;
let year;
let month;
let day;

const getTime = () => {
  today = new Date();
  year = today.getFullYear();
  month = ("0" + (today.getMonth() + 1)).slice(-2);
  day = ("0" + (today.getDate() - 2)).slice(-2);
  let dateString = year + "-" + month + "-" + day;
};

setInterval(() => {
  getTime();
  function check() {
    let sqlDate = `SELECT name, nation, contact, message, date FROM customer WHERE date LIKE "2022-${month}-${day}%"`;
    db.query(sqlDate, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        let result = JSON.parse(JSON.stringify(rows));
        addExcel(result);
      }
    });
  }
  check();

  function addExcel(event) {
    console.log(`Sending Day info ${month}-${day}`);
    const workbook = new Exceljs.Workbook();
    workbook.creator = "jlucy";
    const worksheet = workbook.addWorksheet("유저 리스트");
    worksheet.columns = [
      {
        header: "이름",
        key: "name",
      },
      {
        header: "국가",
        key: "nation",
      },
      {
        header: "연락처",
        key: "contact",
      },
      {
        header: "문의내용",
        key: "message",
      },
      {
        header: "날짜",
        key: "date",
      },
    ];
    const rawData = event;
    rawData.map((data, index) => {
      worksheet.addRow(data);
    });
    workbook.xlsx.writeFile(`./user_info_${day}.xlsx`);
    sendMail()
      .then((result) => console.log("email send!", result))
      .catch((err) => console.log(err));
  }
}, 43200000);

const CLIENT_ID =
  "152091840997-46ttjh8jig1ususmslujek17lsa3rpfd.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04upqbbsWW9YbCgYIARAAGAQSNwF-L9IrwQ60Q9Q8YEMrhfDFZNAEUAFWpnZrw0QuuGf7IS55O_JrRGjiptaT2DCiqdX25KbU36c";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "jiny_park@jlucy.co.kr",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      from: "jiny_park@jlucy.co.kr",
      to: "jiny0360@gmail.com, jiny3360@naver.com",
      subject: `${day}일차 DB자료 보내드립니다.`,
      text: "제이루시 담당자입니다. DB자료 보내드립니다. 이상 시 문의 주시면 조속한 조치를 하도록 하겠습니다.",
      attachments: [
        {
          filename: `user_info_${day}.xlsx`,
          path: `user_info_${day}.xlsx`,
        },
      ],
    };
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
