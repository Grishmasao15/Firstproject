var router = require("express").Router();
const connection = require("../models/connection");


async function createComponentTask(req, res) {
  let type;
  res.render("../src/views/component", {type: type});
};

async function createComponent (req, res) {
  let input = req.body.input1;
  let inputsplit = input.split(",");
  let name = inputsplit[0];
  let type = inputsplit[1];

  let query = ` select option_master.nameof_field from select_master join  option_master where option_master.select_id=select_master.select_id and select_master.keyof_field=?`;

  if (type == undefined || name == undefined) {
    res.send("Enter Valid Input!");
    res.end()
  }
  else{
  let result=await connection.executeQuery(query, [name])
  res.render("../src/views/component", {result: result,q: input,type: type,name: name});
  }
};

module.exports = {createComponentTask,createComponent};
