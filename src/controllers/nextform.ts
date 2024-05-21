import { Request, Response } from "express";
import conn from "../models/connection";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { JobAppForm } from "../intefaces/interfaces";


function nextform(req: Request, res: Response): void {
  res.render("../src/views/nextform");
};

async function update(req: Request, res: Response): Promise<void> {

  let id: string | undefined = (req.query.id)?.toString();

  if (id) {
    try {
      let query: string = `select count(*) as counter from basic_detail where emp_id=${req.query.id}`;

      let count: Array<RowDataPacket> = await conn.query(query) as Array<RowDataPacket>;
      let counter: number = count[0].counter;


      if (counter >= 1) {
        console.log("in if");
        let r1: Array<RowDataPacket> = await conn.query(`select * from basic_detail where emp_id=${req.query.id}`) as Array<RowDataPacket>;
        let r2: Array<RowDataPacket> = await conn.query(`select * from educationdetails where emp_id=${req.query.id}`) as Array<RowDataPacket>;
        let r3: Array<RowDataPacket> = await conn.query(`select * from work_experience where emp_id=${req.query.id}`) as Array<RowDataPacket>;
        let r4: Array<RowDataPacket> = await conn.query(`select * from languageknown where emp_id=${req.query.id}`) as Array<RowDataPacket>;
        let r5: Array<RowDataPacket> = await conn.query(`select * from technologyknown where emp_id=${req.query.id}`) as Array<RowDataPacket>;
        let r6: Array<RowDataPacket> = await conn.query(`select * from reference_contact where emp_id=${req.query.id}`) as Array<RowDataPacket>;
        let r7: Array<RowDataPacket> = await conn.query(`select * from preferences where emp_id=${req.query.id}`) as Array<RowDataPacket>;

        // let obj = { r1, r2, r3, r4, r5, r6, r7, counter };
        res.send({ r1, r2, r3, r4, r5, r6, r7, counter })

      } else {
        let str: string = "id not exist";
        // let obj = { str: str }
        res.send({ str: str });
      }
    }

    catch (err) {
      console.log(err);
    }

  }
};

