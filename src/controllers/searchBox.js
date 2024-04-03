var router = require("express").Router();

const connection = require("../models/connection");
const cookieParser = require("cookie-parser");
const { query } = require("express");
router.use(cookieParser());



async function details(req, res){
  let query = `select * from student_master limit 1000;`;
  connection.con.query(query, function (err, result) {
    if (err) throw err;
    res.render("../src/views/searchdetails", { data: result });
  });
};

async function idDetails (req, res) {
  let q1 = req.body.qr;
  let query = `select * from student_master where stu_id In (${q1}) `;
  connection.con.query(query, function (err, result, fields) {
    if (err) throw err;
    res.render("../src/views/details", { result: result, fields: fields });
  });
};

async function searchDetails(req, res) {
  let fn = req.body.fn;
  let ln = req.body.ln;
  let value = req.body.Andor;

  let query = `select * from student_master where firstname LIKE '%${fn}%' ${value} lastname LIKE '%${ln}%' `;

  connection.con.query(query, function (err, result, fields) {
    if (err) {
      res.send("Not Found");
    } else {
      res.render("../src/views/details", { result: result, fields: fields });
    }
  });
};

module.exports = { details, idDetails, searchDetails };
