var router = require("express").Router();

const connection = require("../models/connection");
const cookieParser = require("cookie-parser");
router.use(cookieParser());


var counter = 0;
var number = 1;
var month;
var year;
const recordsperpage=50;
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
  try{
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    } else {
      month = 12;
      year = 2023;
    }
    let result=await connection.executeQuery(query, [year,month,counter]);
    res.render("../src/views/attendance", { data: result, number: number,month:month,year:year });
  }
  catch(err){
    console.log(err);
  }
};

async function home (req, res) {
  try{
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }
    counter = 0;
    number = counter / recordsperpage + 1;
    let result = await connection.executeQuery(query, [year, month, counter]);
    res.render("../src/views/attendance", { data: result, number: number ,month:month,year:year});
  }
  catch(err){
    console.log(err);
  }
};

async function previous (req, res) {
  try{
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }
    if(number>1){

      counter -= recordsperpage;
      number = counter / recordsperpage + 1;
      let result = await connection.executeQuery(query, [year, month, counter]);
      res.render("../src/views/attendance", { data: result, number: number,month:month,year:year });
    }
    else{
      counter = 0;
      number = counter / recordsperpage + 1;
      let result = await connection.executeQuery(query, [year, month, counter]);
      res.render("../src/views/attendance", { data: result, number: number ,month:month,year:year});
    }
  }
  catch(err){
    console.log(err);
  }
};

async function next (req, res) {
  try{
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }

    let query2 = `select max(stu_id) as max from attendance_master`;
    let result2 = await connection.executeQuery(query2);
    let count = result2[0].max - recordsperpage;
    let pagenumber = count / recordsperpage + 1;
    
    if (number<pagenumber) {

      counter += recordsperpage;
      number = counter / recordsperpage + 1;
      let result = await connection.executeQuery(query, [year, month, counter]);
      res.render("../src/views/attendance", { data: result, number: number,month:month,year:year });

    }
    else{
      counter = count;
      number = counter / recordsperpage + 1;
      let result = await connection.executeQuery(query, [year, month, counter]);
      res.render("../src/views/attendance", { data: result, number: number ,month:month,year:year});
    }
  }
  catch(err){
    console.log(err);
  }
    
};

async function end(req, res) {
  try{
    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    }

    let query2 = `select max(stu_id) as max from attendance_master`;
    let result2 = await connection.executeQuery(query2);

    counter = result2[0].max - recordsperpage;
    number = counter / recordsperpage + 1;
    let result = await connection.executeQuery(query, [year, month, counter]);
    res.render("../src/views/attendance", { data: result, number: number ,month:month,year:year});
  }
  catch(err){
    console.log(err);
  }
};

  module.exports = { attendanceDetails, home, previous, next, end };