async function storeDetails(req: Request, res: Response): Promise<void> {
  if (req.body.empid == "") {

    const { fname, lname, designation, address1, address2, city, phonenumber, email, gender, states, zipcode, relationshipstatus, DOB, nameofboard, passingyear, percentage, companyname, pastdesignation, from, to, lang, tech, name, contactnumber, relation, preferredlocation, noticeperiod, expectedctc, currentctc, department,
    }: JobAppForm = req.body;

    try {

      //Basic Details Insertion

      let query: string = `INSERT INTO basic_detail SET fname = ?,lname = ?,designation = ?,address1 = ?,address2 = ?,city = ?,phonenumber = ?,email = ?,gender = ?,states = ?,zipcode = ?,relationshipstatus = ?,DOB = ?`;

      let result: ResultSetHeader = await conn.query(query, [fname, lname, designation, address1, address2, city, phonenumber, email, gender, states, zipcode, relationshipstatus, DOB]) as unknown as ResultSetHeader;

      //Education Details Insertion

      for (let i = 0; i < 4; i++) {
        let query: string = `INSERT INTO educationdetails SET emp_id = ?,nameofboard_or_coursename = ?,passingyear = ?,percentage = ?`;
        if (nameofboard[i]) {
          await conn.query(query, [result.insertId, nameofboard[i], passingyear[i], percentage[i]]);
        }
      }

      // Work Experience Insertion

      for (let i = 0; i < 3; i++) {
        let query: string = `INSERT INTO work_experience SET emp_id = ?,companyname = ?,designation = ?,from_date = ?,to_date = ?`;
        if (companyname[i]) {
          await conn.query(query, [result.insertId, companyname[i], pastdesignation[i], from[i], to[i]]);
        }
      }

      //Language Insertion

      if (lang != undefined && typeof lang != "string") {
        let query: string = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

        for (let i = 0; i < lang.length; i++) {
          let a: string = lang[i];
          query += `(${result.insertId},'${lang[i]}','${req.body[a]}'),`;
        }

        query = query.slice(0, query.length - 1);

        await conn.query(query);

      } else if (lang != undefined) {
        let query: string = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

        let a: string = lang;
        query += `(${result.insertId},'${lang}','${req.body[a]}')`;


        conn.query(query);
      }

      //Technology Insertion

      if (tech != undefined && typeof tech != "string") {
        let query: string = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

        for (let i = 0; i < tech.length; i++) {
          let b: string = tech[i];
          query += `(${result.insertId},'${tech[i]}','${req.body[b]}'),`;
        }

        query = query.slice(0, query.length - 1);
        await conn.query(query);
      } else if (tech != undefined) {
        let query: string = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

        let b: string = tech;
        query += `(${result.insertId},'${tech}','${req.body[b]}')`;


        await conn.query(query);
      }

      // Reference Contact Insertion

      for (let i = 0; i < 2; i++) {
        let query: string = `INSERT INTO reference_contact SET emp_id = ?,nameof_emp = ?,contactnumber = ?,relation = ?`;

        if (name[i]) {
          await conn.query(query, [result.insertId, name[i], contactnumber[i], relation[i]]);
        }
      }

      // Preferences Insertion

      if (typeof preferredlocation != "string" && preferredlocation != undefined && department !== "-select-") {
        let pl: string = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);

        let query: string = `INSERT INTO preferences SET emp_id = ?,preferredlocation = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?,department = ?`;

        await conn.query(query, [result.insertId, pl, noticeperiod, expectedctc, currentctc, department]);/////start with hereeee
        res.redirect("/nextform");

      } else if (typeof preferredlocation != "string" && preferredlocation != undefined && department == "-select-") {
        let pl: string = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);

        let query: string = `INSERT INTO preferences SET emp_id = ?,preferredlocation = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?`;

        await conn.query(query, [result.insertId, pl, noticeperiod, expectedctc, currentctc]);
        res.redirect("/nextform");

      } else if (typeof preferredlocation == "string" && preferredlocation != undefined && department != "-select-") {

        let query: string = `INSERT INTO preferences SET emp_id = ?,preferredlocation = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?,department = ?`;

        await conn.query(query, [result.insertId, preferredlocation, noticeperiod, expectedctc, currentctc, department]);
        res.redirect("/nextform");

      } else if (typeof preferredlocation == "string" && preferredlocation != undefined && department == "-select-") {

        let query: string = `INSERT INTO preferences SET emp_id = ?,preferredlocation = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?`;

        await conn.query(query, [result.insertId, preferredlocation, noticeperiod, expectedctc, currentctc]);
        res.redirect("/nextform");

      } else if (preferredlocation == undefined && department != "-select-") {
        let query: string = `INSERT INTO preferences SET emp_id = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?,department = ?`;

        await conn.query(query, [result.insertId, noticeperiod, expectedctc, currentctc, department]);
        res.redirect("/nextform");

      }
    }
    catch (err) {
      console.log(err);
    }

  } else {

    let id: number = req.body.empid;

    const { fname, lname, designation, address1, address2, city, phonenumber, email, gender, states, zipcode, relationshipstatus, DOB, nameofboard, passingyear, percentage, companyname, pastdesignation, from, to, lang, tech, name, contactnumber, relation, preferredlocation, noticeperiod, expectedctc, currentctc, department,
    }: JobAppForm = req.body;

    try {

      //update in basic_detail
      let basicdetail: Array<ResultSetHeader> = await conn.query(
        `UPDATE basic_detail SET fname = ?,lname = ?,designation = ?,address1 = ?,address2 = ?,city = ?,phonenumber = ?,email = ?,gender = ?,states = ?,zipcode = ?,relationshipstatus = ?,DOB = ? WHERE emp_id=?`,
        [fname, lname, designation, address1, address2, city, phonenumber, email, gender, states, zipcode, relationshipstatus, DOB, id]
      ) as Array<ResultSetHeader>;

      //update in education detail
      let query1: Array<RowDataPacket> = await conn.query(`select education_id from educationdetails where emp_id=?`, id) as Array<RowDataPacket>;

      for (let i = 0; i < 4; i++) {
        if (nameofboard[i]) {
          let edudetail: Array<ResultSetHeader> = await conn.query(
            `UPDATE educationdetails SET nameofboard_or_coursename = ?,passingyear = ?,percentage = ? WHERE education_id=?`, [nameofboard[i], passingyear[i], percentage[i], query1[i].education_id]) as Array<ResultSetHeader>;
        }
      }

      //update in work experience
      let query2: Array<ResultSetHeader> = await conn.query(`delete from work_experience where emp_id= ? `, id) as Array<ResultSetHeader>;

      for (let i = 0; i < 3; i++) {
        if (companyname[i]) {
          let workexp: Array<ResultSetHeader> = await conn.query(`INSERT INTO work_experience SET emp_id = ?,companyname = ?,designation = ?,from_date = ?,to_date = ?`, [id, companyname[i], pastdesignation[i], from[i], to[i]]) as Array<ResultSetHeader>;
        }
      }

      //update in language known

      let query3: Array<ResultSetHeader> = await conn.query(`delete from languageknown where emp_id=?`, id) as Array<ResultSetHeader>;

      if (typeof lang != "string" && lang != undefined) {
        let query: string = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

        for (let i = 0; i < lang.length; i++) {
          let a: string = lang[i];
          query += `(${id},'${lang[i]}','${req.body[a]}'),`;
        }

        query = query.slice(0, query.length - 1);

        let langknown: Array<ResultSetHeader> = await conn.query(query) as Array<ResultSetHeader>;
      } else if (lang != undefined) {
        let query: string = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

        let a: string = lang;
        query += `(${id},'${lang}','${req.body[a]}')`;


        let langknown: Array<ResultSetHeader> = await conn.query(query) as Array<ResultSetHeader>;
      }

      //update in technology known

      let query4: Array<ResultSetHeader> = await conn.query(`delete from technologyknown where emp_id=?`, id) as Array<ResultSetHeader>;

      if (tech != undefined && typeof tech != "string") {

        let query: string = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

        for (let i = 0; i < tech.length; i++) {
          let b: string = tech[i];
          query += `(${id},'${tech[i]}','${req.body[b]}'),`;
        }

        query = query.slice(0, query.length - 1);
        let techknown: Array<ResultSetHeader> = await conn.query(query) as Array<ResultSetHeader>;

      } else if (tech != undefined) {
        let query: string = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

        for (let i = 0; i < 1; i++) {
          let b: string = tech;
          query += `(${id},'${tech}','${req.body[b]}')`;
        }

        let techknown: Array<ResultSetHeader> = await conn.query(query) as Array<ResultSetHeader>;
      }

      //update in reference_contact

      let query5: Array<ResultSetHeader> = await conn.query(`delete from reference_contact where emp_id=?`, id) as Array<ResultSetHeader>;

      for (let i = 0; i < 2; i++) {
        if (name[i]) {
          let refcontact: Array<ResultSetHeader> =
            await conn.query(`INSERT INTO reference_contact SET emp_id = ?,nameof_emp = ?,contactnumber = ?,relation = ?`, [id, name[i], contactnumber[i], relation[i]]) as Array<ResultSetHeader>;
        }
      }

      //update in preferences

      if (typeof preferredlocation != "string" && preferredlocation != undefined && department != "-select-") {
        let pl: string = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);


        let query: string = `UPDATE preferences SET preferredlocation = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?,department= ? WHERE emp_id= ? `;
        let pref: Array<ResultSetHeader> = await conn.query(query, [pl, noticeperiod, expectedctc, currentctc, department, id]) as Array<ResultSetHeader>;

      } else if (typeof preferredlocation != "string" && preferredlocation != undefined && department == "-select-") {
        let pl: string = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);


        let query: string = `UPDATE preferences SET preferredlocation=?,noticeperiod= ?,expectedctc= ?,currentctc=? WHERE emp_id= ?`;
        let pref: Array<ResultSetHeader> = await conn.query(query, [pl, noticeperiod, expectedctc, currentctc, id]) as Array<ResultSetHeader>;

      } else if (typeof preferredlocation == "string" && preferredlocation != undefined && department != "-select-") {

        let query: string = `UPDATE preferences SET preferredlocation=?,noticeperiod=?,expectedctc=?,currentctc=?,department=? WHERE emp_id=?`;
        let pref: Array<ResultSetHeader> = await conn.query(query, [preferredlocation, noticeperiod, expectedctc, currentctc, department, id]) as Array<ResultSetHeader>;

      } else if (typeof preferredlocation == "string" && preferredlocation != undefined && department == "-select-") {

        let query: string = `UPDATE preferences SET preferredlocation=?,noticeperiod=?,expectedctc=?,currentctc=? WHERE emp_id=?`;
        let pref: Array<ResultSetHeader> = await conn.query(query, [preferredlocation, noticeperiod, expectedctc, currentctc, id]) as Array<ResultSetHeader>;

      } else if (preferredlocation == undefined && department != "-select-") {

        let query: string = `UPDATE preferences SET noticeperiod=?,expectedctc=?,currentctc=?,department=? WHERE emp_id=?`;
        let pref: Array<ResultSetHeader> = await conn.query(query, [noticeperiod, expectedctc, currentctc, department, id]) as Array<ResultSetHeader>;

      }
    }
    catch (err) {
      console.log(err);
    }
  }
};

export default { nextform, update, storeDetails };
