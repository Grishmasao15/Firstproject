var router = require("express").Router();
const { auth } = require("./middleware/auth");

let userid;
function fetchApi(req, res) {
  res.render("../src/views/index");
};

function fetchApiDetails(req, res) {
  let id = req.query.id;
  res.render("../src/views/fetchapialldetails", { id: id });
};

module.exports = { fetchApi, fetchApiDetails };

