var router = require("express").Router();
const mysql = require("mysql");

const connection = require("../models/connection");

var temp=0;
var srt='stu_id';
counter=0;
   

router.get("/studentdetails",function(req,res){
    counter = 0;
    if(temp!=0){
        srt=req.query.id;
        console.log("sort by:"+srt);
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

router.post("/home", function (req, res) {
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

router.post("/next",function(req,res){
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

router.post("/previous",function(req,res){
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

router.post("/end",function(req,res){
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




