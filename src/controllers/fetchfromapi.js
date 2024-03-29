var router = require("express").Router();
const { auth } = require("./middleware/auth");

let userid;
router.get("/fetchapi",auth, function (req, res) {
  res.render("../src/views/index");
});

router.get("/apialldetails",auth, function (req, res) {
  id = req.query.id;
  res.render("../src/views/fetchapialldetails", { id: id });
});

module.exports=router;

