const express = require('express');
const mysql = require('mysql');
const Memcached = require('memcached');
const app = express();
const port = 3000;

// connect to mysql
let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "todo",
});

let memcached = new Memcached("localhost:11211")

let memcachedMiddleware = (req, res, next) => {
    let key = "__express__" + req.url;
    memcached.get(key, function(err, data) {
        if (data) {
            res.send(data);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                memcached.set(key, body, (1 * 60), function (err) {
                    //
                });
                res.sendResponse(body);
            }
            next();
        }
    })
}

app.get("/todos", memcachedMiddleware, (req, res) => {
    let sql = "SELECT * FROM todos";
    let query = conn.query(sql,(err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
})

app.listen(port, () => {
    console.log("Server started on port " + port);
})
