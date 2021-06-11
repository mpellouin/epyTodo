const jwt = require('jsonwebtoken');
require('dotenv').config();
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: `${process.env.MYSQL_HOST}`,
    user: `${process.env.MYSQL_USER}`,
    password: `${process.env.MYSQL_ROOT_PASSWORD}`,
    database: `${process.env.MYSQL_DATABASE}`
  });

async function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        req.mail = "no token";
        next();
        return ;
    }
    jwt.verify(token, process.env.SECRET, async (err, mail) => {
        if (err) {
            req.mail = "wrong token";
            next();
            return ;
        }
        connection.query(`SELECT email FROM user WHERE email = "${mail}"`, await function(err, result, fields) {
            if (result.length === 0) {
                req.mail = "wrong token";
            } else {
                req.mail = mail;
            }
            next();
            return ;
        });
    })
}

exports.auth = authToken;