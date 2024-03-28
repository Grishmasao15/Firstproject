var router = require("express").Router();

const connection = require("../models/connection");

var parser = require("body-parser");

router.use(parser.json());
router.use(parser.urlencoded({ extended: false }));


router.get("/jobappform", function (req, res) {
  res.render("../src/views/jobappform");
});

router.post("/jobappformstoredetails", async (req, res) => {
  const {
    fname,
    lname,
    designation,
    address1,
    address2,
    city,
    phonenumber,
    email,
    gender,
    states,
    zipcode,
    relationshipstatus,
    DOB,
    companyname,
    pastdesignation,
    from,
    to,
    lang,
    hindi,
    english,
    gujarati,
    tech,
    php,
    mysql,
    laravel,
    oracle,
    name,
    contactnumber,
    relation,
    preferredlocation,
    noticeperiod,
    expectedctc,
    currentctc,
    department,
  } = req.body;

  //Basic Details Insertion

  var q1 = `INSERT INTO basic_detail SET fname = ?,lname = ?,designation = ?,address1 = ?,address2 = ?,city = ?,phonenumber = ?,email = ?,gender = ?,states = ?,zipcode = ?,relationshipstatus = ?,DOB = ?`;

  connection.con.query(
    q1,
    [
      fname,
      lname,
      designation,
      address1,
      address2,
      city,
      phonenumber,
      email,
      gender,
      states,
      zipcode,
      relationshipstatus,
      DOB,
    ],
    function (err, result) {
      if (err) throw err;
      console.log("data inserted successfully in basic detail");
      console.log(result.insertId);

      //Education Details Insertion

      for (let i = 0; i < 4; i++) {
        var q2 = `INSERT INTO educationdetails(emp_id,nameofboard_or_coursename,passingyear,percentage) 
           VALUES('${result.insertId}','${req.body.nameofboard[i]}','${req.body.passingyear[i]}','${req.body.percentage[i]}')`;

        if (req.body.nameofboard[i]) {
          connection.con.query(q2, (err, result) => {
            if (err) throw err;
            console.log("data inserted successfully in education details");
          });
        }
      }

      // Work Experience Insertion

      for (let i = 0; i < 3; i++) {
        var q3 = `INSERT INTO work_experience(emp_id,companyname,designation,from_date,to_date) 
           VALUES('${result.insertId}','${req.body.companyname[i]}','${req.body.pastdesignation[i]}','${req.body.from[i]}','${req.body.to[i]}')`;

        if (req.body.companyname[i]) {
          connection.con.query(q3, (err, result) => {
            if (err) throw err;
            console.log("data inserted successfully in work experience");
          });
        }
      }

      //Language Insertion

      if (req.body.lang.length && typeof req.body.lang != "string") {
        var q4 = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

        for (let i = 0; i < req.body.lang.length; i++) {
          var a = req.body.lang[i];
          console.log(req.body.lang);
          q4 += `(${result.insertId},'${req.body.lang[i]}','${req.body[a]}'),`;
        }

        q4 = q4.slice(0, q4.length - 1);
        console.log(q4);

        connection.con.query(q4, (err, result) => {
          if (err) throw err;
          console.log("data inserted successfully in languageknown");
        });
      } else if (req.body.lang.length) {
        var q4 = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

        for (let i = 0; i < 1; i++) {
          var a = req.body.lang;
          q4 += `(${result.insertId},'${req.body.lang}','${req.body[a]}')`;
        }

        console.log(q4);
        console.log("in else");
        connection.con.query(q4, (err, result) => {
          if (err) throw err;
          console.log("data inserted successfully in languageknown");
        });
      }

      //Technology Insertion

      if (req.body.tech.length && typeof req.body.tech != "string") {
        var q5 = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

        for (let i = 0; i < req.body.tech.length; i++) {
          var b = req.body.tech[i];
          q5 += `(${result.insertId},'${req.body.tech[i]}','${req.body[b]}'),`;
        }

        q5 = q5.slice(0, q5.length - 1);
        console.log(q5);
        connection.con.query(q5, (err, result) => {
          if (err) throw err;
          console.log("data inserted successfully in technologyknown");
        });
      } else if (req.body.lang.length) {
        var q5 = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

        for (let i = 0; i < 1; i++) {
          var b = req.body.tech;
          q5 += `(${result.insertId},'${req.body.tech}','${req.body[b]}')`;
        }

        console.log(q5);
        console.log("in else");
        connection.con.query(q5, (err, result) => {
          if (err) throw err;
          console.log("data inserted successfully in technologyknown");
        });
      }

      // Reference Contact Insertion

      for (let i = 0; i < 2; i++) {
        var q11 = `INSERT INTO reference_contact(emp_id,nameof_emp,contactnumber,relation) 
           VALUES('${result.insertId}','${req.body.name[i]}','${req.body.contactnumber[i]}','${req.body.relation[i]}')`;

        if (req.body.name[i]) {
          connection.con.query(q11, (err, result) => {
            if (err) throw err;
            console.log("data inserted successfully in reference_contact");
          });
        }
      }

      // Preferences Insertion

      console.log(preferredlocation);

      if (
        typeof req.body.preferredlocation != "string" &&
        req.body.preferredlocation != undefined &&
        req.body.department != "-select-"
      ) {
        var pl = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += req.body.preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);
        console.log(pl);

        var q12 = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc,department) 
           VALUES('${result.insertId}','${pl}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}','${req.body.department}')`;

        connection.con.query(q12, (err, result) => {
          if (err) throw err;
          console.log("first");
          console.log("data inserted successfully in preferences");
        });
        res.redirect("/jobappform");
      } else if (
        typeof req.body.preferredlocation != "string" &&
        req.body.preferredlocation != undefined &&
        req.body.department == "-select-"
      ) {
        var pl = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += req.body.preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);
        console.log(pl);

        var q12 = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc) 
           VALUES('${result.insertId}','${pl}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}')`;

        connection.con.query(q12, (err, result) => {
          if (err) throw err;
          console.log("second");
          console.log("data inserted successfully in preferences");
          res.redirect("/jobappform");
        });
      } else if (
        typeof req.body.preferredlocation == "string" &&
        req.body.preferredlocation != undefined &&
        req.body.department != "-select-"
      ) {
        var q12 = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc,department) 
           VALUES('${result.insertId}','${req.body.preferredlocation}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}','${req.body.department}')`;

        connection.con.query(q12, (err, result) => {
          if (err) throw err;
          console.log("third");
          console.log("data inserted successfully in preferences");
          res.redirect("/jobappform");
        });
      } else if (
        typeof req.body.preferredlocation == "string" &&
        req.body.preferredlocation != undefined &&
        req.body.department == "-select-"
      ) {
        var q12 = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc) 
           VALUES('${result.insertId}','${req.body.preferredlocation}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}')`;

        connection.con.query(q12, (err, result) => {
          if (err) throw err;
          console.log("fourth");
          console.log("data inserted successfully in preferences");
          res.redirect("/jobappform");
        });
      } else if (
        req.body.preferredlocation == undefined &&
        req.body.department != "-select-"
      ) {
        var q12 = `INSERT INTO preferences(emp_id,noticeperiod,expectedctc,currentctc,department) 
           VALUES('${result.insertId}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}','${req.body.department}')`;

        connection.con.query(q12, (err, result) => {
          if (err) throw err;
          console.log("fifth");
          console.log("data inserted successfully in preferences");
          res.redirect("/jobappform");
        });
      } else if (
        req.body.preferredlocation == undefined &&
        req.body.department == "-select-"
      ) {
        var q12 = `INSERT INTO preferences(emp_id,noticeperiod,expectedctc,currentctc) 
           VALUES('${result.insertId}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}')`;

        connection.con.query(q12, (err, result) => {
          if (err) throw err;
          console.log("sixth");
          console.log("data inserted successfully in preferences");
          res.redirect("/jobappform");
        });
      }
    }
  );
});

module.exports=router;


