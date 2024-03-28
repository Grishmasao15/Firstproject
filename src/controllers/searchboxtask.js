var router = require("express").Router();

const connection = require("../models/connection");

var parser = require("body-parser");

router.use(parser.json());
router.use(parser.urlencoded({ extended: false }));

var query;
var value;
var counter = 0;
var lmt = 10;
var pagenumber = 1;

router.get("/details", (req, res) => {
  query = `select * from student_master limit 1000;`;
  connection.con.query(query, function (err, result) {
    if (err) throw err;
    res.render("../src/views/searchdetails", { data: result });
  });
});

router.post("/iddetails", function (req, res) { 
  var q1 = req.body.qr;
  console.log(q1);
  query = `select * from student_master where stu_id In (${q1}) `;
  connection.con.query(query, function (err, result, fields) {
    if (err) throw err;
    res.render("../src/views/details", { result: result, fields: fields });
  });
});

router.post("/searchdetails", (req, res) => {
  var fn = req.body.fn;
  var ln = req.body.ln;
  value = req.body.Andor;
  var sql;

  sql = `select * from student_master where firstname LIKE '%${fn}%' ${value} lastname LIKE '%${ln}%' `;

  console.log("Query:" + sql);

  connection.con.query(sql, function (err, result, fields) {
    if (err) {
      res.send("Not Found");
    } else {
      res.render("../src/views/details", { result: result, fields: fields });
    }
  });
});


module.exports=router;
