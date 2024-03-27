const express = require("express");
const app = express();
app.set("view engine", "ejs");
var parser = require("body-parser");
const mysql = require("mysql");
const { parse } = require("path");
const { count } = require("console");
const { connect } = require("http2");
var md5 = require("md5");
const fs = require("fs");

const f = require("./practical1");
const p = require("./practical2");
const q= require("./practical3");
const g= require("./practical4");
const h= require("./practical5");
const r= require("./practical6");
const s= require("./practical7");
const t= require("./practical8");


app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Registration_DB",
  dateStrings:"date"
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected Database");
});

function executeQuery(str, arr) {
  return new Promise((resolve, reject) => {
    con.query(str, arr, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

var localdate= new Date();
var temp = 0;
var srt = "stu_id";
var counter = 0;
var number = 1;
var pagenumber = 1;
var rescounter = 0;
var qr = "";
var lmt = 10;


app.get('/',(req,res)=>{
    res.render('registration');
})

app.post("/storedetails",async (req, res) => {

  const{firstname,lastname,email,mono,activationcode}=req.body;

  var q1 = await executeQuery(
    `INSERT INTO users SET firstname=?,lastname=?,email=?,mobilenumber=?,activation_code=?`,
    [firstname, lastname, email, mono, activationcode]
  );
  console.log("data inserted successfully in the database");

});

app.get("/thanks/:code",async (req,res)=>{
  var acticode=req.params.code;
  console.log(acticode);

  res.render("thanks", { acticode: acticode });
})

app.get("/thanks/:code/:username", async (req, res) => {
  var uname=req.params.username;
  var acticode = req.params.code;
  console.log(acticode);
  console.log(uname);

  let date=new Date();
  let ins_date = date.toISOString().slice(0, 10) +" "+ date.toTimeString().slice(0, 8);


  var que15 = `UPDATE users SET activation_code ='${acticode}',created_at='${ins_date}' WHERE email ='${uname}';`;
  console.log(que15);
  var q15=await executeQuery(que15);

  res.render("thanks", { acticode: acticode });
});

app.get('/code/:code',async (req,res)=>{

  var actcode=req.params.code;
  console.log("actc"+actcode);
  var que12 = `SELECT COUNT(*) AS count FROM users WHERE activation_code ='${actcode}' `;
  console.log(que12);
  var q1=await executeQuery(que12);
  console.log("Count"+q1[0].count);

  if(q1[0].count>0){
    console.log(actcode);
    if (actcode) {
      var p1 = localdate.getTime();
      console.log(p1);
      var result = await executeQuery(
        `select created_at from users where activation_code='${actcode}'`
      );
      let temp = result[0].created_at.toString().slice(4, 24);
      let old = new Date(temp);
      var p2 = old.getTime();
      console.log(p2);
      var timediff = Math.floor((p1 - p2) / 60000);
      console.log("time diffrence"+timediff);

      if (timediff > 60) {
        var restwo = await executeQuery(
          `delete from users where activation_code='${actcode}`
        );
        console.log("in delete");
        res.redirect("/");
      } else {
        res.render("createpass", { actcode: actcode });
        console.log("in else");
      }
    }
  }

})

app.post('/storepass',async (req,res)=>{

  var pass=req.body.passsalt;
  var salt=req.body.salt;
  var code=req.body.code;
  console.log(code);
  var encpass = md5(pass);

  var qe = `UPDATE users SET passwordof_user="${encpass}",salt="${salt}" where activation_code="${code}"`;
  var q2=await executeQuery(qe);
  console.log("password and salt inserted successfully");
  res.render("login");
});

app.get('/welcome',(req,res)=>{
  res.render("welcome");
})

app.get('/directlogin',(req,res)=>{
  res.render("login");
})

app.get('/forgotpass',(req,res)=>{
  res.render("createpass");
})


app.get("/loginpage/:username/:pass",async (req,res)=>{

  const mail = req.params.username;
  console.log("in login page"+" "+mail);
  console.log("in login page" + " " + req.params.pass);


  const p3 = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
  var res1=await executeQuery(p3,[mail]);
  const mailExist=res1[0].count >=1;
  console.log("mailexist"+mailExist);
  var passres = false;

  if(mailExist==true){
    const p4 = req.params.pass;
    const p5 = `select passwordof_user,salt from users where email=?;`;
    var query1=await executeQuery(p5,[mail]);
    var p7 = query1[0].salt;
    const latestpass= md5(p4+p7);
    console.log(latestpass);
    const oldpass=query1[0].passwordof_user
    console.log(oldpass);
    

    if (latestpass == oldpass) {
      passres=true;
    }
  }
  console.log(passres)
  res.send({passres});


});

app.post('/thanks',(req,res)=>{
  res.render('thanks');
})


app.get("/check-email/:email",async (request, response) => {
  const email = request.params.email;

  const sql = "SELECT COUNT(*) AS count FROM users WHERE email = ?";

  var results=await executeQuery(sql,[email]);
  console.log(results);

    const count = results[0].count;
    console.log(count);

    const emailExists = count >= 1;
    console.log(emailExists);

    response.send({ emailExists });

});

// app.get("/function/allfunctions", (req, res) => {
//   res.render("functions");
// });

app.get("/:result",(req,res)=>{

  var result=req.params.result;
  console.log(result);

  res.render(result);

});

app.get("/function/:functionname",(req,res)=>{

  var functionname = req.params.functionname;
  console.log(functionname);
  

  if (functionname === "vowel") {
    // let str="grishma sao";
    console.log(req.query.str);
    ans = f.vowelsConsonants(req.query.str);
    res.write("Vowels are:" +  " " +  ans.vowelStr.toString() +  "\n" +  "Consonants are:" +  " " +  ans.consonantStr.toString()+"\n"+"\n"+"Note: You can pass your input in url");
    res.end();
  } 
  
  else if (functionname === "oddeven") {
    // let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15];
    console.log(req.query.arr);
    let intarr = req.query.arr.split(",");
    ans = p.oddEven(intarr);

    if(ans.str.length>0){
      res.send("Wrong Data Entered")
    }
    else{
      res.write("even numbers are:" + " " + ans.even.toString() + "\n" +"odd numbers are:" + " " + ans.odd.toString()+"\n"+"\n"+"Note: You can pass your input in url"); 
      res.end();     
    }

  }
  
  else if (functionname === "groupby") {
    var cars = [
      { make: "audi", model: "r8", year: "2012" },
      { make: "audi", model: "rs5", year: "2013" },
      { make: "ford", model: "mustang", year: "2012" },
      { make: "ford", model: "fusion", year: "2015" },
      { make: "kia", model: "optima", year: "2012" },
    ];

    ans = q.group(cars);
    res.write("The result is:" + "\n" + JSON.stringify(ans));
    res.end();
  }

  else if (functionname === "factorial") {

    ans = g.fact(req.query.num);
    res.write("The factorial of" +" "+req.query.num +" "+ "is:" + " " + ans);
    res.end();
  }
  
  else if (functionname === "vowelcount") {
    // let arr = ["grishma", "sao"];
    let arrtwo = req.query.arr.split(" ");
    ans = h.vowelCount(arrtwo);
    res.write(ans);
    res.end();
  } 

  else if (functionname === "vowelcount2") {
    // let arr = ["grishma", "sao"];
    let arrtwo = req.query.arr.split(" ");
    ans = r.vowelCountMax(arrtwo);
    res.write(ans);
    res.end();
  }
  
  else if (functionname === "palindrome") {
    // let str = "grishma";
    ans = s.palindrome(req.query.str);
    res.write(ans);
    res.end();
  }
  
  else if (functionname === "calc") {
      let num1 = '';
      let num2 = '';
      let op = '';
      ans = t.calc(req.query.num1, req.query.num2, req.query.op);
      res.write(ans);
      res.end();

      
    }
  
  else {
    res.render("functions");
  }

});


app.get('/form',(req,res) => {
    res.render('form');

});

app.post('/showall',(req,res) => {

    let obj=JSON.parse(fs.readFileSync('alldata.json'))
    res.render("table", { obj: obj });
});

app.post("/submit", (req, res) => {
  let obj = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    gender: req.body.gender,
    address: req.body.address,
    mono: req.body.mono,
    email: req.body.email,
    hobbies: req.body.hobbies,
  };

  if (!fs.existsSync("alldata.json")) {
    var create = fs.createWriteStream("alldata.json");
    let content = "[" + JSON.stringify(obj) + "]";
    create.write(content);
  } 
  else {
    let fileContents = fs.readFileSync("alldata.json").toString();
    fileContents = fileContents.slice(0, fileContents.length - 1);
    fileContents += "," + JSON.stringify(obj) + "]";
    fs.writeFile("alldata.json", fileContents, function (err) {
      if (err) throw err;
    });
  }

  res.render("tabletwo", {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    gender: req.body.gender,
    address: req.body.address,
    mono: req.body.mono,
    email: req.body.email,
    hobbies: req.body.hobbies,
  });
  
});

app.post("/alldetails", (req, res) => {
  let obj = JSON.parse(fs.readFileSync("alldata.json"));
  res.render("alldetails", { mail: req.body.mail, obj: obj });
});


app.get("/fetchdbtask/studentdetails",function(req,res){
    counter = 0;
    if(temp!=0){
        srt=req.query.id;
        console.log("sort by:"+srt);
    } 
    con.query(`select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`,[counter],function(err,result){
        if (err) throw err;
    console.log("Request:"+req.query.id);     
    let number=(counter/200)+1;
    res.render('FetchDBtable',{data:result,number:number,id:req.query.id}) ;   
    })
    console.log("counter:"+counter);
    temp++;
})

app.post("/home", function (req, res) {
  counter = 0;
  con.query(
    `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`,
    [counter],
    function (err, result) {
      if (err) throw err;
      let number = counter / 200 + 1;
      res.render("FetchDBtable", { data: result, number: number });
    }
  );
});

app.post("/next",function(req,res){
    counter +=200;
    con.query(
      `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`,
      [counter],
      function (err, result) {
        if (err) throw err;
        let number = counter / 200 + 1;
        res.render("FetchDBtable", { data: result, number: number });
      }
    );
})

app.post("/previous",function(req,res){
    counter -= 200;
    con.query(
      `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`,
      [counter],
      function (err, result) {
        if (err) throw err;
        let number = counter / 200 + 1;
        res.render("FetchDBtable", { data: result, number: number });
      }
    );   

})

app.post("/end",function(req,res){
    counter=49800;
    con.query(
      `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`,
      [counter],
      function (err, result) {
        if (err) throw err;
        let number = counter / 200 + 1;
        res.render("FetchDBtable", { data: result, number: number });
      }
    );
})



app.get("/attendancedetailstask/attendancedetails", function (req, res) {

    number=1;
    counter=0;

    if (req.query.month || req.query.year) {
      month = req.query.month;
      year = req.query.year;
    } 
    else{
      month=12;
      year=2023;
    }
    let q = `SELECT student_master.stu_id,student_master.firstname,student_master.lastname,
             YEAR(attendance_master.date_) AS year,
             MONTH(attendance_master.date_) AS month,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) as Total_present,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) * 100/30 as Percentage From student_master
             inner join attendance_master on student_master.stu_id=attendance_master.stu_id where year(attendance_master.date_)=${year} and 
             MONTH(attendance_master.date_)=${month} group by year,month,student_master.stu_id limit 50 offset ?;`;
    con.query(q,[counter],function (err, result) {
      if (err) throw err;
      res.render("attendance", { data: result,number:number });
    });
  });


app.post("/attendancesheethome", function (req, res) {

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
  con.query(p,[counter],function (err, result) {
    if (err) throw err;
    number = counter / 50 + 1;
    res.render("attendance", { data: result,number:number });
  });
});



app.post("/attendancesheetprevious", function (req, res) {

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
  con.query(p, [counter], function (err, result) {
    if (err) throw err;
    number = counter / 50 + 1;
    res.render("attendance", { data: result, number: number });
  });
});






app.post("/attendancesheetnext", function (req, res) {

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
  con.query(p,[counter], function (err, result) {
    if (err) throw err;
    number = counter / 50 + 1;
    res.render("attendance", { data: result, number: number });
  });
});





app.post("/attendancesheetend", function (req, res) {

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
      con.query(p,[counter],function (err, result) {
        if (err) throw err;
        number = counter / 50 + 1;
        res.render("attendance", { data: result,number:number});
      });
    });



    
    app.get("/resultdetailstask/resultdetails/", function (req, res) {

    var sort=req.query.sort;
    
    if(req.query.sort==undefined){
      sort='stu_id';
    }
    else{
      sort=req.query.sort;
    }

    let sql = `select student_master.stu_id,student_master.firstname,student_master.lastname, 
                sum(distinct if(result_master.exam_id='1',result_master.practical_obtained,null) ) as terminal_practical,
                sum(distinct if(result_master.exam_id='1',result_master.theory_obtained,null) ) as theory_practical, 
                sum(distinct if(result_master.exam_id='2',result_master.practical_obtained,null) ) as prelim_practical, 
                sum(distinct if(result_master.exam_id='2',result_master.theory_obtained,null) ) as prelim_theory, 
                sum(distinct if(result_master.exam_id='3',result_master.practical_obtained,null) ) as final_practical, 
                sum(distinct if(result_master.exam_id='3',result_master.theory_obtained,null) ) as final_theory 
                from student_master
                INNER JOIN result_master 
                ON student_master.stu_id=result_master.stu_id
                group by student_master.stu_id
                order by ${sort}
                limit 50 offset ? `;

    if (req.query.id == undefined) {
      rescounter = 0;

      con.query(sql, [rescounter], function (err, result) {
        if (err) throw err;
        pagenumber = 1;
        res.render("result2", { data: result, pagenumber: pagenumber,rescounter:rescounter});
      });
    } 
    
    else if (req.query.id == "next") {
      rescounter = parseInt(req.query.rescounter) + 50;
      pagenumber = parseInt(req.query.pagenumber) + 1;
      con.query(sql, [rescounter], function (err, result) {
        if (err) throw err;
        pagenumber = rescounter / 50 + 1;
        res.render("result2", {
          data: result,
          pagenumber: pagenumber,
          rescounter: rescounter,
        });
      });
    } 
    
    else if (req.query.id == "prev") {
      rescounter = parseInt(req.query.rescounter) - 50;
      pagenumber = parseInt(req.query.pagenumber) - 1;
      con.query(sql, [rescounter], function (err, result) {
        if (err) throw err;
        pagenumber = rescounter / 50 + 1;
        res.render("result2", {
          data: result,
          pagenumber: pagenumber,
          rescounter: rescounter,
        });
      });
    } 
    
    else if (req.query.id == "end") {
      rescounter = 150;
      pagenumber = 4;
      con.query(sql, [rescounter], function (err, result) {
        if (err) throw err;
        res.render("result2", {
          data: result,
          pagenumber: pagenumber,
          rescounter: rescounter,
        });
      });
    } else if (req.query.id == "home") {
      rescounter = 0;
      pagenumber = 1;
      con.query(sql, [rescounter], function (err, result) {
        if (err) throw err;
        res.render("result2", {
          data: result,
          pagenumber: pagenumber,
          rescounter: rescounter,
        });
      });
    }
  });

  app.get("/resultview/viewdetails", function (req, res) {
    sid = req.query.id;
    var q = `select student_master.stu_id,student_master.firstname,student_master.lastname,subject_master.subject_id,subject_master.subject_name,
             max(case when result_master.exam_id='1' then result_master.practical_obtained end)as terminal_practical,
             max(case when result_master.exam_id='2' then result_master.practical_obtained end)as prelims_practical,
             max(case when result_master.exam_id='3' then result_master.practical_obtained end)as final_practical,
             max(case when result_master.exam_id='1' then result_master.theory_obtained end)as terminal_theory,
             max(case when result_master.exam_id='2' then result_master.theory_obtained end)as prelims_theory,
             max(case when result_master.exam_id='3' then result_master.theory_obtained end)as final_theory 
             from student_master
             join result_master on student_master.stu_id=result_master.stu_id
             join subject_master on result_master.subject_id=subject_master.subject_id
             where student_master.stu_id=${sid}
             group by student_master.stu_id,student_master.firstname,student_master.lastname,subject_master.subject_id,subject_master.subject_name;`;

    con.query(q, function (err, result) {
      if (err) throw err;
      res.render("viewdetail2", { data: result });
    });
  });

//Querybox  
app.get('/querydeatils/queryhome',(req,res)=>{
    res.render('inputbox');
});

app.post('/querdetailstask/querydetails',(req,res)=>{

  counter=0;
  lmt=10;
  pagenumber=1;
  qr=req.body.qr;

    con.query(qr,function(err,result,fields){ 
          
        if (err) {
            res.send("You Entered Wrong Query please check your query");
        }else{
          res.render("querytable", { result: result, fields: fields, qr:qr,counter:counter,lmt:lmt,pagenumber:pagenumber});
        }
    });
})


app.get('/querdetailstask/pagination',function(req,res){

  if (req.query.id == "home") {
   pagenumber=1;
   counter=0;
   lmt=10;
   con.query(qr,function(err,result,fields){
        if (err) {
          res.send("You Entered Wrong Query please check your query");
        } else {
          res.render("querytable", {
            result: result,
            fields: fields,
            qr: qr,
            counter: counter,
            lmt: lmt,
            pagenumber:pagenumber,
          });
        }
   })
  } 


  else if (req.query.id == "end") {

    con.query(qr, function (err, result, fields) {
      counter=result.length-10;
      lmt=counter+10;
      pagenumber = Math.ceil(counter / 10) + 1;
      if(result.length%10 != 0) {
        counter=result.length-(result.length%10)
      } 
      if (err) {
        res.send("You Entered Wrong Query please check your query");
      } else {
        res.render("querytable", {
          result: result,
          fields: fields,
          qr: qr,
          counter: counter,
          lmt: lmt,
          pagenumber: pagenumber,
        });
      }
    });
  }
  
  
  else if (req.query.id == "next") {
      
      counter = parseInt(req.query.ct)+10;
      lmt = counter+10;
      pagenumber = counter / 10 + 1;
      con.query(qr, function (err, result, fields) {
        if (err) {
          res.send("You Entered Wrong Query please check your query");
        } else {
          res.render("querytable", {
            result: result,
            fields: fields,
            qr: qr,
            counter: counter,
            lmt: lmt,
            pagenumber: pagenumber,
          });
        }
      });
    
  }
  
  
  else if (req.query.id == "previous") {
     
      counter = parseInt(req.query.ct) - 10;
      lmt = counter + 10;
      pagenumber = counter / 10 + 1;
      con.query(qr, function (err, result, fields) {
        if (err) {
          res.send("You Entered Wrong Query please check your query");
        } else {
          res.render("querytable", {
            result: result,
            fields: fields,
            qr: qr,
            counter: counter,
            lmt: lmt,
            pagenumber: pagenumber,
          });
        }
      });
    
  }

})  
    





app.listen(3035,()=>{
    console.log("server is up on 3030");
    
})