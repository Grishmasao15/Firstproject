var router = require("express").Router();

const f = require("./practical1");
const p = require("./practical2");
const q = require("./practical3");
const g = require("./practical4");
const h = require("./practical5");
const r = require("./practical6");
const s = require("./practical7");
const t = require("./practical8");

module.exports=function allFunctions(req, res){
  var functionname = req.params.functionname;

  if (functionname === "vowel") {
    // let str="grishma sao";

    ans = f.vowelsConsonants(req.query.str);

    if(ans.res2.length>0){
      res.send("Please Enter Input");
      res.end();
    }
    else if (ans.res.length > 0) {
      res.send("Please Enter valid input");
      res.end();
    } else {
      res.send(
        `<p>Vowels are:` +
          ans.vowelStr.toString() +
          `</p><p>Consonants are:` +
          ans.consonantStr.toString() +
          `</p>` +
          "Note: You can pass your input in url"
      );
    }

  } else if (functionname === "oddeven") {
    // let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15];

    let intarr = req.query.arr.split(",");
    ans = p.oddEven(intarr);

    if (ans.str.length > 0) {
      res.send("Wrong Data Entered");
    } else {
      res.send(
        `<p>even numbers are:` +
          ans.even.toString() +
          `</p><p>odd numbers are:` +
          ans.odd.toString() +
          `</p>` +
          `<p>Note: You can pass your input in url</p>`
      );
    }
  } else if (functionname === "groupby") {
    var cars = [
      { make: "audi", model: "r8", year: "2012" },
      { make: "audi", model: "rs5", year: "2013" },
      { make: "ford", model: "mustang", year: "2012" },
      { make: "ford", model: "fusion", year: "2015" },
      { make: "kia", model: "optima", year: "2012" },
    ];

    ans = q.group(cars);
    res.send(
      `<p>The input is:</p> 
        <p>var cars = [
        { make: 'audi', model: 'r8', year: '2012' },
        { make: 'audi', model: 'rs5', year: '2013' },
        { make: 'ford', model: 'mustang' year: '2012' },
        { make: 'ford', model: 'fusion', year: '2015'},
        { make: 'kia', model: 'optima' year: '2012' }
        ];</p>
        <p>The result is:</p>` + JSON.stringify(ans)
    );
  } else if (functionname === "factorial") {
    ans = g.fact(req.query.num);
    res.send(
      `<p>The factorial of` +
        ` ` +
        req.query.num +
        ` ` +
        `is:</p>` +
        ans +
        `<p>Note: You can pass your input in url</p>`
    );
  } else if (functionname === "vowelcount") {
    // let arr = ["grishma", "sao"];
    let arrtwo = req.query.arr.split(" ");
    ans = h.vowelCount(arrtwo);
    res.send(ans + `<p>Note: You can pass your input in url</p>`);
  } else if (functionname === "vowelcount2") {
    // let arr = ["grishma", "sao"];
    let arrtwo = req.query.arr.split(" ");
    ans = r.vowelCountMax(arrtwo);
    res.send(ans + `<p>Note: You can pass your input in url</p>`);
  } else if (functionname === "palindrome") {
    // let str = "grishma";
    ans = s.palindrome(req.query.str);
    res.send(ans + `<p>Note: You can pass your input in url</p>`);
  } else if (functionname === "calc") {
    let num1 = "";
    let num2 = "";
    let op = "";
    ans = t.calc(req.query.num1, req.query.num2, req.query.op);
    res.send(ans + `<p>Note: You can pass your input in url</p>`);
  } else {
    res.render("../src/views/functions");
  }
};
