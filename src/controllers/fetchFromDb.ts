import { Request, Response } from "express";
import conn from "../models/connection";
import { RowDataPacket } from "mysql2";

let srt: string = 'stu_id';
let counter: number = 0;
const recordsperpage: number = 200;

async function studentDetails(req: Request, res: Response): Promise<void> {
  let pagenumber = counter / recordsperpage + 1;
  try {
    if (req.query.id) {
      srt = (req.query.id.toString());
    }
    let query: string = `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`
    let result = await conn.query(query, [counter]);

    res.render('../src/views/FetchDBtable', { data: result, number: pagenumber, id: req.query.id });
  }
  catch (err) {
    console.log(err);
  }
};

async function home(req: Request, res: Response): Promise<void> {
  counter = 0;
  let pagenumber = counter / recordsperpage + 1;
  try {
    let query: string = `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`;
    let result = await conn.query(query, [counter]);

    res.render("../src/views/FetchDBtable", { data: result, number: pagenumber });
  }
  catch (err) {
    console.log(err);
  }
};

async function next(req: Request, res: Response): Promise<void> {
  counter += recordsperpage;
  let pagenumber = counter / recordsperpage + 1;
  try {
    let query: string = `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`;
    let result = await conn.query(query, [counter]);
    res.render("../src/views/FetchDBtable", { data: result, number: pagenumber });
  }
  catch (err) {
    console.log(err);
  }
};

async function previous(req: Request, res: Response): Promise<void> {
  counter -= recordsperpage;
  let pagenumber = counter / recordsperpage + 1;
  try {
    let query: string = `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`;
    let result = await conn.query(query, [counter]);
    res.render("../src/views/FetchDBtable", { data: result, number: pagenumber });
  }
  catch (err) {
    console.log(err);
  }
};

async function end(req: Request, res: Response): Promise<void> {
  try {
    let query2: string = `select count(*) as count from student_master`;
    let result2: Array<RowDataPacket> = await conn.query(query2) as Array<RowDataPacket>;
    console.log(result2);
    counter = result2[0].count - recordsperpage;
    // counter = 50000 - recordsperpage;


    let pagenumber = counter / recordsperpage + 1;
    let query = `select * from student_master ORDER BY ${srt} LIMIT 200 OFFSET ?`;
    let result = await conn.query(query, [counter]);
    res.render("../src/views/FetchDBtable", { data: result, number: pagenumber });
  }
  catch (err) {
    console.log(err);
  }
};

export default { studentDetails, home, next, previous, end };





