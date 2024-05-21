import { Request, Response } from "express";

function fetchApi(req: Request, res: Response): void {
  res.render("../src/views/index");
};

function fetchApiDetails(req: Request, res: Response): void {
  let id: string | undefined = (req.query.id)?.toString();
  res.render("../src/views/fetchapialldetails", { id: id });
};

export default { fetchApi, fetchApiDetails };

