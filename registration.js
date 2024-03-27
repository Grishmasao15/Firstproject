const express = require("express");
const app = express();
app.set("view engine", "ejs");
var parser = require("body-parser");
const mysql = require("mysql");
const { parse } = require("path");
const { count } = require("console");
const { connect } = require("http2");
var md5 = require("md5");

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
  database: "Registration_DB"
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

  // if(!functionname){
  //   res.render("functions");
  // }

  if (functionname === "vowel") {
    // let str="grishma sao";
    console.log(req.query.str);
    ans = f.vowelsConsonants(req.query.str);
    res.send("Vowels are:" +  " " +  ans.vowelStr.toString() +  " And " +  "Consonants are:" +  " " +  ans.consonantStr.toString());
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
      res.send("even numbers are:" + " " + ans.even.toString() +"  AND  "+"odd numbers are:" + " " + ans.odd.toString());      
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
    res.send("The result is:" + JSON.stringify(ans));
    res.end();
  }

  else if (functionname === "factorial") {

    ans = g.fact(req.query.num);
    res.send("The factorial of" +" "+req.query.num +" "+ "is:" + " " + ans);
    res.end();
  }
  
  else if (functionname === "vowelcount") {
    // let arr = ["grishma", "sao"];
    let arrtwo = req.query.arr.split(" ");
    ans = h.vowelCount(arrtwo);
    res.send(ans);
    res.end();
  } 
  
  
  else {
    res.render("functions");
  }

});





app.listen(8082,()=>{
    console.log("server is up on 8082");
})