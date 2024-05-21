import { Router } from "express";
const router: Router = require("express").Router();
import auth from "../controllers/middleware/auth";
import cookieParser from "cookie-parser";
router.use(cookieParser());
import parser from "body-parser";
router.use(parser.json());
router.use(parser.urlencoded({ extended: false }));

import crudwithfile from "../controllers/crudWithFile";
import fetchDBtask from "../controllers/fetchFromDb";
import attendanceDetails from "../controllers/attendanceDetailsTask";
import resultSheet from "../controllers/resultSheet";
import dynamicQueryBox from "../controllers/dynamicQueryBox";
import searchBox from "../controllers/searchBox";
import delemitersearch from "../controllers/delemiterSearchTask";
import createcomponent from "../controllers/createComponentTask";
import fetchFromApi from "../controllers/fetchDataFromApi";
import jobappform from "../controllers/jobAppFormInsertion";
import timezone from "../controllers/timezone";
import nextformwithAJAX from "../controllers/nextform";




//javascripttask
router.get("/htmltask/:result", auth, require("../controllers/javaScriptTasks"));

//allfunctioninone
router.get("/function/:functionname", auth, require("../controllers/allFunctions"));

//crudwithfile
router.get("/form", auth, crudwithfile.form);
// router.route("/form").get(auth, crudwithfile.form);

router.post("/showall", auth, crudwithfile.showAll);

router.post("/submit", auth, crudwithfile.submit);

router.post("/alldetails", auth, crudwithfile.allDetails);

//fetchfromDB
router.get("/studentdetails", auth, fetchDBtask.studentDetails);

router.post("/home", auth, fetchDBtask.home);

router.post("/next", auth, fetchDBtask.next);

router.post("/previous", auth, fetchDBtask.previous);

router.post("/end", auth, fetchDBtask.end);

//attendancedetails
router.get("/attendancedetails", auth, attendanceDetails.attendanceDetails);

router.post("/attendancesheethome", auth, attendanceDetails.home);

router.post("/attendancesheetprevious", auth, attendanceDetails.previous);

router.post("/attendancesheetnext", auth, attendanceDetails.next);

router.post("/attendancesheetend", auth, attendanceDetails.end);

//resultsheet
router.get("/resultdetails", auth, resultSheet.resultDetails);

router.get("/viewdetails", auth, resultSheet.viewDeatils);

//dynamicQuerybox
router.get("/queryhome", auth, dynamicQueryBox.queryHome);

router.post("/querydetails", dynamicQueryBox.QueryDetails);

router.get("/pagination", auth, dynamicQueryBox.pagination);

//searchbox
router.get("/details", auth, searchBox.details);

router.post("/iddetails", auth, searchBox.idDetails);

router.post("/searchdetails", auth, searchBox.searchDetails);


//delemitersearchtask
router.get("/delemitersearchtask", auth, delemitersearch.delemiterSearchTask);

router.post("/delemitersearch", auth, delemitersearch.delemiterSearch);

//createcomponent
router.get("/createcomponenttask", auth, createcomponent.createComponentTask)

router.post("/createcomponent", auth, createcomponent.createComponent)

//fetchdatafromAPI
router.get("/fetchapi", auth, fetchFromApi.fetchApi)

router.get("/apialldetails", auth, fetchFromApi.fetchApiDetails)

//JobApplicationFormInsertion

router.get("/jobappform", auth, jobappform.jobAppForm)

router.post("/jobappformstoredetails", auth, jobappform.storeDetails)

//timeZone

router.get("/timezone", auth, timezone)

//nextformwithAJAX

router.get("/nextform", auth, nextformwithAJAX.nextform)

router.get("/id", auth, nextformwithAJAX.update)

router.post("/nextformstoredetails", auth, nextformwithAJAX.storeDetails)

export default router;
