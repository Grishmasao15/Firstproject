const connection = require("../models/connection");
var md5 = require("md5");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

var localdate = new Date();

function main(req, res) {
  res.render("../src/views/registration");
}

async function storeDetails(req, res) {
  const { firstname, lastname, email, mono, activationcode } = req.body;

  let counter = await connection.executeQuery(
    `INSERT INTO users SET firstname=?,lastname=?,email=?,mobilenumber=?,activation_code=?`,
    [firstname, lastname, email, mono, activationcode]
  );
}

async function thanksCode(req, res){
  let acticode = req.params.code;

  res.render("../src/views/thanks", { acticode: acticode });
};

async function thanksCodeUsername (req, res) {
  let uname = req.params.username;
  let activationcode = req.params.code;

  let date = new Date();
  let ins_date =
    date.toISOString().slice(0, 10) + " " + date.toTimeString().slice(0, 8);

  let query = `UPDATE users SET activation_code =?,created_at=? WHERE email =?;`;

  let result = await connection.executeQuery(query, [activationcode, ins_date,uname]);

  res.render("../src/views/thanks", { acticode: activationcode });
};

async function code (req, res) {
  let actcode = req.params.code;

  let query = `SELECT COUNT(*) AS count FROM users WHERE activation_code =? `;

  let counter = await connection.executeQuery(query, [actcode]);

  if (counter[0].count > 0) {
    if (actcode) {
      let current_time = localdate.getTime();

      let result = await connection.executeQuery(`select created_at from users where activation_code=?`,actcode);

      let temp = result[0].created_at.toString().slice(0, 24);

      let old = new Date(temp);
      let db_time = old.getTime();

      let timediff = Math.floor((current_time - db_time) / 60000);

      if (timediff > 60) {
        let result = await connection.executeQuery(`delete from users where activation_code=?`,actcode);
        res.redirect("/");
      } else {
        res.render("../src/views/createpass", { actcode: actcode });
      }
    }
  }
};

async function storePass (req, res) {
  let pass = req.body.passsalt;
  let salt = req.body.salt;
  let code = req.body.code;

  let encpass = md5(pass);

  let query = `UPDATE users SET passwordof_user=?,salt=? where activation_code=?`;
  let result = await connection.executeQuery(query, [encpass, salt, code]);
  res.render("../src/views/login");
};

async function welcomeUsername(req, res){
  // let query = await connection.executeQuery(`select firstname from users where email=?`,req.params.username);
  // let user = query[0].firstname;

  res.render("../src/views/welcome");
};

async function directLogin(req, res){
  if(!req.cookies.token){
    res.render("../src/views/login");
  }
  else{
    res.redirect("/welcome")
  }
};

async function logOut(req,res){
  res.clearCookie("token");
  res.render("../src/views/login");
}

async function forgotPass(req, res){
  res.render("../src/views/createpass");
};

async function loginUsernamePass (req, res){
  const mail = req.params.username;

  const query = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
  let res1 = await connection.executeQuery(query, [mail]);
  const mailExist = res1[0].count >= 1;
  let passres = false;

  if (mailExist == true) {

    const password = req.params.pass;
    const p5 = `select passwordof_user,salt from users where email=?;`;

    let query = await connection.executeQuery(p5, [mail]);
    let salt = query[0].salt;
    const latestpass = md5(password + salt);
    const oldpass = query[0].passwordof_user;

    if (latestpass == oldpass) {
      passres = true;
      let token = jwt.sign({ data: latestpass }, "secretkey", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
    }
  }
  res.send({ passres });
};

async function thanks(req, res){
  res.render("../src/views/thanks");
};

async function checkEmail (req, res){
  const email = req.params.email;

  const sql = "SELECT COUNT(*) AS count FROM users WHERE email = ?";

  let result = await connection.executeQuery(sql, [email]);

  const count = result[0].count;

  const emailExists = count >= 1;

  res.send({ emailExists });
};

module.exports = { main, storeDetails, thanksCode, thanksCodeUsername, code , storePass , welcomeUsername , directLogin, logOut, forgotPass,loginUsernamePass,thanks,checkEmail};
