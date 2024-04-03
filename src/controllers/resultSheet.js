var router = require("express").Router();

const connection = require("../models/connection");
const { auth } = require("./middleware/auth");

var rescounter = 0;
var pagenumber = 1;


async function resultDetails(req, res) {

    var sort = req.query.sort;

    if (req.query.sort == undefined) {
      sort = "stu_id";
    } 
    else {
      sort = req.query.sort;
    }

    let sql = `select student_master.stu_id,student_master.firstname,student_master.lastname, 
                sum(distinct if(result_master.exam_id='1',result_master.practical_obtained,null) ) as terminal_practical,
                sum(distinct if(result_master.exam_id='1',result_master.theory_obtained,null) ) as theory_practical, 
                sum(distinct if(result_master.exam_id='2',result_master.practical_obtained,null) ) as prelim_practical, 
                sum(distinct if(result_master.exam_id='2',result_master.theory_obtained,null) ) as prelim_theory, 
                sum(distinct if(result_master.exam_id='3',result_master.practical_obtained,null) ) as final_practical, 
                sum(distinct if(result_master.exam_id='3',result_master.theory_obtained,null) ) as final_theory 
                from student_master
                INNER JOIN result_master 
                ON student_master.stu_id=result_master.stu_id
                group by student_master.stu_id
                order by ${sort}
                limit 50 offset ? `;

    if (req.query.id == undefined) {
      rescounter = 0;
      pagenumber = 1;

      let result=await connection.executeQuery(sql, [rescounter]);
      res.render("../src/views/result2", {data: result,pagenumber: pagenumber,rescounter: rescounter});

    } else if (req.query.id == "next") {
      rescounter = parseInt(req.query.rescounter) + 50;
      pagenumber = parseInt(req.query.pagenumber) + 1;
      let result= await connection.executeQuery(sql, [rescounter]);
      pagenumber = rescounter / 50 + 1;
      res.render("../src/views/result2", {  data: result,  pagenumber: pagenumber,  rescounter: rescounter});


    } else if (req.query.id == "prev") {
      rescounter = parseInt(req.query.rescounter) - 50;
      pagenumber = parseInt(req.query.pagenumber) - 1;
      pagenumber = rescounter / 50 + 1;
      let result=await connection.executeQuery(sql, [rescounter])
      res.render("../src/views/result2", {  data: result,  pagenumber: pagenumber,  rescounter: rescounter});


    } else if (req.query.id == "end") {
      rescounter = 150;
      pagenumber = rescounter / 50 + 1;
      let result =await connection.executeQuery(sql, [rescounter]);
      res.render("../src/views/result2", {  data: result,  pagenumber: pagenumber,  rescounter: rescounter});


    } else if (req.query.id == "home") {
      rescounter = 0;
      pagenumber = rescounter / 50 + 1;
      let result = await connection.executeQuery(sql, [rescounter]);
      res.render("../src/views/result2", {  data: result,  pagenumber: pagenumber,  rescounter: rescounter});
    }
  
};

async function viewDeatils (req, res) {
    let id = req.query.id;
    let sql = `select student_master.stu_id,student_master.firstname,student_master.lastname,subject_master.subject_id,subject_master.subject_name,
             max(case when result_master.exam_id='1' then result_master.practical_obtained end)as terminal_practical,
             max(case when result_master.exam_id='2' then result_master.practical_obtained end)as prelims_practical,
             max(case when result_master.exam_id='3' then result_master.practical_obtained end)as final_practical,
             max(case when result_master.exam_id='1' then result_master.theory_obtained end)as terminal_theory,
             max(case when result_master.exam_id='2' then result_master.theory_obtained end)as prelims_theory,
             max(case when result_master.exam_id='3' then result_master.theory_obtained end)as final_theory 
             from student_master
             join result_master on student_master.stu_id=result_master.stu_id
             join subject_master on result_master.subject_id=subject_master.subject_id
             where student_master.stu_id=${id}
             group by student_master.stu_id,student_master.firstname,student_master.lastname,subject_master.subject_id,subject_master.subject_name;`;

    let result = await connection.executeQuery(sql)
    res.render("../src/views/viewdetail2", { data: result });
};

module.exports = { resultDetails, viewDeatils };

