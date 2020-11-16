/**
 * A basic web application that listens on port 8080.
 *
 * - GET / queries the database for 1+1 and returns the result
 * along with the listing of all items in the user's home directory.
 */
const express = require("express");
const mysql = require("mysql2");
const fs = require("fs");

const homedir = require("os").homedir();
// const items = fs.readdirSync(homedir, { withFileTypes: true });
const items = fs.readdirSync(homedir); // fail quickly if could not read home directory

const app = express();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: "dockerize-it-sample", // ideally use .env to store sensitive information
  database: "dockerize-it-sample",
  password: "dockerize-it-sample",
});

app.get("/", function (req, res) {
  try {
    connection.query("SELECT 1+1 as test", function (err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available

      if (err) {
        console.error(err);
        res.send(`${JSON.stringify(err)}`);
        return;
      }

      const response = `
      <html>
        <head></head>
        <body>
          <p>
          Database says 1+1 is ${results[0].test}.
          </p>
          <p>
          Home directory contents:
          </p>
          <pre>
          ${JSON.stringify(items)}
          </pre>
        </body>
      </html>
      `;

      res.send(response);
    });
  } catch (err) {
    console.error(err);
    res.send(`${JSON.stringify(err)}`);
  }
});

const server = app.listen(8080, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Listening at http://${host}:${port}`);
});
