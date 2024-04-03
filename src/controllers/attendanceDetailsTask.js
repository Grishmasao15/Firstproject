var router = require("express").Router();

const connection = require("../models/connection");
const cookieParser = require("cookie-parser");
router.use(cookieParser());


var counter = 0;
var number = 1;
var month;
var year;
let query = `SELECT student_master.stu_id,student_master.firstname,student_master.lastname,
             YEAR(attendance_master.date_) AS year,
             MONTH(attendance_master.date_) AS month,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) as Total_present,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) * 100/30 as Percentage From student_master
             inner join attendance_master on student_master.stu_id=attendance_master.stu_id where year(attendance_master.date_)=? and 
             MONTH(attendance_master.date_)=? group by year,month,student_master.stu_id limit 50 offset ?;`;

async function attendanceDetails(req, res) {
    number = 1;
    counter = 0;

    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    } else {
      month = 12;
      year = 2023;
    }
    let result=await connection.executeQuery(query, [year,month,counter]);
    res.render("../src/views/attendance", { data: result, number: number,month:month,year:year });
  };

async function home (req, res) {
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }
    counter = 0;
    number = counter / 50 + 1;
    let result = await connection.executeQuery(query, [year, month, counter]);
    res.render("../src/views/attendance", { data: result, number: number ,month:month,year:year});
  };

async function previous (req, res) {
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }
    counter -= 50;
    number = counter / 50 + 1;
    let result = await connection.executeQuery(query, [year, month, counter]);
    res.render("../src/views/attendance", { data: result, number: number,month:month,year:year });
  };

async function next (req, res) {
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }
    counter += 50;
    number = counter / 50 + 1;
    let result = await connection.executeQuery(query, [year, month, counter]);
    res.render("../src/views/attendance", { data: result, number: number,month:month,year:year });
  };

async function end(req, res) {
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }

    counter = 150;
    number = counter / 50 + 1;
    let result = await connection.executeQuery(query, [year, month, counter]);
    res.render("../src/views/attendance", { data: result, number: number ,month:month,year:year});
  };

  module.exports = { attendanceDetails, home, previous, next, end };

