import express, { Express, Request, Response } from "express";
const app: Express = express();
app.set("view engine", "ejs");
var parser = require("body-parser");
import { parse } from "path";
import { count } from "console";
import { connect } from "http2";
import cookieParser from "cookie-parser";

import router from "./src/routes/router";
import main from "./src/controllers/main";
import auth from "./src/controllers/middleware/auth";

app.use(router);
app.use(cookieParser());
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

app.get("/", main.main);

app.post("/storedetails", main.storeDetails);

app.get("/thanks/:code", main.thanksCode);

app.get("/thanks/:code/:username", main.thanksCodeUsername);

app.get("/code/:code", main.code);

app.post("/storepass", main.storePass);

app.get("/welcome", auth, main.welcomeUsername);

app.get("/directlogin", main.directLogin);

app.get("/login", auth, main.logOut);

app.get("/forgotpass", main.forgotPass);

app.get("/loginpage/:username/:pass", main.loginUsernamePass);

app.post("/thanks", main.thanks);

app.get("/check-email/:email", main.checkEmail);

app.listen(8085, () => {
  console.log("server is up on 8085");
});
