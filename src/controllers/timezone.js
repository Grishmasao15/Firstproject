var router = require("express").Router();
const { auth } = require("./middleware/auth");

router.get("/timezone",auth, (req, res) => {
  res.render("../src/views/timezone");
});

module.exports=router;


