var router = require("express").Router();

const connection = require("../models/connection");
const { auth } = require("./middleware/auth");



async function jobAppForm(req, res) {
  res.render("../src/views/jobappform");
};

async function storeDetails(req, res){

  const {fname,lname,designation,address1,address2,city,phonenumber,email,gender,states,zipcode,relationshipstatus,DOB,nameofboard,passingyear,percentage,companyname,pastdesignation,from,to,lang,hindi,english,gujarati,tech,php,mysql,laravel,oracle,name,contactnumber,relation,preferredlocation,noticeperiod,expectedctc,currentctc,department,
  } = req.body;

  //Basic Details Insertion

  let query = `INSERT INTO basic_detail SET fname = ?,lname = ?,designation = ?,address1 = ?,address2 = ?,city = ?,phonenumber = ?,email = ?,gender = ?,states = ?,zipcode = ?,relationshipstatus = ?,DOB = ?`;

  let result=await connection.executeQuery(query,[fname,lname,designation,address1,address2,city,phonenumber,email,gender,states,zipcode,relationshipstatus,DOB])


    

  //Education Details Insertion

  for (let i = 0; i < 4; i++) {
    let query = `INSERT INTO educationdetails(emp_id,nameofboard_or_coursename,passingyear,percentage) 
       VALUES('${result.insertId}','${nameofboard[i]}','${passingyear[i]}','${percentage[i]}')`
    if (nameofboard[i]) {
      await connection.executeQuery(query);
    }
  }

  // Work Experience Insertion

  for (let i = 0; i < 3; i++) {
    let query = `INSERT INTO work_experience(emp_id,companyname,designation,from_date,to_date) 
       VALUES('${result.insertId}','${companyname[i]}','${pastdesignation[i]}','${from[i]}','${to[i]}')`;
    if (companyname[i]) {
      await connection.executeQuery(query);
    }
  }

  //Language Insertion

      if (lang!=undefined && typeof lang != "string") {
        let query = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

        for (let i = 0; i < lang.length; i++) {
          let a = lang[i];
          query += `(${result.insertId},'${lang[i]}','${req.body[a]}'),`;
        }

        query = query.slice(0, query.length - 1);

        await connection.executeQuery(query)

      } else if (lang != undefined) {
        let query = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

        for (let i = 0; i < 1; i++) {
          let a = lang;
          query += `(${result.insertId},'${lang}','${req.body[a]}')`;
        }

        connection.con.query(query);
      }

      //Technology Insertion

      if (tech != undefined && typeof tech != "string") {
        let query = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

        for (let i = 0; i < tech.length; i++) {
          let b = tech[i];
          query += `(${result.insertId},'${tech[i]}','${req.body[b]}'),`;
        }

        query = query.slice(0, query.length - 1);
        await connection.executeQuery(query);

      } else if (tech != undefined) {
        let query = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

        for (let i = 0; i < 1; i++) {
          let b = tech;
          query += `(${result.insertId},'${tech}','${req.body[b]}')`;
        }

        await connection.executeQuery(query);
      }

      // Reference Contact Insertion

      for (let i = 0; i < 2; i++) {
        let query = `INSERT INTO reference_contact(emp_id,nameof_emp,contactnumber,relation) 
           VALUES('${result.insertId}','${req.body.name[i]}','${req.body.contactnumber[i]}','${req.body.relation[i]}')`;

        if (name[i]) {
          await connection.executeQuery(query);
        }
      }

      // Preferences Insertion


      if (typeof preferredlocation != "string" && preferredlocation != undefined &&department != "-select-") {

        let pl = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);

        let query = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc,department) 
           VALUES('${result.insertId}','${pl}','${noticeperiod}','${expectedctc}','${currentctc}','${department}')`;

        await connection.executeQuery(query);


      } else if (typeof preferredlocation != "string" && preferredlocation != undefined &&department == "-select-") {

        let pl = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);

        let query = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc) 
           VALUES('${result.insertId}','${pl}','${noticeperiod}','${expectedctc}','${currentctc}')`;

        await connection.executeQuery(query);


      } else if ( typeof preferredlocation == "string" &&  preferredlocation != undefined &&  department != "-select-") {

        let query = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc,department) 
           VALUES('${result.insertId}','${preferredlocation}','${noticeperiod}','${expectedctc}','${currentctc}','${department}')`;

        await connection.executeQuery(query)



      } else if ( typeof preferredlocation == "string" &&  preferredlocation != undefined &&  department == "-select-") {

        let query = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc) 
           VALUES('${result.insertId}','${preferredlocation}','${noticeperiod}','${expectedctc}','${currentctc}')`;

        await connection.executeQuery(query);


      } else if ( preferredlocation == undefined &&  department != "-select-") {
        let query = `INSERT INTO preferences(emp_id,noticeperiod,expectedctc,currentctc,department) 
           VALUES('${result.insertId}','${noticeperiod}','${expectedctc}','${currentctc}','${department}')`;

        await connection.executeQuery(query);


      };
};

module.exports = { jobAppForm, storeDetails };


