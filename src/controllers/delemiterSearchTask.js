var router = require("express").Router();
const connection = require("../models/connection");


async function delemiterSearchTask(req, res) {
  let result= await connection.executeQuery("select * from student_master limit 1000")
    res.render("../src/views/home", { data: result });
};

async function delemiterSearch(req, res) {
  let str = req.body.search;
  let firstname = [];
  let lastname = [];
  let email = [];
  let contact_no = [];
  let city = [];
  let temp=0;
  let tempstr;

  for (let i = 0; i < str.length; i++) {
    switch (str[i]) {
      case "_":
        for (let j = i + 1; j < str.length + 1; j++) {
          if (str[j] == "_" ||str[j] == "^" ||str[j] == "$" ||str[j] == "{" ||str[j] == ":" ||j == str.length) {
            temp = j;
            break;
          }
        }
        tempstr = str.slice(i + 1, temp);
        firstname.push(tempstr);
        break;

      case "^":
        for (let j = i + 1; j < str.length + 1; j++) {
          if (str[j] == "_" ||str[j] == "^" ||str[j] == "$" ||str[j] == "{" ||str[j] == ":" ||j == str.length) {
            temp = j;
            break;
          }
        }
        tempstr = str.slice(i + 1, temp);
        lastname.push(tempstr);
        break;

      case "$":
        for (let j = i + 1; j < str.length + 1; j++) {
          if (str[j] == "_" ||str[j] == "^" ||str[j] == "$" ||str[j] == "{" ||str[j] == ":" ||j == str.length) {
            temp = j;
            break;
          }
        }
        tempstr = str.slice(i + 1, temp);
        email.push(tempstr);
        break;

      case "{":
        for (let j = i + 1; j < str.length + 1; j++) {
          if (str[j] == "_" ||str[j] == "^" ||str[j] == "$" ||str[j] == "{" ||str[j] == ":" ||j == str.length) {
            temp = j;
            break;
          }
        }
        tempstr = str.slice(i + 1, temp);
        contact_no.push(tempstr);
        break;

      case ":":
        for (let j = i + 1; j < str.length + 1; j++) {
          if (str[j] == "_" ||str[j] == "^" ||str[j] == "$" ||str[j] == "{" ||str[j] == ":" ||j == str.length) {
            temp = j;
            break;
          }
        }
        tempstr = str.slice(i + 1, temp);
        city.push(tempstr);
        break;
    }
  }

  let sql = `select * from student_master where`;

  if (firstname.length > 1) {
    sql += "(";
    for (let i = 0; i < firstname.length; i++) {
      sql += ` firstname like '%${firstname[i]}%' or `;
    }
    sql = sql.slice(0, sql.length - 4);
    sql += ")";
    sql += ` and `;
  } else if (firstname.length == 1) {
    sql += ` firstname like '%${firstname[0]}%' and `;
  }

  if (lastname.length > 1) {
    sql += "(";
    for (let i = 0; i < lastname.length; i++) {
      sql += `lastname like '%${lastname[i]}%' or `;
    }
    sql = sql.slice(0, sql.length - 4);
    sql += ")";
    sql += ` and `;
  } else if (lastname.length == 1) {
    sql += `lastname like '%${lastname[0]}%' and `;
  }

  if (email.length > 1) {
    sql += "(";
    for (let i = 0; i < email.length; i++) {
      sql += `email like '%${email[i]}%' or `;
    }
    sql = sql.slice(0, sql.length - 4);
    sql += ")";
    sql += ` and `;
  } else if (email.length == 1) {
    sql += `email like '%${email[0]}%' and `;
  }

  if (contact_no.length > 1) {
    sql += "(";
    for (let i = 0; i < contact_no.length; i++) {
      sql += `contact_no like '%${contact_no[i]}%' or `;
    }
    sql = sql.slice(0, sql.length - 4);
    sql += ")";
    sql += ` and `;
  } else if (contact_no.length == 1) {
    sql += `contact_no like '%${contact_no[0]}%' and `;
  }

  if (city.length > 1) {
    sql += "(";
    for (let i = 0; i < city.length; i++) {
      sql += `city like '%${city[i]}%' or `;
    }
    sql = sql.slice(0, sql.length - 4);
    sql += ")";
    sql += ` and `;
  } else if (city.length == 1) {
    sql += `city like '%${city[0]}%' and `;
  }

  sql = sql.slice(0, sql.length - 5);
  connection.con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("../src/views/delemitersearch", {result: result,fields: fields,str: str});
  });
};

module.exports = { delemiterSearchTask, delemiterSearch };
