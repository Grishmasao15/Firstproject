import { Request, Response } from "express";
import conn from "../models/connection";
import { RowDataPacket } from "mysql2";


async function createComponentTask(req: Request, res: Response): Promise<void> {
  // let type;
  res.render("../src/views/component");
};

async function createComponent(req: Request, res: Response): Promise<void> {
  let input: string = req.body.input1;
  let inputsplit: string[] = input.split(",");
  let name: string = inputsplit[0];
  let type: string = inputsplit[1];

  let query: string = ` select option_master.nameof_field from select_master join  option_master where option_master.select_id=select_master.select_id and select_master.keyof_field=?`;

  if (type == undefined || name == undefined) {
    res.send("Enter Valid Input!");
    res.end()
  }
  else {
    let result: Array<RowDataPacket> = await conn.query(query, [name]) as Array<RowDataPacket>;
    res.render("../src/views/component", { result, q: input, type, name });
  }
};

export default { createComponentTask, createComponent };
