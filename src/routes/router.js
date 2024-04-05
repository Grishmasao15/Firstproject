var router = require("express").Router();
const fs = require("fs");
const { auth } = require("../controllers/middleware/auth");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
var parser = require("body-parser");
router.use(parser.json());
router.use(parser.urlencoded({ extended: false }));

const f = require("../controllers/practical1");
const p = require("../controllers/practical2");
const q = require("../controllers/practical3");
const g = require("../controllers/practical4");
const h = require("../controllers/practical5");
const r = require("../controllers/practical6");
const s = require("../controllers/practical7");
const t = require("../controllers/practical8");
const crudwithfile = require("../controllers/crudWithFile");
const fetchDBtask = require("../controllers/fetchFromDb");
const attendanceDetails = require("../controllers/attendanceDetailsTask"); 
const resultSheet = require("../controllers/resultSheet");
const dynamicQueryBox = require("../controllers/dynamicQueryBox");
const searchBox = require("../controllers/searchBox");
const delemitersearch = require("../controllers/delemiterSearchTask");
const createcomponent = require("../controllers/createComponentTask");
const fetchFromApi = require("../controllers/fetchDataFromApi");
const jobappform = require("../controllers/jobAppFormInsertion");
const timezone = require("../controllers/timezone");
const nextformwithAJAX = require("../controllers/nextform");




//javascripttask
router.get("/htmltask/:result", auth, require("../controllers/javaScriptTasks"));

//allfunctioninone
router.get("/function/:functionname",auth,require("../controllers/allFunctions"));

//crudwithfile
router.get("/form", auth, crudwithfile.form);

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
router.get("/delemitersearchtask", auth,delemitersearch.delemiterSearchTask);

router.post("/delemitersearch",auth, delemitersearch.delemiterSearch);

//createcomponent
router.get("/createcomponenttask",auth, createcomponent.createComponentTask) 

router.post("/createcomponent",auth, createcomponent.createComponent) 

//fetchdatafromAPI
router.get("/fetchapi",auth, fetchFromApi.fetchApi)

router.get("/apialldetails",auth, fetchFromApi.fetchApiDetails)

//JobApplicationFormInsertion

router.get("/jobappform",auth, jobappform.jobAppForm)

router.post("/jobappformstoredetails",auth, jobappform.storeDetails)

//timeZone

router.get("/timezone",auth, timezone.timezone)

//nextformwithAJAX

router.get("/nextform",auth, nextformwithAJAX.nextform)

router.get("/id", auth, nextformwithAJAX.update)

router.post("/nextformstoredetails",auth, nextformwithAJAX.storeDetails)

module.exports = router;
