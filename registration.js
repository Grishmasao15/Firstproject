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
const jwt=require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const connection=require("./src/models/connection");
const crudwithfile=require("./src/controllers/crudwithfile");
const fetchDBtask = require("./src/controllers/FetchDBtask");
const attendancedetailstask = require("./src/controllers/attendancedetailstask");
const resultsheettask = require("./src/controllers/resultsheettask");
const dynamicqueryboxtask = require("./src/controllers/dynamicqueryboxtask");
const searchboxtask = require("./src/controllers/searchboxtask");
const delemitersearchtask = require("./src/controllers/delemitersearchtask");
const createcomponenttask = require("./src/controllers/componentcreatetask");
const jobappforminsertion = require("./src/controllers/jobappforminsert");
const nextformtask = require("./src/controllers/nextform");
const timezone = require("./src/controllers/timezone");
const FetchfromAPI = require("./src/controllers/fetchfromapi");
const { auth } = require("./src/controllers/middleware/auth");


app.use(crudwithfile);
app.use(fetchDBtask);
app.use(attendancedetailstask);
app.use(resultsheettask);
app.use(dynamicqueryboxtask);
app.use(searchboxtask);
app.use(delemitersearchtask);
app.use(createcomponenttask);
app.use(jobappforminsertion);
app.use(nextformtask);
app.use(timezone);
app.use(FetchfromAPI);
app.use(cookieParser());
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));


const f = require("./src/controllers/practical1");
const p = require("./src/controllers/practical2");
const q= require("./src/controllers/practical3");
const g= require("./src/controllers/practical4");
const h= require("./src/controllers/practical5");
const r= require("./src/controllers/practical6");
const s= require("./src/controllers/practical7");
const t= require("./src/controllers/practical8");



var localdate= new Date();

app.get('/',(req,res)=>{
    res.render('../src/views/registration');
})

app.post("/storedetails",async (req, res) => {

  const{firstname,lastname,email,mono,activationcode}=req.body;

  var q1 = await connection.executeQuery(
    `INSERT INTO users SET firstname=?,lastname=?,email=?,mobilenumber=?,activation_code=?`,
    [firstname, lastname, email, mono, activationcode]
  );


});

app.get("/thanks/:code",async (req,res)=>{
  var acticode=req.params.code;


  res.render("../src/views/thanks", { acticode: acticode });
})

app.get("/thanks/:code/:username", async (req, res) => {
  var uname=req.params.username;
  var acticode = req.params.code;



  let date=new Date();
  let ins_date = date.toISOString().slice(0, 10) +" "+ date.toTimeString().slice(0, 8);


  var que15 = `UPDATE users SET activation_code ='${acticode}',created_at='${ins_date}' WHERE email ='${uname}';`;

  var q15 = await connection.executeQuery(que15);

  res.render("../src/views/thanks", { acticode: acticode });
});

app.get('/code/:code',async (req,res)=>{

  var actcode=req.params.code;

  var que12 = `SELECT COUNT(*) AS count FROM users WHERE activation_code ='${actcode}' `;

  var q1 = await connection.executeQuery(que12);


  if(q1[0].count>0){

    if (actcode) {

      var p1 = localdate.getTime();

      var result = await connection.executeQuery(
        `select created_at from users where activation_code='${actcode}'`
      );

      let temp = result[0].created_at.toString().slice(0, 24);

      let old = new Date(temp);
      var p2 = old.getTime();

      var timediff = Math.floor((p1 - p2) / 60000);


      if (timediff > 60) {
        var restwo = await connection.executeQuery(
          `delete from users where activation_code='${actcode}`
        );
        res.redirect("/");
      } else {
        res.render("../src/views/createpass", { actcode: actcode });
      }
    }
  }

})

app.post('/storepass',async (req,res)=>{

  var pass=req.body.passsalt;
  var salt=req.body.salt;
  var code=req.body.code;

  var encpass = md5(pass);

  var qe = `UPDATE users SET passwordof_user="${encpass}",salt="${salt}" where activation_code="${code}"`;
  var q2 = await connection.executeQuery(qe);
  res.render("../src/views/login");
});

app.get('/welcome/:username',auth,async (req,res)=>{

  var que20=await connection.executeQuery(`select firstname from users where email='${req.params.username}'`);
  var user=que20[0].firstname;

  res.render("../src/views/welcome",{user});
})


