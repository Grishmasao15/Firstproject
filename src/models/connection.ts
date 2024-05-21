import mysql from "mysql2";

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Registration_DB",
  dateStrings: true,
}).promise();

conn.connect().then(() => console.log("DB Connected")).catch((error) => console.log(error))

// const executeQuery = (str: string, arr: unknown) => {
//   return new Promise((resolve, reject) => {
//     conn.query(str, arr, (err, result) => {
//       try {
//         resolve(result);
//       }
//       catch (err) {
//         reject("error found");
//         console.log(err);
//       }
//     });
//   });
// }

export default conn;

