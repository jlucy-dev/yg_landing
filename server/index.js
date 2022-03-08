const express = require("express");
const Exceljs = require("exceljs");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const {
  google
} = require("googleapis");



let corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createConnection({
  user: "yg_admin",
  host: "ls-64a316e1863dbd10d24178a071ec8fa22bec593f.ciilmyupcbcw.ap-northeast-2.rds.amazonaws.com",
  password: ".o);VrW&Dl{0{0^;78-sF`tkEVY]nOo2",
  database: "Customers",
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
        console.log(name, nation, contact, message, date);
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
var today = new Date();
var year = today.getFullYear();
var month = ("0" + (today.getMonth() + 1)).slice(-2);
var day = ("0" + (today.getDate() - 1)).slice(-2);
var dateString = year + "-" + month + "-" + day;

// 메일 보내기
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "jiny0360@gmail.com",
    pass: "364852aa!",
  },
});

const mailOptions = {
  from: "jiny0360@gmail.com",
  to: "jiny_park@jlucy.co.kr",
  subject: "Hello",
  text: "영진 랜딩페이지",
  attachments: [{
    filename: `user_info_${day}.xlsx`,
    path: `user_info_${day}.xlsx`,
  }, ],
};

// setInterval(() => {
//   function check() {
//     let sqlDate = `SELECT name, nation, contact, message, date FROM customer WHERE date LIKE "2022-${month}-${day}%"`;
//     db.query(sqlDate, (err, rows) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(rows);
//         let result = JSON.parse(JSON.stringify(rows));
//         addExcel(result)
//       }
//     });
//   }
//   check();

//   function addExcel(event) {
//     console.log(`Sending Day info ${month}-${day}`)
//     const workbook = new Exceljs.Workbook();
//     workbook.creator = "jlucy";
//     const worksheet = workbook.addWorksheet("유저 리스트");
//     worksheet.columns = [{
//         header: '이름',
//         key: 'name'
//       },
//       {
//         header: '국가',
//         key: 'nation'
//       },
//       {
//         header: '연락처',
//         key: 'contact'
//       },
//       {
//         header: '문의내용',
//         key: 'message'
//       },
//       {
//         header: '날짜',
//         key: 'date'
//       },
//     ]
//     const rawData = event;
//     console.log(rawData)
//     rawData.map((data, index) => {
//       worksheet.addRow(data)
//     })
//     workbook.xlsx.writeFile(`./user_info_${day}.xlsx`);
//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.log("error message" + err)
//       } else {
//         console.log("message send!" + info.response)
//       }
//       transporter.close();
//     })
//   }

// }, 43200000);


const CLIENT_ID = "152091840997-46ttjh8jig1ususmslujek17lsa3rpfd.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04upqbbsWW9YbCgYIARAAGAQSNwF-L9IrwQ60Q9Q8YEMrhfDFZNAEUAFWpnZrw0QuuGf7IS55O_JrRGjiptaT2DCiqdX25KbU36c";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
})

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: "OAuth2",
        user: "jiny_park@jlucy.co.kr",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    })
    const mailOptions = {
      from: "jiny_park@jlucy.co.kr",
      to: "jiny0360@gmail.com, jiny3360@naver.com", 
      subject: "HELLO from gmail using api!",
      attachments: [{
        filename: `user_info_${day}.xlsx`,
        path: `user_info_${day}.xlsx`,
      }, ],
    }

    const result = await transport.sendMail(mailOptions)
    return result;
  } catch (error) {
    return error
  }
}

sendMail().then(result => console.log("email send!", result)).catch(err => console.log(err))