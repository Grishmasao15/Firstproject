var router = require("express").Router();

router.get("/timezone", (req, res) => {
  res.render("../src/views/timezone");
});

module.exports=router;


