var router = require("express").Router();
const mysql = require("mysql");

const connection = require("../models/connection");
const cookieParser = require("cookie-parser");
const { query } = require("express");
router.use(cookieParser());


var srt='stu_id';
var counter=0;
const recordsperpage=200;

   

async function studentDetails(req,res){
  counter = 0;
  let pagenumber = counter / recordsperpage + 1;
  try{
    if (req.query.id) {
      srt = req.query.id;
    }
    let query= `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`
    let result=await connection.executeQuery(query,[counter]);
    
    res.render('../src/views/FetchDBtable',{data:result,number:pagenumber,id:req.query.id}) ;   
  }
  catch(err){
    console.log(err);
  }
};

async function home(req, res) {
  counter = 0;
  let pagenumber = counter / recordsperpage + 1;
  try{
    let query=`select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`;
    let result = await connection.executeQuery(query, [counter]);
    
    res.render("../src/views/FetchDBtable", { data: result, number: pagenumber });
  }
  catch(err){
    console.log(err);
  }
};

async function next(req,res){
    counter += recordsperpage;
    let pagenumber = counter / recordsperpage + 1;
    try{
      let query = `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`; 
      let result = await connection.executeQuery(query, [counter]);
      res.render("../src/views/FetchDBtable", { data: result, number: pagenumber });
    }
    catch(err){
      console.log(err);
    }
};

async function previous(req,res){
    counter -= recordsperpage;
    let pagenumber = counter / recordsperpage + 1;
    try{
      let query = `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`; 
      let result = await connection.executeQuery(query,[counter]);   
      res.render("../src/views/FetchDBtable", { data: result, number: pagenumber });
    }
    catch(err){
      console.log(err);
    }
};

async function end(req,res){
  try{
    let query2 = `select count(*) as count from student_master`;
    let result2 = await connection.executeQuery(query2);
    counter = result2[0].count-recordsperpage;

    let pagenumber = counter / recordsperpage + 1;
    let query = `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`; 
    let result =await connection.executeQuery(query,[counter]);
    res.render("../src/views/FetchDBtable", { data: result, number: pagenumber });
  }
  catch(err){
    console.log(err);
  }
};

module.exports = { studentDetails, home, next, previous, end };




