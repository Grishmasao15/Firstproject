var router = require("express").Router();

const connection = require("../models/connection");

var parser = require("body-parser");

router.use(parser.json());
router.use(parser.urlencoded({ extended: false }));

var q;
var sql;
var name, type;
var split;
var result;

router.get("/createcomponenttask", function (req, res) {
  res.render("../src/views/component", { result: result, q: q, type: type, name: name });
});



router.post("/createcomponent", function (req, res) {
  q = req.body.input1;
  split = q.split(",");
  name = split[0];
  type = split[1];
  console.log(name);
  console.log(type);
  console.log(q);

  sql = ` select option_master.nameof_field from select_master join  option_master where option_master.select_id=select_master.select_id and select_master.keyof_field='${name}'`;
  console.log(sql);

  //   sql = `select select_master.nameof_field as input,option_master.nameof_field,select_master.typeof_field from option_master,select_master where option_master.select_id=select_master.select_id and select_master.keyof_field='${q}';`;

  connection.con.query(sql, function (err, result) {
    if (err) throw err;
    if (type == undefined || name == undefined) {
      res.send("Enter Valid Input!");
    }
    console.log(result);
    res.render("../src/views/component", { result: result, q: q, type: type, name: name });
  });
});

module.exports=router;
