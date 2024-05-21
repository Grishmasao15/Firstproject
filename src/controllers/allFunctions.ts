import { Request, Response } from "express";

import vowelsConsonants from "./practical1";
import oddEven from "./practical2";
import group from "./practical3";
import fact from "./practical4";
import vowelCount from "./practical5";
import vowelCountMax from "./practical6";
import palindrome from "./practical7";
import calc from "./practical8";

import { GroupByInterface, vowelInterface, OddEvenInterface, groupByResultInterface } from "../intefaces/interfaces";

module.exports = function allFunctions(req: Request, res: Response) {
  const functionname: string = req.params.functionname;

  if (functionname === "vowel") {
    let str: string = (req.query.str)?.toString() || "";

    let ans: vowelInterface = vowelsConsonants(str);

    if (ans.res.length > 0) {
      res.send("Please Enter Input");
      res.end();
    }
    else if (ans.res.length > 0) {
      res.send("Please Enter valid input");
      res.end();
    } else {
      res.send(
        `<p>Vowels are:` +
        ans.VowelStr.toString() +
        `</p><p>Consonants are:` +
        ans.consonantStr.toString() +
        `</p>` +
        "Note: You can pass your input in url"
      );
    }

  } else if (functionname === "oddeven") {
    // let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15];
    let arr: string = (req.query.arr)?.toString() || "";
    let tempArr: string[] = arr.split(",");
    let finalarr: number[] = [];

    tempArr.map((e) => {
      finalarr.push(Number(e));
    })

    let ans: OddEvenInterface = oddEven(finalarr);


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
    let cars: Array<GroupByInterface> = [
      { make: "audi", model: "r8", year: 2012 },
      { make: "audi", model: "rs5", year: 2013 },
      { make: "ford", model: "mustang", year: 2012 },
      { make: "ford", model: "fusion", year: 2015 },
      { make: "kia", model: "optima", year: 2012 },
    ];

    let ans: groupByResultInterface = group(cars);
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
    let inputnum: number | undefined = Number(req.query.num);
    let ans: number = fact(inputnum);
    if (ans == 0) {
      res.send("Please enter number only")
    }
    else {
      res.send(
        `<p>The factorial of` +
        ` ` +
        req.query.num +
        ` ` +
        `is:</p>` +
        ans +
        `<p>Note: You can pass your input in url</p>`
      );
    }

  } else if (functionname === "vowelcount") {
    // let arr = ["grishma", "sao"];
    let str: string[] | string = (req.query.arr)?.toString().split(" ") || "";
    let ans: string = vowelCount(str);
    res.send(ans + `<p>Note: You can pass your input in url</p>`);

  } else if (functionname === "vowelcount2") {
    // let arr = ["grishma", "sao"];
    let str: string[] | string = (req.query.arr)?.toString().split(" ") || "";
    let ans: string = vowelCountMax(str);
    res.send(ans + `<p>Note: You can pass your input in url</p>`);

  } else if (functionname === "palindrome") {
    // let str = "grishma";
    let str: string = (req.query.str)?.toString() || "";
    let ans: string = palindrome(str);
    res.send(ans + `<p>Note: You can pass your input in url</p>`);

  } else if (functionname === "calc") {
    let num1: number = Number(req.query.num1);
    let num2: number = Number(req.query.num2);
    let op: string = (req.query.op)?.toString() || "";
    if (Number.isNaN(num1) || Number.isNaN(num2)) {
      res.send("please enter number for num1 and num2")
    }
    else {
      let ans: string = calc(num1, num2, op);
      res.send(ans + `<p>Note: You can pass your input in url</p>`);
    }

  } else {
    res.render("../src/views/functions");
  }
};
