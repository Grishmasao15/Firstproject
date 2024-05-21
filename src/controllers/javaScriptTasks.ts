import { Request, Response } from "express";

module.exports = function javaScriptTask(req: Request, res: Response): void {

  let result: string = req.params.result;
  res.render("../src/views/" + result);

};


