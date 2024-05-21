import { Request, Response } from "express";
import conn from "../models/connection";
import { FieldPacket, RowDataPacket } from "mysql2";

let query: string;

function details(req: Request, res: Response): void {
  query = `select * from student_master limit 1000`;
  conn.query(query, function (err: Error, result: Array<RowDataPacket>): void {
    if (err) throw err;
    res.render("../src/views/searchdetails", { data: result });
  });
};

function idDetails(req: Request, res: Response): void {
  let q1: number = req.body.qr;
  query = `select * from student_master where stu_id In (${q1}) `;
  conn.query(query, function (err: Error, result: Array<RowDataPacket>, fields: Array<FieldPacket>): void {
    if (err) throw err;
    res.render("../src/views/details", { result: result, fields: fields });
  });
};

function searchDetails(req: Request, res: Response): void {
  let fn: string = req.body.fn;
  let ln: string = req.body.ln;
  let value: string = req.body.Andor;

  query = `select * from student_master where firstname LIKE '%${fn}%' ${value} lastname LIKE '%${ln}%' `;

  conn.query(query, function (err: Error, result: Array<RowDataPacket>, fields: Array<FieldPacket>): void {
    if (err) {
      res.send("Not Found");
    } else {
      res.render("../src/views/details", { result: result, fields: fields });
    }
  });
};

export default { details, idDetails, searchDetails };


//used any