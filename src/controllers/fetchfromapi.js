var router = require("express").Router();

let userid;
router.get("/fetchapi", function (req, res) {
  res.render("../src/views/index");
});

router.get("/apialldetails", function (req, res) {
  id = req.query.id;
  res.render("../src/views/fetchapialldetails", { id: id });
});

module.exports=router;

