var router = require("express").Router();
const fs = require("fs");

let alluserData = [];
let user = [];

router.get("/form", (req, res) => {
  res.render("../src/views/form");
});

router.post("/showall", (req, res) => {
  let obj = JSON.parse(fs.readFileSync("alldata.json"));
  res.render("../src/views/table", { obj: obj });
});

router.post("/submit", (req, res) => {
  let obj = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    gender: req.body.gender,
    address: req.body.address,
    mono: req.body.mono,
    email: req.body.email,
    hobbies: req.body.hobbies,
  };

  if (!fs.existsSync("alldata.json")) {
    var create = fs.createWriteStream("alldata.json");
    let content = "[" + JSON.stringify(obj) + "]";
    create.write(content);
  } else {
    let fileContents = fs.readFileSync("alldata.json").toString();
    fileContents = fileContents.slice(0, fileContents.length - 1);
    fileContents += "," + JSON.stringify(obj) + "]";
    fs.writeFile("alldata.json", fileContents, function (err) {
      if (err) throw err;
    });
  }

  res.render("../src/views/tabletwo", {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    gender: req.body.gender,
    address: req.body.address,
    mono: req.body.mono,
    email: req.body.email,
    hobbies: req.body.hobbies,
  });
});

router.post("/alldetails", (req, res) => {
  let obj = JSON.parse(fs.readFileSync("alldata.json"));
  res.render("../src/views/alldetails", { mail: req.body.mail, obj: obj });
});

module.exports=router;
