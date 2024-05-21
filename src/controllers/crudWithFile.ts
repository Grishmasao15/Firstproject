import { Request, Response } from "express";

import fs from "fs";

function form(req: Request, res: Response): void {
  res.render("../src/views/form");
};

function showAll(req: Request, res: Response): void {
  let obj = JSON.parse(fs.readFileSync("alldata.json").toString());
  res.render("../src/views/table", { obj: obj });
};

function submit(req: Request, res: Response): void {
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
};

function allDetails(req: Request, res: Response): void {
  let obj = JSON.parse(fs.readFileSync("alldata.json").toString());
  res.render("../src/views/alldetails", { mail: req.body.mail, obj });
};

export default { form, showAll, submit, allDetails };
