
import conn from "../models/connection";
import { Request, Response } from "express";
import { FieldPacket, RowDataPacket } from "mysql2";

let query: string = "";
let counter: number | undefined = 0;
let lmt: number = 10;
let pagenumber: number = 1;

async function queryHome(req: Request, res: Response): Promise<void> {
  res.render("../src/views/inputbox");
};

async function QueryDetails(req: Request, res: Response): Promise<void> {
  counter = 0;
  lmt = 10;
  pagenumber = 1;
  query = req.body.qr;

  conn.query(query, function (err: Error, result: Array<RowDataPacket>, fields: Array<FieldPacket>): void {
    if (err) {
      res.send("You Entered Wrong Query please check your query");
    } else {
      res.render("../src/views/querytable", { result, fields, q: query, counter, lmt, pagenumber });
    }
  });
};

async function pagination(req: Request, res: Response): Promise<void> {
  if (req.query.id == "home") {
    pagenumber = 1;
    counter = 0;
    lmt = 10;
    conn.query(query, function (err: Error, result: Array<RowDataPacket>, fields: Array<FieldPacket>): void {
      if (err) {
        res.send("You Entered Wrong Query please check your query");
      } else {
        res.render("../src/views/querytable", { result, fields, q: query, counter, lmt, pagenumber });
      }
    });

  } else if (req.query.id == "end") {
    conn.query(query, function (err: Error, result: Array<RowDataPacket>, fields: Array<FieldPacket>): void {
      counter = result.length - 10;
      lmt = counter + 10;
      pagenumber = Math.ceil(counter / 10) + 1;
      if (result.length % 10 != 0) {
        counter = result.length - (result.length % 10);
      }
      if (err) {
        res.send("You Entered Wrong Query please check your query");
      } else {
        res.render("../src/views/querytable", { result, fields, q: query, counter, lmt, pagenumber });
      }
    });

  } else if (req.query.id == "next") {
    counter = Number(req.query.ct) + 10;
    lmt = counter + 10;
    pagenumber = counter / 10 + 1;
    conn.query(query, function (err: Error, result: Array<RowDataPacket>, fields: Array<FieldPacket>): void {
      if (err) {
        res.send("You Entered Wrong Query please check your query");
      } else {
        res.render("../src/views/querytable", { result, fields, q: query, counter, lmt, pagenumber, });
      }
    });

  } else if (req.query.id == "previous") {
    counter = Number(req.query.ct) - 10;
    lmt = counter + 10;
    pagenumber = counter / 10 + 1;
    conn.query(query, function (err: Error, result: Array<RowDataPacket>, fields: Array<FieldPacket>): void {
      if (err) {
        res.send("You Entered Wrong Query please check your query");
      } else {
        res.render("../src/views/querytable", { result, fields, q: query, counter, lmt, pagenumber });
      }
    });
  }
};

export default { queryHome, QueryDetails, pagination };