var router = require("express").Router();
const mysql = require("mysql");

const connection = require("../models/connection");
const { auth } = require("./middleware/auth");


var counter = 0;
var number = 1;

  router.get("/attendancedetails",auth,function (req, res) {
    number = 1;
    counter = 0;

    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    } else {
      month = 12;
      year = 2023;
    }
    let q = `SELECT student_master.stu_id,student_master.firstname,student_master.lastname,
             YEAR(attendance_master.date_) AS year,
             MONTH(attendance_master.date_) AS month,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) as Total_present,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) * 100/30 as Percentage From student_master
             inner join attendance_master on student_master.stu_id=attendance_master.stu_id where year(attendance_master.date_)=${year} and 
             MONTH(attendance_master.date_)=${month} group by year,month,student_master.stu_id limit 50 offset ?;`;
    connection.con.query(q, [counter], function (err, result) {
      if (err) throw err;
      res.render("../src/views/attendance", { data: result, number: number });
    });
  });

  router.post("/attendancesheethome",auth,function (req, res) {
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }
    counter = 0;
    let p = `SELECT student_master.stu_id,student_master.firstname,student_master.lastname,
             YEAR(attendance_master.date_) AS year,
             MONTH(attendance_master.date_) AS month,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) as Total_present,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) * 100/30 as Percentage From student_master
             inner join attendance_master on student_master.stu_id=attendance_master.stu_id where year(attendance_master.date_)=${year} and 
             MONTH(attendance_master.date_)=${month} group by year,month,student_master.stu_id limit 50 offset ?;`;
    connection.con.query(p, [counter], function (err, result) {
      if (err) throw err;
      number = counter / 50 + 1;
      res.render("../src/views/attendance", { data: result, number: number });
    });
  });

  router.post("/attendancesheetprevious", auth,function (req, res) {
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }
    counter -= 50;
    let p = `SELECT student_master.stu_id,student_master.firstname,student_master.lastname,
             YEAR(attendance_master.date_) AS year,
             MONTH(attendance_master.date_) AS month,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) as Total_present,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) * 100/30 as Percentage From student_master
             inner join attendance_master on student_master.stu_id=attendance_master.stu_id where year(attendance_master.date_)=${year} and 
             MONTH(attendance_master.date_)=${month} group by year,month,student_master.stu_id limit 50 offset ?;`;
    connection.con.query(p, [counter], function (err, result) {
      if (err) throw err;
      number = counter / 50 + 1;
      res.render("../src/views/attendance", { data: result, number: number });
    });
  });

  router.post("/attendancesheetnext", auth,function (req, res) {
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }
    counter += 50;
    let p = `SELECT student_master.stu_id,student_master.firstname,student_master.lastname,
             YEAR(attendance_master.date_) AS year,
             MONTH(attendance_master.date_) AS month,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) as Total_present,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) * 100/30 as Percentage From student_master
             inner join attendance_master on student_master.stu_id=attendance_master.stu_id where year(attendance_master.date_)=${year} and 
             MONTH(attendance_master.date_)=${month} group by year,month,student_master.stu_id limit 50 offset ?;`;
    connection.con.query(p, [counter], function (err, result) {
      if (err) throw err;
      number = counter / 50 + 1;
      res.render("../src/views/attendance", { data: result, number: number });
    });
  });

  router.post("/attendancesheetend", auth,function (req, res) {
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }

    counter = 150;
    let p = `SELECT student_master.stu_id,student_master.firstname,student_master.lastname,
             YEAR(attendance_master.date_) AS year,
             MONTH(attendance_master.date_) AS month,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) as Total_present,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) * 100/30 as Percentage From student_master
             inner join attendance_master on student_master.stu_id=attendance_master.stu_id where year(attendance_master.date_)=${year} and 
             MONTH(attendance_master.date_)=${month} group by year,month,student_master.stu_id limit 50 offset ?;`;
    connection.con.query(p, [counter], function (err, result) {
      if (err) throw err;
      number = counter / 50 + 1;
      res.render("../src/views/attendance", { data: result, number: number });
    });
  });

  module.exports = router;

