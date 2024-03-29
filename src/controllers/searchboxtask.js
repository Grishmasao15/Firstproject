var router = require("express").Router();

const connection = require("../models/connection");
const { auth } = require("./middleware/auth");

var parser = require("body-parser");

router.use(parser.json());
router.use(parser.urlencoded({ extended: false }));

var query;


router.get("/details",auth, (req, res) => {
  query = `select * from student_master limit 1000;`;
  connection.con.query(query, function (err, result) {
    if (err) throw err;
    res.render("../src/views/searchdetails", { data: result });
  });
});

router.post("/iddetails",auth, function (req, res) { 
  let q1 = req.body.qr;
  query = `select * from student_master where stu_id In (${q1}) `;
  connection.con.query(query, function (err, result, fields) {
    if (err) throw err;
    res.render("../src/views/details", { result: result, fields: fields });
  });
});

router.post("/searchdetails",auth, (req, res) => {
  let fn = req.body.fn;
  let ln = req.body.ln;
  let value = req.body.Andor;
  let sql;

  sql = `select * from student_master where firstname LIKE '%${fn}%' ${value} lastname LIKE '%${ln}%' `;


  connection.con.query(sql, function (err, result, fields) {
    if (err) {
      res.send("Not Found");
    } else {
      res.render("../src/views/details", { result: result, fields: fields });
    }
  });
});


module.exports=router;
