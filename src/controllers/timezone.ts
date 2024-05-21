import { Request, Response } from "express";

function timezone(req: Request, res: Response): void {
  res.render("../src/views/timezone");
};

export default timezone;


