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
    
    let id = req.query.id;
    
    if (id) {
      try{
      let query = `select count(*) as counter from basic_detail where emp_id=${req.query.id}`;

      let count = await connection.executeQuery(query);
      let counter=count[0].counter;
      console.log(counter);


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
          res.send(object)
        
      } else {
        let str="id not exist";
        let object={str:str}
        res.send(object);
      }
      }

      catch(err){
        console.log(err);
      }

    }
};

async function storeDetails(req, res) {
  if (req.body.empid == "") {

    const {fname,lname,designation,address1,address2,city,phonenumber,email,gender,states,zipcode,relationshipstatus,DOB,nameofboard,passingyear,percentage,companyname,pastdesignation,from,to,lang,hindi,english,gujarati,tech,php,mysql,laravel,oracle,name,contactnumber,relation,preferredlocation,noticeperiod,expectedctc,currentctc,department,
    } = req.body;

    try{
      
      //Basic Details Insertion

      let query = `INSERT INTO basic_detail SET fname = ?,lname = ?,designation = ?,address1 = ?,address2 = ?,city = ?,phonenumber = ?,email = ?,gender = ?,states = ?,zipcode = ?,relationshipstatus = ?,DOB = ?`;

      let result = await connection.executeQuery(query, [fname,lname,designation,address1,address2,city,phonenumber,email,gender,states,zipcode,relationshipstatus,DOB]);

      //Education Details Insertion

      for (let i = 0; i < 4; i++) {
        let query = `INSERT INTO educationdetails SET emp_id = ?,nameofboard_or_coursename = ?,passingyear = ?,percentage = ?`;
        if (nameofboard[i]) {
          await connection.executeQuery(query, [result.insertId,nameofboard[i], passingyear[i],percentage[i]]);
        }
      }

      // Work Experience Insertion

      for (let i = 0; i < 3; i++) {
        let query = `INSERT INTO work_experience SET emp_id = ?,companyname = ?,designation = ?,from_date = ?,to_date = ?`;
        if (companyname[i]) {
          await connection.executeQuery(query, [result.insertId, companyname[i],pastdesignation[i],from[i],to[i]]);
        }
      }

      //Language Insertion

      if (lang != undefined && typeof lang != "string") {
        let query = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

        for (let i = 0; i < lang.length; i++) {
          let a = lang[i];
          query += `(${result.insertId},'${lang[i]}','${req.body[a]}'),`;
        }

        query = query.slice(0, query.length - 1);

        await connection.executeQuery(query);

      } else if (lang != undefined) {
        let query = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

          let a = lang;
          query += `(${result.insertId},'${lang}','${req.body[a]}')`;


        connection.executeQuery(query);
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

          let b = tech;
          query += `(${result.insertId},'${tech}','${req.body[b]}')`;


        await connection.executeQuery(query);
      }

      // Reference Contact Insertion

      for (let i = 0; i < 2; i++) {
        let query = `INSERT INTO reference_contact SET emp_id = ?,nameof_emp = ?,contactnumber = ?,relation = ?`;

        if (name[i]) {
          await connection.executeQuery(query, [result.insertId, name[i],contactnumber[i],relation[i]]);
        }
      }

      // Preferences Insertion

      if (  typeof preferredlocation != "string" &&  preferredlocation != undefined &&  department != "-select-") {
        let pl = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);

        let query = `INSERT INTO preferences SET emp_id = ?,preferredlocation = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?,department = ?`;

        await connection.executeQuery(query, [result.insertId, pl, noticeperiod,expectedctc,currentctc,department]);/////start with hereeee
        res.redirect("/nextform");

      } else if (  typeof preferredlocation != "string" &&  preferredlocation != undefined &&  department == "-select-") {
        let pl = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);

        let query = `INSERT INTO preferences SET emp_id = ?,preferredlocation = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?`;

        await connection.executeQuery(query, [result.insertId, pl, noticeperiod, expectedctc,currentctc]);
        res.redirect("/nextform");

      } else if (  typeof preferredlocation == "string" &&  preferredlocation != undefined &&  department != "-select-") {

        let query = `INSERT INTO preferences SET emp_id = ?,preferredlocation = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?,department = ?`;

        await connection.executeQuery(query,[result.insertId, preferredlocation, noticeperiod, expectedctc,currentctc,department]);
        res.redirect("/nextform");

      } else if (  typeof preferredlocation == "string" &&  preferredlocation != undefined &&  department == "-select-") {

        let query = `INSERT INTO preferences SET emp_id = ?,preferredlocation = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?`;

        await connection.executeQuery(query,[result.insertId, preferredlocation, noticeperiod, expectedctc,currentctc]);
        res.redirect("/nextform");

      } else if (preferredlocation == undefined && department != "-select-") {
        let query = `INSERT INTO preferences SET emp_id = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?,department = ?`;

        await connection.executeQuery(query,[result.insertId, noticeperiod, expectedctc,currentctc,department]);
        res.redirect("/nextform");

      }
    }
    catch(err){
      console.log(err);
    } 
 
  } else {
 
    let id = req.body.empid;

    const {fname,lname,designation,address1,address2,city,phonenumber,email,gender,states,zipcode,relationshipstatus,DOB,nameofboard,passingyear,percentage,companyname,pastdesignation,from,to,lang,hindi,english,gujarati,tech,php,mysql,laravel,oracle,name,contactnumber,relation,preferredlocation,noticeperiod,expectedctc,currentctc,department,
    } = req.body;
    
    try{

      //update in basic_detail
      let basicdetail = await connection.executeQuery(
        `UPDATE basic_detail SET fname = ?,lname = ?,designation = ?,address1 = ?,address2 = ?,city = ?,phonenumber = ?,email = ?,gender = ?,states = ?,zipcode = ?,relationshipstatus = ?,DOB = ? WHERE emp_id=?`,
        [fname,lname,designation,address1,address2,city,phonenumber,email,gender,states,zipcode,relationshipstatus,DOB,id]
      );

      //update in education detail
      let query1 = await connection.executeQuery(`select education_id from educationdetails where emp_id=?`,id);

      for (let i = 0; i < 4; i++) {
        if (nameofboard[i]) {
          let edudetail = await connection.executeQuery(
            `UPDATE educationdetails SET nameofboard_or_coursename = ?,passingyear = ?,percentage = ? WHERE education_id=?`,[nameofboard[i],passingyear[i],percentage[i],query1[i].education_id]);
        }
      }

      //update in work experience
      let query2 = await connection.executeQuery(`delete from work_experience where emp_id= ? `,id);

      for (let i = 0; i < 3; i++) {
        if (companyname[i]) {
          let workexp = await connection.executeQuery(`INSERT INTO work_experience SET emp_id = ?,companyname = ?,designation = ?,from_date = ?,to_date = ?`,[id, companyname[i], pastdesignation[i], from[i], to[i]]);
        }
      }

      //update in language known

      let query3 = await connection.executeQuery(`delete from languageknown where emp_id=?`,id);

      if (typeof lang!= "string" && lang != undefined) {
        let query = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

        for (let i = 0; i < lang.length; i++) {
          let a = lang[i];
          query += `(${id},'${lang[i]}','${req.body[a]}'),`;
        }

        query = query.slice(0, query.length - 1);

        let langknown = await connection.executeQuery(query);
      } else if (lang != undefined) {
        let query = `INSERT INTO languageknown(emp_id,language_name,rws) VALUES`;

          let a = lang;
          query += `(${id},'${lang}','${req.body[a]}')`;


        let langknown = await connection.executeQuery(query);
      }

      //update in technology known

      let query4 = await connection.executeQuery(`delete from technologyknown where emp_id=?`,id);

      if (tech != undefined && typeof tech != "string") {

        let query = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

        for (let i = 0; i < tech.length; i++) {
          let b = tech[i];
          query += `(${id},'${tech[i]}','${req.body[b]}'),`;
        }

        query = query.slice(0, query.length - 1);
        let techknown = await connection.executeQuery(query);

      } else if (tech != undefined) {
        let query = `INSERT INTO technologyknown(emp_id,technology_name,level_of_expertise) VALUES`;

        for (let i = 0; i < 1; i++) {
          let b = tech;
          query += `(${id},'${tech}','${req.body[b]}')`;
        }

        let techknown = await connection.executeQuery(query);
      }

      //update in reference_contact

      let query5 = await connection.executeQuery(`delete from reference_contact where emp_id=?`,id);

      for (let i = 0; i < 2; i++) {
        if (name[i]) {
          let refcontact =
            await connection.executeQuery(`INSERT INTO reference_contact SET emp_id = ?,nameof_emp = ?,contactnumber = ?,relation = ?`,[id,name[i],contactnumber[i],relation[i]]);
        }
      }

      //update in preferences

      if (  typeof preferredlocation != "string" &&  preferredlocation != undefined &&  department != "-select-") {
        let pl = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);
    

        let query = `UPDATE preferences SET preferredlocation = ?,noticeperiod = ?,expectedctc = ?,currentctc = ?,department= ? WHERE emp_id= ? `;
        let pref = await connection.executeQuery(query, [pl, noticeperiod, expectedctc,currentctc,department,id]);

      } else if ( typeof preferredlocation != "string" &&  preferredlocation != undefined &&  department == "-select-") {
        let pl = "";
        for (let i = 0; i < preferredlocation.length; i++) {
          pl += preferredlocation[i] + ",";
        }

        pl = pl.slice(0, pl.length - 1);


        let query = `UPDATE preferences SET preferredlocation=?,noticeperiod= ?,expectedctc= ?,currentctc=? WHERE emp_id= ?`;
        let pref = await connection.executeQuery(query,[pl, noticeperiod, expectedctc,currentctc,id]);
  
      } else if ( typeof preferredlocation == "string" &&  preferredlocation != undefined &&  department != "-select-") {

        let query = `UPDATE preferences SET preferredlocation=?,noticeperiod=?,expectedctc=?,currentctc=?,department=? WHERE emp_id=?`;
        let pref = await connection.executeQuery(query,[preferredlocation, noticeperiod, expectedctc,currentctc,department,id]);

      } else if (  typeof preferredlocation == "string" &&  preferredlocation != undefined &&  department == "-select-") {

        let query = `UPDATE preferences SET preferredlocation=?,noticeperiod=?,expectedctc=?,currentctc=? WHERE emp_id=?`;
        let pref = await connection.executeQuery(query,[preferredlocation, noticeperiod, expectedctc,currentctc,id]);

      } else if (  preferredlocation == undefined &&  department != "-select-") {

        let query = `UPDATE preferences SET noticeperiod=?,expectedctc=?,currentctc=?,department=? WHERE emp_id=?`;
        let pref = await connection.executeQuery(query,[noticeperiod, expectedctc,currentctc,department,id]);
  
      } 
    }
    catch(err){
      console.log(err);
    }
  }
};

module.exports={nextform,update,storeDetails};
