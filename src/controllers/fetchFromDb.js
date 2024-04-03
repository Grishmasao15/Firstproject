var router = require("express").Router();
const mysql = require("mysql");

const connection = require("../models/connection");
const cookieParser = require("cookie-parser");
const { query } = require("express");
router.use(cookieParser());

var temp=0;
var srt='stu_id';
var counter=0;
var number;

   

async function studentDetails(req,res){
  counter = 0;
  number = counter / 200 + 1;
  if (req.query.id) {
    srt = req.query.id;
  }
  let query= `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`
  let result=await connection.executeQuery(query,[counter]);
  temp++;
  
  res.render('../src/views/FetchDBtable',{data:result,number:number,id:req.query.id}) ;   
};

async function home(req, res) {
  counter = 0;
  number = counter / 200 + 1;
  let query=`select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`;
  let result = await connection.executeQuery(query, [counter]);
  
  res.render("../src/views/FetchDBtable", { data: result, number: number });
};

async function next(req,res){
    counter +=200;
    number = counter / 200 + 1;
    let query = `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`; 
    let result = await connection.executeQuery(query, [counter]);
    res.render("../src/views/FetchDBtable", { data: result, number: number });
};

async function previous(req,res){
    counter -= 200;
    number = counter / 200 + 1;
    let query = `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`; 
    let result = await connection.executeQuery(query,[counter]);   
    res.render("../src/views/FetchDBtable", { data: result, number: number });
};

async function end(req,res){
    counter=49800;
    number = counter / 200 + 1;
    let query = `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`; 
    let result =await connection.executeQuery(query,[counter]);
      res.render("../src/views/FetchDBtable", { data: result, number: number });
};

module.exports = { studentDetails, home, next, previous, end };




