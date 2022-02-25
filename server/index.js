const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

app.use(cors());
// db = mysql.createConnection({

// })

app.listen(4000, ()=>{console.log("back running")})