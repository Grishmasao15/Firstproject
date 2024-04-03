const express = require("express");
const app = express();
app.set("view engine", "ejs");
var parser = require("body-parser");
const { parse } = require("path");
const { count } = require("console");
const { connect } = require("http2");
const fs = require("fs");
const jwt=require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const connection=require("./src/models/connection");
const router = require("./src/routes/router");
const main=require("./src/controllers/app")
const { auth } = require("./src/controllers/middleware/auth");


app.use(router);
app.use(cookieParser());
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));



app.get('/',main.main)

app.post("/storedetails",main.storeDetails);

app.get("/thanks/:code",main.thanksCode)

app.get("/thanks/:code/:username", main.thanksCodeUsername);

app.get('/code/:code',main.code);

app.post('/storepass',main.storePass);

app.get('/welcome/:username',auth,main.welcomeUsername)

app.get('/directlogin',main.directLogin)

app.get('/forgotpass',main.forgotPass)

app.get("/loginpage/:username/:pass",main.loginUsernamePass);

app.post('/thanks',main.thanks)

app.get("/check-email/:email",main.checkEmail);



app.listen(8000,()=>{
    console.log("server is up on 8000");   
});