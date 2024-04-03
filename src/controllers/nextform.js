var router = require("express").Router();

const connection = require("../models/connection");
const { auth } = require("./middleware/auth");

var parser = require("body-parser");

router.use(parser.json());
router.use(parser.urlencoded({ extended: false }));


async function nextform(req, res)  {
  res.render("../src/views/nextform");
};

async function update(req, res) {
  return new Promise(async (resolve, reject) => {
    
    let id = req.query.id;
    
    if (id) {
      try{
      let query = `select count(*) as counter from basic_detail where emp_id=${req.query.id}`;

      let count = await connection.executeQuery(query);
      let counter=count[0].counter;


      if (counter >= 1) {
        console.log("in if");
        let r1 = await connection.executeQuery(`select * from basic_detail where emp_id=${req.query.id}`);
        let r2 = await connection.executeQuery(`select * from educationdetails where emp_id=${req.query.id}`);
        let r3 = await connection.executeQuery(`select * from work_experience where emp_id=${req.query.id}`);
        let r4 = await connection.executeQuery(`select * from languageknown where emp_id=${req.query.id}`);
        let r5 = await connection.executeQuery(`select * from technologyknown where emp_id=${req.query.id}`);
        let r6 = await connection.executeQuery(`select * from reference_contact where emp_id=${req.query.id}`);
        let r7 = await connection.executeQuery(`select * from preferences where emp_id=${req.query.id}`);
        
        let object = { r1: r1, r2: r2, r3: r3, r4: r4, r5: r5, r6: r6, r7: r7 ,counter:counter};
          return resolve(res.json(object));
        
      } else {
        console.log("not exist");
      }
      }

      catch(err){
        reject(err);
        console.log(err);
      }

    }
  });
};

