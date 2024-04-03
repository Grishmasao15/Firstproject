var router = require("express").Router();

const connection = require("../models/connection");
const { auth } = require("./middleware/auth");

var query = "";
var counter = 0;
var lmt = 10;
var pagenumber = 1;

async function queryHome (req, res) {
  res.render("../src/views/inputbox");
};

async function QueryDetails(req, res){
  counter = 0;
  lmt = 10;
  pagenumber = 1;
  query = req.body.qr;

  connection.con.query(query, function (err, result, fields) {
    if (err) {
      res.send("You Entered Wrong Query please check your query");
    } else {
      res.render("../src/views/querytable", {result: result,fields: fields,q: query,counter: counter,lmt: lmt,pagenumber: pagenumber});
    }
  });
};

async function pagination (req, res) {
  if (req.query.id == "home") {
    pagenumber = 1;
    counter = 0;
    lmt = 10;
    connection.con.query(query, function (err, result, fields) {
      if (err) {
        res.send("You Entered Wrong Query please check your query");
      } else {
        res.render("../src/views/querytable", {result: result,fields: fields,q: query,counter: counter,lmt: lmt,pagenumber: pagenumber});
      }
    });

  } else if (req.query.id == "end") {
    connection.con.query(query, function (err, result, fields) {
      counter = result.length - 10;
      lmt = counter + 10;
      pagenumber = Math.ceil(counter / 10) + 1;
      if (result.length % 10 != 0) {
        counter = result.length - (result.length % 10);
      }
      if (err) {
        res.send("You Entered Wrong Query please check your query");
      } else {
        res.render("../src/views/querytable", {result: result,fields: fields,q: query,counter: counter,lmt: lmt,pagenumber: pagenumber});
      }
    });

  } else if (req.query.id == "next") {
    counter = parseInt(req.query.ct) + 10;
    lmt = counter + 10;
    pagenumber = counter / 10 + 1;
    connection.con.query(query, function (err, result, fields) {
      if (err) {
        res.send("You Entered Wrong Query please check your query");
      } else {
        res.render("../src/views/querytable", {  result: result,  fields: fields,  q: query,  counter: counter,  lmt: lmt,  pagenumber: pagenumber,});
      }
    });

  } else if (req.query.id == "previous") {
    counter = parseInt(req.query.ct) - 10;
    lmt = counter + 10;
    pagenumber = counter / 10 + 1;
    connection.con.query(query, function (err, result, fields) {
      if (err) {
        res.send("You Entered Wrong Query please check your query");
      } else {
        res.render("../src/views/querytable", {result: result,fields: fields,q: query,counter: counter,lmt: lmt,pagenumber: pagenumber});
      }
    });
  }
};

module.exports = { queryHome, QueryDetails, pagination };