app.get('/directlogin',(req,res)=>{
  res.clearCookie("token");
  res.render("../src/views/login");
})

app.get('/forgotpass',(req,res)=>{
  res.render("../src/views/createpass");
})


app.get("/loginpage/:username/:pass",async (req,res)=>{

  const mail = req.params.username;



  const p3 = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
  var res1 = await connection.executeQuery(p3, [mail]);
  const mailExist=res1[0].count >=1;
  var passres = false;

  if(mailExist==true){
    const p4 = req.params.pass;
    const p5 = `select passwordof_user,salt from users where email=?;`;
    var query1 = await connection.executeQuery(p5, [mail]);
    var p7 = query1[0].salt;
    const latestpass= md5(p4+p7);
    const oldpass=query1[0].passwordof_user;
    

    if (latestpass == oldpass) {
      passres=true;
      var token=jwt.sign({data:latestpass},"secretkey",{expiresIn:'1d'});
      res.cookie("token",token);
 
    }
  }
  res.send({passres});


});

app.post('/thanks',(req,res)=>{
  res.render("../src/views/thanks");
})


app.get("/check-email/:email",async (request, response) => {
  const email = request.params.email;

  const sql = "SELECT COUNT(*) AS count FROM users WHERE email = ?";

  var results = await connection.executeQuery(sql, [email]);

    const count = results[0].count;

    const emailExists = count >= 1;

    response.send({ emailExists });

});

// app.get("/function/allfunctions", (req, res) => {
//   res.render("functions");
// });

app.get("/htmltask/:result",auth, (req, res) => {
  var result = req.params.result;

  res.render("../src/views/" + result);
});

app.get("/function/:functionname",auth,(req,res)=>{

  var functionname = req.params.functionname;
  

  if (functionname === "vowel") {
    // let str="grishma sao";

    ans = f.vowelsConsonants(req.query.str);
    res.send(`<p>Vowels are:`+ ans.vowelStr.toString() +`</p><p>Consonants are:`+ans.consonantStr.toString()+`</p>`+"Note: You can pass your input in url");
    
  } 
  
  else if (functionname === "oddeven") {
    // let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15];

    let intarr = req.query.arr.split(",");
    ans = p.oddEven(intarr);

    if(ans.str.length>0){
      res.send("Wrong Data Entered");
    }
    else{
      res.send(`<p>even numbers are:`+ ans.even.toString() + `</p><p>odd numbers are:` + ans.odd.toString()+`</p>`+`<p>Note: You can pass your input in url</p>`);
           
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
    res.send(
      `<p>The input is:</p> 
        <p>var cars = [
        { make: 'audi', model: 'r8', year: '2012' },
        { make: 'audi', model: 'rs5', year: '2013' },
        { make: 'ford', model: 'mustang' year: '2012' },
        { make: 'ford', model: 'fusion', year: '2015'},
        { make: 'kia', model: 'optima' year: '2012' }
        ];</p>
        <p>The result is:</p>`+
        JSON.stringify(ans)
    );
    
  }

  else if (functionname === "factorial") {

    ans = g.fact(req.query.num);
    res.send(`<p>The factorial of`+` `+req.query.num +` `+ `is:</p>`+ ans+`<p>Note: You can pass your input in url</p>`);
    
  }
  
  else if (functionname === "vowelcount") {
    // let arr = ["grishma", "sao"];
    let arrtwo = req.query.arr.split(" ");
    ans = h.vowelCount(arrtwo);
    res.send(ans + `<p>Note: You can pass your input in url</p>`);
    
  } 

  else if (functionname === "vowelcount2") {
    // let arr = ["grishma", "sao"];
    let arrtwo = req.query.arr.split(" ");
    ans = r.vowelCountMax(arrtwo);
    res.send(ans + `<p>Note: You can pass your input in url</p>`);
    
  }
  
  else if (functionname === "palindrome") {
    // let str = "grishma";
    ans = s.palindrome(req.query.str);
    res.send(ans + `<p>Note: You can pass your input in url</p>`);
    
  }
  
  else if (functionname === "calc") {
      let num1 = '';
      let num2 = '';
      let op = '';
      ans = t.calc(req.query.num1, req.query.num2, req.query.op);
      res.send(ans + `<p>Note: You can pass your input in url</p>`);
  
      

      
    }
  
  else {
    res.render("../src/views/functions");
  }

});



app.listen(8000,()=>{
    console.log("server is up on 8000");
    
});