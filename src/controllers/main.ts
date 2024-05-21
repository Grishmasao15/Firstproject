import { Request, Response } from "express";
import conn from "../models/connection";
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { RegistrationInterface } from "../intefaces/interfaces";
import md5 from "md5"
import jwt from "jsonwebtoken";

let localdate: Date = new Date();

function main(req: Request, res: Response): void {
  res.render("../src/views/registration");
}

async function storeDetails(req: Request, res: Response): Promise<void> {
  const { firstname, lastname, email, mono, activationcode }: RegistrationInterface = req.body;

  let counter: Array<ResultSetHeader> = await conn.query(
    `INSERT INTO users SET firstname=?,lastname=?,email=?,mobilenumber=?,activation_code=?`,
    [firstname, lastname, email, mono, activationcode]
  ) as Array<ResultSetHeader>;
}

async function thanksCode(req: Request, res: Response): Promise<void> {
  let acticode: string = req.params.code;

  res.render("../src/views/thanks", { acticode });
};

async function thanksCodeUsername(req: Request, res: Response): Promise<void> {
  let uname: string = req.params.username;
  let activationcode: string = req.params.code;

  let date: Date = new Date();
  let ins_date: string =
    date.toISOString().slice(0, 10) + " " + date.toTimeString().slice(0, 8);

  let query: string = `UPDATE users SET activation_code =?,created_at=? WHERE email =?;`;

  let result: Array<ResultSetHeader> = await conn.query(query, [activationcode, ins_date, uname]) as Array<ResultSetHeader>;

  res.render("../src/views/thanks", { acticode: activationcode });
};

async function code(req: Request, res: Response): Promise<void> {
  let actcode: string = req.params.code;

  let query: string = `SELECT COUNT(*) AS count FROM users WHERE activation_code =? `;

  let counter: Array<RowDataPacket> = await conn.query(query, [actcode]) as Array<RowDataPacket>;

  if (counter[0].count > 0) {
    if (actcode) {
      let current_time: number = localdate.getTime();

      let result: Array<RowDataPacket> = await conn.query(`select created_at from users where activation_code=?`, actcode) as Array<RowDataPacket>;

      let temp: string = result[0].created_at.toString().slice(0, 24);

      let old: Date = new Date(temp);
      let db_time: number = old.getTime();

      let timediff: number = Math.floor((current_time - db_time) / 60000);

      if (timediff > 60) {
        let result: Array<ResultSetHeader> = await conn.query(`delete from users where activation_code=?`, actcode) as Array<ResultSetHeader>;
        res.redirect("/");
      } else {
        res.render("../src/views/createpass", { actcode: actcode });
      }
    }
  }
};

async function storePass(req: Request, res: Response): Promise<void> {
  let pass: string = req.body.passsalt;
  let salt: number = req.body.salt;
  let code: string = req.body.code;

  let encpass: string = md5(pass);

  let query: string = `UPDATE users SET passwordof_user=?,salt=? where activation_code=?`;
  let result: Array<ResultSetHeader> = await conn.query(query, [encpass, salt, code]) as Array<ResultSetHeader>;
  res.render("../src/views/login");
};

async function welcomeUsername(req: Request, res: Response): Promise<void> {
  // let query = await conn.query(`select firstname from users where email=?`,req.params.username);
  // let user = query[0].firstname;

  res.render("../src/views/welcome");
};

async function directLogin(req: Request, res: Response): Promise<void> {
  if (!req.cookies.token) {
    res.render("../src/views/login");
  }
  else {
    res.redirect("/welcome")
  }
};

async function logOut(req: Request, res: Response): Promise<void> {
  res.clearCookie("token");
  res.render("../src/views/login");
}

async function forgotPass(req: Request, res: Response): Promise<void> {
  res.render("../src/views/createpass");
};

async function loginUsernamePass(req: Request, res: Response): Promise<void> {
  const mail: string = req.params.username;

  const query: string = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
  let res1: Array<RowDataPacket> = await conn.query(query, [mail]) as Array<RowDataPacket>;
  const mailExist: boolean = res1[0].count >= 1;
  let passres: boolean = false;

  if (mailExist == true) {

    const password: string = req.params.pass;
    const p5: string = `select passwordof_user,salt from users where email=?;`;

    let query: Array<RowDataPacket> = await conn.query(p5, [mail]) as Array<RowDataPacket>;
    let salt: number = query[0].salt;
    const latestpass: string = md5(password + salt);
    const oldpass: string = query[0].passwordof_user;

    if (latestpass == oldpass) {
      passres = true;
      let token: string = jwt.sign({ data: latestpass }, "secretkey", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
    }
  }
  res.send({ passres });
};

function thanks(req: Request, res: Response): void {
  res.render("../src/views/thanks");
};

async function checkEmail(req: Request, res: Response): Promise<void> {
  const email: string = req.params.email;

  const sql: string = "SELECT COUNT(*) AS count FROM users WHERE email = ?";

  let result: Array<RowDataPacket> = await conn.query(sql, [email]) as Array<RowDataPacket>;

  const count: number = result[0].count;

  const emailExists: boolean = count >= 1;

  res.send({ emailExists });
};

export default { main, storeDetails, thanksCode, thanksCodeUsername, code, storePass, welcomeUsername, directLogin, logOut, forgotPass, loginUsernamePass, thanks, checkEmail };
