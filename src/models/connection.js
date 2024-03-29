const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Registration_DB",
  dateStrings: "date",
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected Database");
});

var executeQuery = (str, arr)=> {
  return new Promise((resolve, reject) => {
    con.query(str, arr, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

module.exports = {con, executeQuery };
