import { Request, Response, NextFunction } from "express";

const auth = (req: Request, res: Response, next: NextFunction): void => {

    if (!req.cookies?.token) {

        res.redirect("/directlogin");

    }
    next();

}

export default auth;