async function storeDetails(req, res) {
  if (req.body.empid == "") {
    const {fname,lname,designation,address1,address2,city,phonenumber,email,gender,states,zipcode,relationshipstatus,DOB,companyname,pastdesignation,from,to,lang,hindi,english,gujarati,tech,php,mysql,laravel,oracle,name,contactnumber,relation,preferredlocation,noticeperiod,expectedctc,currentctc,department,
    } = req.body;

    //insertion in basic details
    let basicdetail = await connection.executeQuery(
      `INSERT INTO basic_detail SET fname = ?,lname = ?,designation = ?,address1 = ?,address2 = ?,city = ?,phonenumber = ?,email = ?,gender = ?,states = ?,zipcode = ?,relationshipstatus = ?,DOB = ?`,
      [fname,lname,designation,address1,address2,city,phonenumber,email,gender,states,zipcode,relationshipstatus,DOB]);
    console.log(basicdetail.insertId);

    //insertion in education details
    for (let i = 0; i < 4; i++) {
      if (req.body.nameofboard[i]) {
        let edudetail = await connection.executeQuery(
          `INSERT INTO educationdetails(emp_id,nameofboard_or_coursename,passingyear,percentage) VALUES('${basicdetail.insertId}','${req.body.nameofboard[i]}','${req.body.passingyear[i]}','${req.body.percentage[i]}')`
        );
      }
    }

    //insertion in work experience
    for (let i = 0; i < 3; i++) {
      if (req.body.companyname[i]) {
        let workexp = await connection.executeQuery(
          `INSERT INTO work_experience(emp_id,companyname,designation,from_date,to_date) VALUES('${basicdetail.insertId}','${req.body.companyname[i]}','${req.body.pastdesignation[i]}','${req.body.from[i]}','${req.body.to[i]}')`
        );
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

      let langknown = await connection.executeQuery(q4);
    } else if (req.body.lang != undefined) {
      var q4 = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

      for (let i = 0; i < 1; i++) {
        var a = req.body.lang;
        q4 += `(${basicdetail.insertId},'${req.body.lang}','${req.body[a]}')`;
      }

      let langknown = await connection.executeQuery(q4);
    }

    //insertion in technology known
    if (req.body.tech != undefined && typeof req.body.tech != "string") {
      var q5 = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

      for (let i = 0; i < req.body.tech.length; i++) {
        var b = req.body.tech[i];
        q5 += `(${basicdetail.insertId},'${req.body.tech[i]}','${req.body[b]}'),`;
      }

      q5 = q5.slice(0, q5.length - 1);
      let techknown = await connection.executeQuery(q5);
    } else if (req.body.tech != undefined) {
      var q5 = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

      for (let i = 0; i < 1; i++) {
        var b = req.body.tech;
        q5 += `(${basicdetail.insertId},'${req.body.tech}','${req.body[b]}')`;
      }

      let techknown = await connection.executeQuery(q5);
    }

    //insertion in reference contact
    for (let i = 0; i < 2; i++) {
      if (req.body.name[i]) {
        let refcontact =
          await connection.executeQuery(`INSERT INTO reference_contact(emp_id,nameof_emp,contactnumber,relation) 
    VALUES('${basicdetail.insertId}','${req.body.name[i]}','${req.body.contactnumber[i]}','${req.body.relation[i]}')`);
      }
    }

    //insertion in preferences

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

      var q12 = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc,department) 
            VALUES('${basicdetail.insertId}','${pl}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}','${req.body.department}')`;

      let pref = await connection.executeQuery(q12);

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

      var q12 = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc) 
            VALUES('${basicdetail.insertId}','${pl}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}')`;

      let pref = await connection.executeQuery(q12);

    } else if (
      typeof req.body.preferredlocation == "string" &&
      req.body.preferredlocation != undefined &&
      req.body.department != "-select-"
    ) {
      var q12 = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc,department) 
            VALUES('${basicdetail.insertId}','${req.body.preferredlocation}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}','${req.body.department}')`;

      let pref = await connection.executeQuery(q12);

    } else if (
      typeof req.body.preferredlocation == "string" &&
      req.body.preferredlocation != undefined &&
      req.body.department == "-select-"
    ) {
      var q12 = `INSERT INTO preferences(emp_id,preferredlocation,noticeperiod,expectedctc,currentctc) 
            VALUES('${basicdetail.insertId}','${req.body.preferredlocation}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}')`;

      let pref = await connection.executeQuery(q12);
   
    } ////
    else if (
      req.body.preferredlocation == undefined &&
      req.body.department != "-select-"
    ) {
      var q12 = `INSERT INTO preferences(emp_id,noticeperiod,expectedctc,currentctc,department) 
            VALUES('${basicdetail.insertId}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}','${req.body.department}')`;

      let pref = await connection.executeQuery(q12);

    } else if (
      req.body.preferredlocation == undefined &&
      req.body.department == "-select-"
    ) {
      var q12 = `INSERT INTO preferences(emp_id,noticeperiod,expectedctc,currentctc) 
            VALUES('${basicdetail.insertId}','${req.body.noticeperiod}','${req.body.expectedctc}','${req.body.currentctc}')`;

      let pref = await connection.executeQuery(q12);

    }
  } else {
 
    var id = req.body.empid;

    const {fname,lname,designation,address1,address2,city,phonenumber,email,gender,states,zipcode,relationshipstatus,DOB,companyname,pastdesignation,from,to,lang,hindi,english,gujarati,tech,php,mysql,laravel,oracle,name,contactnumber,relation,preferredlocation,noticeperiod,expectedctc,currentctc,department,
    } = req.body;

    //update in basic_detail
    let basicdetail = await connection.executeQuery(
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

    //update in education detail
    var q = await connection.executeQuery(
      `select education_id from educationdetails where emp_id=${id}`
    );

    for (let i = 0; i < 4; i++) {
      if (req.body.nameofboard[i]) {
        let edudetail = await connection.executeQuery(
          `UPDATE educationdetails SET nameofboard_or_coursename = '${req.body.nameofboard[i]}',passingyear = "${req.body.passingyear[i]}",percentage = "${req.body.percentage[i]}" WHERE education_id=${q[i].education_id}`
        );
      }
    }

    //update in work experience
    var que6 = await connection.executeQuery(
      `delete from work_experience where emp_id=${id}`
    );

    for (let i = 0; i < 3; i++) {
      if (req.body.companyname[i]) {
        let workexp = await connection.executeQuery(
          `INSERT INTO work_experience(emp_id,companyname,designation,from_date,to_date) VALUES('${id}','${req.body.companyname[i]}','${req.body.pastdesignation[i]}','${req.body.from[i]}','${req.body.to[i]}')`
        );
      }
    }

    //update in language known

    var que3 = await connection.executeQuery(
      `delete from languageknown where emp_id=${id}`
    );

    if (typeof req.body.lang != "string") {
      var q4 = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

      for (let i = 0; i < req.body.lang.length; i++) {
        var a = req.body.lang[i];
        q4 += `(${id},'${req.body.lang[i]}','${req.body[a]}'),`;
      }

      q4 = q4.slice(0, q4.length - 1);

      let langknown = await connection.executeQuery(q4);
    } else {
      var q4 = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

      for (let i = 0; i < 1; i++) {
        var a = req.body.lang;
        q4 += `(${id},'${req.body.lang}','${req.body[a]}')`;
      }

      let langknown = await connection.executeQuery(q4);
    }

    //update in technology known

    var que4 = await connection.executeQuery(
      `delete from technologyknown where emp_id=${id}`
    );

    if (req.body.tech.length && typeof req.body.tech != "string") {
      var q5 = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

      for (let i = 0; i < req.body.tech.length; i++) {
        var b = req.body.tech[i];
        q5 += `(${id},'${req.body.tech[i]}','${req.body[b]}'),`;
      }

      q5 = q5.slice(0, q5.length - 1);
      let techknown = await connection.executeQuery(q5);
    } else if (req.body.lang.length) {
      var q5 = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

      for (let i = 0; i < 1; i++) {
        var b = req.body.tech;
        q5 += `(${id},'${req.body.tech}','${req.body[b]}')`;
      }

      let techknown = await connection.executeQuery(q5);
    }

    //update in reference_contact

    var que5 = await connection.executeQuery(
      `delete from reference_contact where emp_id=${id}`
    );

    for (let i = 0; i < 2; i++) {
      if (req.body.name[i]) {
        let refcontact =
          await connection.executeQuery(`INSERT INTO reference_contact(emp_id,nameof_emp,contactnumber,relation) 
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
  

      var q12 = `UPDATE preferences SET preferredlocation='${pl}',noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}',department='${req.body.department}' WHERE emp_id=${id}`;

      let pref = await connection.executeQuery(q12);

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


      var q12 = `UPDATE preferences SET preferredlocation='${pl}',noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}' WHERE emp_id=${id}`;

      let pref = await connection.executeQuery(q12);
 
    } else if (
      typeof req.body.preferredlocation == "string" &&
      req.body.preferredlocation != undefined &&
      req.body.department != "-select-"
    ) {
      var q12 = `UPDATE preferences SET preferredlocation='${req.body.preferredlocation}',noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}',department='${req.body.department}' WHERE emp_id=${id}`;

      let pref = await connection.executeQuery(q12);

    } else if (
      typeof req.body.preferredlocation == "string" &&
      req.body.preferredlocation != undefined &&
      req.body.department == "-select-"
    ) {
      var q12 = `UPDATE preferences SET preferredlocation='${req.body.preferredlocation}',noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}' WHERE emp_id=${id}`;

      let pref = await connection.executeQuery(q12);

    } else if (
      req.body.preferredlocation == undefined &&
      req.body.department != "-select-"
    ) {
      var q12 = `UPDATE preferences SET noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}',department='${req.body.department}' WHERE emp_id=${id}`;

      let pref = await connection.executeQuery(q12);
 
    } else if (
      req.body.preferredlocation == undefined &&
      req.body.department == "-select-"
    ) {
      var q12 = `UPDATE preferences SET noticeperiod='${req.body.noticeperiod}',expectedctc='${req.body.expectedctc}',currentctc='${req.body.currentctc}' WHERE emp_id=${id}`;

      let pref = await connection.executeQuery(q12);

    }
  }
};

module.exports={nextform,update,storeDetails};
