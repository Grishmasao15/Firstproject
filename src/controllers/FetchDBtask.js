var router = require("express").Router();
const mysql = require("mysql");

const connection = require("../models/connection");
const { auth } = require("./middleware/auth");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

var temp=0;
var srt='stu_id';
counter=0;
   

router.get("/studentdetails",auth,function(req,res){
    counter = 0;
    if (req.query.id) {
      srt = req.query.id;
      console.log("sort by:" + srt);
    } 
    connection.con.query(`select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`,[counter],function(err,result){
        if (err) throw err;
    console.log("Request:"+req.query.id);     
    let number=(counter/200)+1;
    res.render('../src/views/FetchDBtable',{data:result,number:number,id:req.query.id}) ;   
    })
    console.log("counter:"+counter);
    temp++;
})

router.post("/home",auth,function (req, res) {
  counter = 0;
  connection.con.query(
    `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`,
    [counter],
    function (err, result) {
      if (err) throw err;
      let number = counter / 200 + 1;
      res.render("../src/views/FetchDBtable", { data: result, number: number });
    }
  );
});

router.post("/next",auth,function(req,res){
    counter +=200;
    connection.con.query(
      `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`,
      [counter],
      function (err, result) {
        if (err) throw err;
        let number = counter / 200 + 1;
        res.render("../src/views/FetchDBtable", { data: result, number: number });
      }
    );
})

router.post("/previous",auth,function(req,res){
    counter -= 200;
    connection.con.query(
      `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`,
      [counter],
      function (err, result) {
        if (err) throw err;
        let number = counter / 200 + 1;
        res.render("../src/views/FetchDBtable", { data: result, number: number });
      }
    );   

})

router.post("/end",auth,function(req,res){
    counter=49800;
    connection.con.query(
      `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`,
      [counter],
      function (err, result) {
        if (err) throw err;
        let number = counter / 200 + 1;
        res.render("../src/views/FetchDBtable", { data: result, number: number });
      }
    );
})

module.exports=router;




