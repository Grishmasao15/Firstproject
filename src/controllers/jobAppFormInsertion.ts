import { Request, Response } from "express";
import conn from "../models/connection";
import { ResultSetHeader } from "mysql2"
import { JobAppForm } from "../intefaces/interfaces";



async function jobAppForm(req: Request, res: Response): Promise<void> {
  res.render("../src/views/jobappform");
};

async function storeDetails(req: Request, res: Response): Promise<void> {

  const { fname, lname, designation, address1, address2, city, phonenumber, email, gender, states, zipcode, relationshipstatus, DOB, nameofboard, passingyear, percentage, companyname, pastdesignation, from, to, lang, tech, name, contactnumber, relation, preferredlocation, noticeperiod, expectedctc, currentctc, department,
  }: JobAppForm = req.body;

  //Basic Details Insertion

  let query: string = `INSERT INTO basic_detail SET fname = ?,lname = ?,designation = ?,address1 = ?,address2 = ?,city = ?,phonenumber = ?,email = ?,gender = ?,states = ?,zipcode = ?,relationshipstatus = ?,DOB = ?`;

  let result: ResultSetHeader = await conn.query(query, [fname, lname, designation, address1, address2, city, phonenumber, email, gender, states, zipcode, relationshipstatus, DOB]) as unknown as ResultSetHeader;

  //Education Details Insertion

  for (let i = 0; i < 4; i++) {
    let query: string = `INSERT INTO educationdetails(emp_id,nameofboard_or_coursename,passingyear,percentage) 
       VALUES('${result.insertId}','${nameofboard[i]}','${passingyear[i]}','${percentage[i]}')`
    if (nameofboard[i]) {
      await conn.query(query);
    }
  }

  // Work Experience Insertion

  for (let i = 0; i < 3; i++) {
    let query: string = `INSERT INTO work_experience(emp_id,companyname,designation,from_date,to_date) 
       VALUES('${result.insertId}','${companyname[i]}','${pastdesignation[i]}','${from[i]}','${to[i]}')`;
    if (companyname[i]) {
      await conn.query(query);
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

    await conn.query(query)

  } else if (lang != undefined) {
    let query: string = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

    for (let i = 0; i < 1; i++) {
      let a: string = lang;
      query += `(${result.insertId},'${lang}','${req.body[a]}')`;
    }

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

    for (let i = 0; i < 1; i++) {
      let b: string = tech;
      query += `(${result.insertId},'${tech}','${req.body[b]}')`;
    }

    await conn.query(query);
  }

  // Reference Contact Insertion

  for (let i = 0; i < 2; i++) {
    let query: string = `INSERT INTO reference_contact(emp_id,nameof_emp,contactnumber,relation) 
           VALUES('${result.insertId}','${name[i]}','${contactnumber[i]}','${relation[i]}')`;

    if (name[i]) {
      await conn.query(query);
    }
  }

  // Preferences Insertion


  if (typeof preferredlocation != "string" && preferredlocation != undefined && department != "-select-") {

    let pl: string = "";
    for (let i = 0; i < preferredlocation.length; i++) {
      pl += preferredlocation[i] + ",";
    }

    pl = pl.slice(0, pl.length - 1);

    let query: string = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc,department) 
           VALUES('${result.insertId}','${pl}','${noticeperiod}','${expectedctc}','${currentctc}','${department}')`;

    await conn.query(query);


  } else if (typeof preferredlocation != "string" && preferredlocation != undefined && department == "-select-") {

    let pl: string = "";
    for (let i = 0; i < preferredlocation.length; i++) {
      pl += preferredlocation[i] + ",";
    }

    pl = pl.slice(0, pl.length - 1);

    let query: string = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc) 
           VALUES('${result.insertId}','${pl}','${noticeperiod}','${expectedctc}','${currentctc}')`;

    await conn.query(query);


  } else if (typeof preferredlocation == "string" && preferredlocation != undefined && department != "-select-") {

    let query: string = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc,department) 
           VALUES('${result.insertId}','${preferredlocation}','${noticeperiod}','${expectedctc}','${currentctc}','${department}')`;

    await conn.query(query)



  } else if (typeof preferredlocation == "string" && preferredlocation != undefined && department == "-select-") {

    let query: string = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc) 
           VALUES('${result.insertId}','${preferredlocation}','${noticeperiod}','${expectedctc}','${currentctc}')`;

    await conn.query(query);


  } else if (preferredlocation == undefined && department != "-select-") {
    let query: string = `INSERT INTO preferences(emp_id,noticeperiod,expectedctc,currentctc,department) 
           VALUES('${result.insertId}','${noticeperiod}','${expectedctc}','${currentctc}','${department}')`;

    await conn.query(query);


  };
};

export default { jobAppForm, storeDetails };


