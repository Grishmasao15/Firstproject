var router = require("express").Router();

const connection = require("../models/connection");

var parser = require("body-parser");

router.use(parser.json());
router.use(parser.urlencoded({ extended: false }));

function executeQuery(str, arr) {
  return new Promise((resolve, reject) => {
    connection.con.query(str, arr, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

router.get("/nextform", (req, res) => {
  res.render("../src/views/nextform");
});

router.get("/id", async (req, res) => {
  return new Promise(async (resolve, rejects) => {
    var id = req.query.id;
    console.log(id);
    if (req.query.id) {
      var que = `select count(*) as counter from basic_detail where emp_id=${req.query.id}`;
      console.log(que);
      let count = await executeQuery(que);
      console.log(count);

      if (count[0].counter >= 1) {
        var r1 = await executeQuery(
          `select * from basic_detail where emp_id=${req.query.id}`
        );
        var r2 = await executeQuery(
          `select * from educationdetails where emp_id=${req.query.id}`
        );
        var r3 = await executeQuery(
          `select * from work_experience where emp_id=${req.query.id}`
        );
        var r4 = await executeQuery(
          `select * from languageknown where emp_id=${req.query.id}`
        );
        console.log(r4);
        var r5 = await executeQuery(
          `select * from technologyknown where emp_id=${req.query.id}`
        );

        var r6 = await executeQuery(
          `select * from reference_contact where emp_id=${req.query.id}`
        );
        var r7 = await executeQuery(
          `select * from preferences where emp_id=${req.query.id}`
        );
        console.log(r7);
      }
      var object = { r1: r1, r2: r2, r3: r3, r4: r4, r5: r5, r6: r6, r7: r7 };
      return resolve(res.json(object));
    }
  });
});

router.post("/nextformstoredetails", async (req, res) => {
  if (req.body.empid == "") {
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

    //insertion in basic details
    let basicdetail = await executeQuery(
      `INSERT INTO basic_detail SET fname = ?,lname = ?,designation = ?,address1 = ?,address2 = ?,city = ?,phonenumber = ?,email = ?,gender = ?,states = ?,zipcode = ?,relationshipstatus = ?,DOB = ?`,
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
      ]
    );
    console.log("data successfully inserted in Basic details");
    console.log(basicdetail.insertId);

    //insertion in education details
    for (let i = 0; i < 4; i++) {
      if (req.body.nameofboard[i]) {
        let edudetail = await executeQuery(
          `INSERT INTO educationdetails(emp_id,nameofboard_or_coursename,passingyear,percentage) VALUES('${basicdetail.insertId}','${req.body.nameofboard[i]}','${req.body.passingyear[i]}','${req.body.percentage[i]}')`
        );
        console.log("data successfully inserted in education details");
      }
    }

    //insertion in work experience
    for (let i = 0; i < 3; i++) {
      if (req.body.companyname[i]) {
        let workexp = await executeQuery(
          `INSERT INTO work_experience(emp_id,companyname,designation,from_date,to_date) VALUES('${basicdetail.insertId}','${req.body.companyname[i]}','${req.body.pastdesignation[i]}','${req.body.from[i]}','${req.body.to[i]}')`
        );
        console.log("data successfully inserted in work experience");
      }
    }

    //insertion in language known
    if (req.body.lang != undefined && typeof req.body.lang != "string") {
      var q4 = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

      for (let i = 0; i < req.body.lang.length; i++) {
        var a = req.body.lang[i];
        q4 += `(${basicdetail.insertId},'${req.body.lang[i]}','${req.body[a]}'),`;
      }

      q4 = q4.slice(0, q4.length - 1);

      let langknown = await executeQuery(q4);
      console.log("data successfully inserted in lang known");
    } else if (req.body.lang != undefined) {
      var q4 = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

      for (let i = 0; i < 1; i++) {
        var a = req.body.lang;
        q4 += `(${basicdetail.insertId},'${req.body.lang}','${req.body[a]}')`;
      }
      console.log("in else");

      let langknown = await executeQuery(q4);
      console.log("data successfully inserted in lang known");
    }

    //insertion in technology known
    if (req.body.tech != undefined && typeof req.body.tech != "string") {
      var q5 = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

      for (let i = 0; i < req.body.tech.length; i++) {
        var b = req.body.tech[i];
        q5 += `(${basicdetail.insertId},'${req.body.tech[i]}','${req.body[b]}'),`;
      }

      q5 = q5.slice(0, q5.length - 1);
      let techknown = await executeQuery(q5);
      console.log("data inserted successfully in technologyknown");
    } else if (req.body.tech != undefined) {
      var q5 = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

      for (let i = 0; i < 1; i++) {
        var b = req.body.tech;
        q5 += `(${basicdetail.insertId},'${req.body.tech}','${req.body[b]}')`;
      }

      console.log(q5);
      console.log("in else");
      let techknown = await executeQuery(q5);
      console.log("data inserted successfully in technologyknown");
    }

    //insertion in reference contact
    for (let i = 0; i < 2; i++) {
      if (req.body.name[i]) {
        let refcontact =
          await executeQuery(`INSERT INTO reference_contact(emp_id,nameof_emp,contactnumber,relation) 
    VALUES('${basicdetail.insertId}','${req.body.name[i]}','${req.body.contactnumber[i]}','${req.body.relation[i]}')`);
      }
    }

    //insertion in preferences
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
            VALUES('${basicdetail.insertId}','${pl}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}','${req.body.department}')`;

      let pref = await executeQuery(q12);
      console.log("first");
      console.log("data inserted successfully in preferences");
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
            VALUES('${basicdetail.insertId}','${pl}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}')`;

      let pref = await executeQuery(q12);
      console.log("second");
      console.log("data inserted successfully in preferences");
    } else if (
      typeof req.body.preferredlocation == "string" &&
      req.body.preferredlocation != undefined &&
      req.body.department != "-select-"
    ) {
      var q12 = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc,department) 
            VALUES('${basicdetail.insertId}','${req.body.preferredlocation}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}','${req.body.department}')`;

      let pref = await executeQuery(q12);
      console.log("third");
      console.log("data inserted successfully in preferences");
    } else if (
      typeof req.body.preferredlocation == "string" &&
      req.body.preferredlocation != undefined &&
      req.body.department == "-select-"
    ) {
      var q12 = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc) 
            VALUES('${basicdetail.insertId}','${req.body.preferredlocation}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}')`;

      let pref = await executeQuery(q12);
      console.log("fourth");
      console.log("data inserted successfully in preferences");
    } ////
    else if (
      req.body.preferredlocation == undefined &&
      req.body.department != "-select-"
    ) {
      var q12 = `INSERT INTO preferences(emp_id,noticeperiod,expectedctc,currentctc,department) 
            VALUES('${basicdetail.insertId}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}','${req.body.department}')`;

      let pref = await executeQuery(q12);
      console.log("fifth");
      console.log("data inserted successfully in preferences");
    } else if (
      req.body.preferredlocation == undefined &&
      req.body.department == "-select-"
    ) {
      var q12 = `INSERT INTO preferences(emp_id,noticeperiod,expectedctc,currentctc) 
            VALUES('${basicdetail.insertId}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}')`;

      let pref = await executeQuery(q12);
      console.log("sixth");
      console.log("data inserted successfully in preferences");
    }
  } else {
    console.log("in update");
    var id = req.body.empid;
    console.log(id);
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

    //update in basic_detail
    let basicdetail = await executeQuery(
      `UPDATE basic_detail SET fname = ?,lname = ?,designation = ?,address1 = ?,address2 = ?,city = ?,phonenumber = ?,email = ?,gender = ?,states = ?,zipcode = ?,relationshipstatus = ?,DOB = ? WHERE emp_id=${id}`,
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
      ]
    );
    console.log("data successfully updated in Basic details");

    //update in education detail
    var q = await executeQuery(
      `select education_id from educationdetails where emp_id=${id}`
    );

    for (let i = 0; i < 4; i++) {
      if (req.body.nameofboard[i]) {
        let edudetail = await executeQuery(
          `UPDATE educationdetails SET nameofboard_or_coursename = '${req.body.nameofboard[i]}',passingyear = "${req.body.passingyear[i]}",percentage = "${req.body.percentage[i]}" WHERE education_id=${q[i].education_id}`
        );
        console.log("data successfully updated in education details");
      }
    }

    //update in work experience
    var que6 = await executeQuery(
      `delete from work_experience where emp_id=${id}`
    );

    for (let i = 0; i < 3; i++) {
      if (req.body.companyname[i]) {
        let workexp = await executeQuery(
          `INSERT INTO work_experience(emp_id,companyname,designation,from_date,to_date) VALUES('${id}','${req.body.companyname[i]}','${req.body.pastdesignation[i]}','${req.body.from[i]}','${req.body.to[i]}')`
        );
        console.log("data successfully updated in work experience");
      }
    }

    //update in language known

    var que3 = await executeQuery(
      `delete from languageknown where emp_id=${id}`
    );

    if (typeof req.body.lang != "string") {
      var q4 = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

      for (let i = 0; i < req.body.lang.length; i++) {
        var a = req.body.lang[i];
        q4 += `(${id},'${req.body.lang[i]}','${req.body[a]}'),`;
      }

      q4 = q4.slice(0, q4.length - 1);

      let langknown = await executeQuery(q4);
      console.log("one data successfully updated in lang known");
    } else {
      var q4 = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

      for (let i = 0; i < 1; i++) {
        var a = req.body.lang;
        q4 += `(${id},'${req.body.lang}','${req.body[a]}')`;
      }
      console.log("in else");

      let langknown = await executeQuery(q4);
      console.log(" two data successfully updated in lang known");
    }

    //update in technology known

    var que4 = await executeQuery(
      `delete from technologyknown where emp_id=${id}`
    );

    if (req.body.tech.length && typeof req.body.tech != "string") {
      var q5 = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

      for (let i = 0; i < req.body.tech.length; i++) {
        var b = req.body.tech[i];
        q5 += `(${id},'${req.body.tech[i]}','${req.body[b]}'),`;
      }

      q5 = q5.slice(0, q5.length - 1);
      let techknown = await executeQuery(q5);
      console.log("data updated successfully in technologyknown");
    } else if (req.body.lang.length) {
      var q5 = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

      for (let i = 0; i < 1; i++) {
        var b = req.body.tech;
        q5 += `(${id},'${req.body.tech}','${req.body[b]}')`;
      }

      console.log("in else");
      let techknown = await executeQuery(q5);
      console.log("data updated successfully in technologyknown");
    }

    //update in reference_contact

    var que5 = await executeQuery(
      `delete from reference_contact where emp_id=${id}`
    );

    for (let i = 0; i < 2; i++) {
      if (req.body.name[i]) {
        let refcontact =
          await executeQuery(`INSERT INTO reference_contact(emp_id,nameof_emp,contactnumber,relation) 
            VALUES('${id}','${req.body.name[i]}','${req.body.contactnumber[i]}','${req.body.relation[i]}')`);
      }
    }

    //update in preferences

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

      var q12 = `UPDATE preferences SET preferredlocation='${pl}',noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}',department='${req.body.department}' WHERE emp_id=${id}`;

      let pref = await executeQuery(q12);
      console.log("first");
      console.log("data updated successfully in preferences");
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

      var q12 = `UPDATE preferences SET preferredlocation='${pl}',noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}' WHERE emp_id=${id}`;

      let pref = await executeQuery(q12);
      console.log("second");
      console.log("data updated successfully in preferences");
    } else if (
      typeof req.body.preferredlocation == "string" &&
      req.body.preferredlocation != undefined &&
      req.body.department != "-select-"
    ) {
      var q12 = `UPDATE preferences SET preferredlocation='${req.body.preferredlocation}',noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}',department='${req.body.department}' WHERE emp_id=${id}`;

      let pref = await executeQuery(q12);
      console.log("third");
      console.log("data updated successfully in preferences");
    } else if (
      typeof req.body.preferredlocation == "string" &&
      req.body.preferredlocation != undefined &&
      req.body.department == "-select-"
    ) {
      var q12 = `UPDATE preferences SET preferredlocation='${req.body.preferredlocation}',noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}' WHERE emp_id=${id}`;

      let pref = await executeQuery(q12);
      console.log("fourth");
      console.log("data updated successfully in preferences");
    } else if (
      req.body.preferredlocation == undefined &&
      req.body.department != "-select-"
    ) {
      var q12 = `UPDATE preferences SET noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}',department='${req.body.department}' WHERE emp_id=${id}`;

      let pref = await executeQuery(q12);
      console.log("fifth");
      console.log("data updated successfully in preferences");
    } else if (
      req.body.preferredlocation == undefined &&
      req.body.department == "-select-"
    ) {
      var q12 = `UPDATE preferences SET noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}' WHERE emp_id=${id}`;

      let pref = await executeQuery(q12);
      console.log("sixth");
      console.log("data updated successfully in preferences");
    }
  }
});

module.exports=router;
