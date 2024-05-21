
import { Request, Response } from "express";
import conn from "../models/connection";
import { RowDataPacket } from "mysql2";

let counter: number = 0;
let number: number = 1;
let month: string | number | undefined;
let year: string | number | undefined;
const recordsperpage: number = 50;
let query: string = `SELECT student_master.stu_id,student_master.firstname,student_master.lastname,
             YEAR(attendance_master.date_) AS year,
             MONTH(attendance_master.date_) AS month,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) as Total_present,
             count(distinct if(attendance_master.attendance = 'P',attendance_master.date_,NULL)) * 100/30 as Percentage From student_master
             inner join attendance_master on student_master.stu_id=attendance_master.stu_id where year(attendance_master.date_)=? and 
             MONTH(attendance_master.date_)=? group by year,month,student_master.stu_id limit 50 offset ?`;

async function attendanceDetails(req: Request, res: Response): Promise<void> {
  number = 1;
  counter = 0;
  try {
    if (req.query.month || req.query.year) {
      month = (req.query.month)?.toString();
      year = (req.query.year)?.toString();
    } else {
      month = 12;
      year = 2023;
    }
    let [result]: Array<RowDataPacket> = await conn.query(query, [year, month, counter]) as Array<RowDataPacket>;
    res.render("../src/views/attendance", { data: result, number, month, year });
  }
  catch (err) {
    console.log(err);
  }
};

async function home(req: Request, res: Response): Promise<void> {
  try {
    if (req.query.month || req.query.year) {
      month = (req.query.month)?.toString();
      year = (req.query.year)?.toString();
    }
    counter = 0;
    number = counter / recordsperpage + 1;
    let [result]: Array<RowDataPacket> = await conn.query(query, [year, month, counter]) as Array<RowDataPacket>;
    res.render("../src/views/attendance", { data: result, number, month, year });
  }
  catch (err) {
    console.log(err);
  }
};

async function previous(req: Request, res: Response): Promise<void> {
  try {
    if (req.query.month || req.query.year) {
      month = (req.query.month)?.toString();
      year = (req.query.year)?.toString();
    }
    if (number > 1) {

      counter -= recordsperpage;
      number = counter / recordsperpage + 1;
      let [result]: Array<RowDataPacket> = await conn.query(query, [year, month, counter]) as Array<RowDataPacket>;
      res.render("../src/views/attendance", { data: result, number, month, year });
    }
    else {
      counter = 0;
      number = counter / recordsperpage + 1;
      let [result]: Array<RowDataPacket> = await conn.query(query, [year, month, counter]) as Array<RowDataPacket>;
      res.render("../src/views/attendance", { data: result, number, month, year });
    }
  }
  catch (err) {
    console.log(err); let ans
  }
};

async function next(req: Request, res: Response): Promise<void> {
  try {
    if (req.query.month || req.query.year) {
      month = (req.query.month)?.toString();
      year = (req.query.year)?.toString();
    }

    let query2: string = `select max(stu_id) as max from attendance_master`;
    let [result2]: Array<RowDataPacket> = await conn.query(query2) as Array<RowDataPacket>;
    let count: number = result2[0].max - recordsperpage;
    let pagenumber = count / recordsperpage + 1;

    if (number < pagenumber) {

      counter += recordsperpage;
      number = counter / recordsperpage + 1;
      let [result]: Array<RowDataPacket> = await conn.query(query, [year, month, counter]) as Array<RowDataPacket>;
      res.render("../src/views/attendance", { data: result, number, month, year });

    }
    else {
      counter = count;
      number = counter / recordsperpage + 1;
      let [result]: Array<RowDataPacket> = await conn.query(query, [year, month, counter]) as Array<RowDataPacket>;
      res.render("../src/views/attendance", { data: result, number, month, year });
    }
  }
  catch (err) {
    console.log(err);
  }

};

async function end(req: Request, res: Response): Promise<void> {
  try {
    if (req.query.month || req.query.year) {
      month = (req.query.month)?.toString();
      year = (req.query.year)?.toString();
    }

    let query2: string = `select max(stu_id) as max from attendance_master`;
    let [result2]: Array<RowDataPacket> = await conn.query(query2) as Array<RowDataPacket>;

    counter = result2[0].max - recordsperpage;
    number = counter / recordsperpage + 1;
    let [result]: Array<RowDataPacket> = await conn.query(query, [year, month, counter]) as Array<RowDataPacket>;
    res.render("../src/views/attendance", { data: result, number, month, year });
  }
  catch (err) {
    console.log(err);
  }
};

export default { attendanceDetails, home, previous, next, end };

