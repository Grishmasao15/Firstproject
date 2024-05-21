
import { Request, Response, NextFunction, Router } from "express";
import conn from "../models/connection";
import { RowDataPacket, FieldPacket } from "mysql2";


async function delemiterSearchTask(req: Request, res: Response): Promise<void> {
  let result: Array<RowDataPacket> = await conn.query("select * from student_master limit 1000") as Array<RowDataPacket>;
  res.render("../src/views/home", { data: result });
};

async function delemiterSearch(req: Request, res: Response): Promise<void> {
  let str: string = req.body.search;
  let firstname: string[] = [];
  let lastname: string[] = [];
  let email: string[] = [];
  let contact_no: string[] = [];
  let city: string[] = [];
  let temp: number = 0;
  let tempstr: string;

  for (let i = 0; i < str.length; i++) {
    switch (str[i]) {
      case "_":
        for (let j = i + 1; j < str.length + 1; j++) {
          if (str[j] == "_" || str[j] == "^" || str[j] == "$" || str[j] == "{" || str[j] == ":" || j == str.length) {
            temp = j;
            break;
          }
        }
        tempstr = str.slice(i + 1, temp);
        firstname.push(tempstr);
        break;

      case "^":
        for (let j = i + 1; j < str.length + 1; j++) {
          if (str[j] == "_" || str[j] == "^" || str[j] == "$" || str[j] == "{" || str[j] == ":" || j == str.length) {
            temp = j;
            break;
          }
        }
        tempstr = str.slice(i + 1, temp);
        lastname.push(tempstr);
        break;

      case "$":
        for (let j = i + 1; j < str.length + 1; j++) {
          if (str[j] == "_" || str[j] == "^" || str[j] == "$" || str[j] == "{" || str[j] == ":" || j == str.length) {
            temp = j;
            break;
          }
        }
        tempstr = str.slice(i + 1, temp);
        email.push(tempstr);
        break;

      case "{":
        for (let j = i + 1; j < str.length + 1; j++) {
          if (str[j] == "_" || str[j] == "^" || str[j] == "$" || str[j] == "{" || str[j] == ":" || j == str.length) {
            temp = j;
            break;
          }
        }
        tempstr = str.slice(i + 1, temp);
        contact_no.push(tempstr);
        break;

      case ":":
        for (let j = i + 1; j < str.length + 1; j++) {
          if (str[j] == "_" || str[j] == "^" || str[j] == "$" || str[j] == "{" || str[j] == ":" || j == str.length) {
            temp = j;
            break;
          }
        }
        tempstr = str.slice(i + 1, temp);
        city.push(tempstr);
        break;
    }
  }

  let sql: string = `select * from student_master where`;

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
  conn.query(sql, function (err: Error, result: Array<RowDataPacket>, fields: Array<FieldPacket>): void {
    if (err) throw err;
    res.render("../src/views/delemitersearch", { result, fields, str });
  });
};

export default { delemiterSearchTask, delemiterSearch };

