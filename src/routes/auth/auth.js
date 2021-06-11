const path = require('path');
const parser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = mysql.createConnection({
    host: `${process.env.MYSQL_HOST}`,
    user: `${process.env.MYSQL_USER}`,
    password: `${process.env.MYSQL_ROOT_PASSWORD}`,
    database: `${process.env.MYSQL_DATABASE}`
  });

exports.postregister = async (req, res) => {
    const obj = JSON.parse(JSON.stringify(req.body));
    if (verifyFieldsReg(req) == -1) {
        res.status(409).json({ msg: "internal server error" });
        return (84);
    }
    const hashedPasswd = await bcrypt.hash(req.body.password, 10);
    if (!verifyEmail(req.body.email)) {
        res.status(409).json({ msg: "internal server error" });
        return (84);
    }
    connection.query("SELECT email FROM user WHERE email = '"+ req.body.email.toLowerCase() +"'", function(err, result, field) {
        if(result.length === 0){
            connection.query(`INSERT INTO user (email, password, name, firstname) VALUES ("${req.body.email.toLowerCase()}",
            "${hashedPasswd}", "${req.body.name}", "${req.body.firstname}")`, function(err) {
                if (err) {
                    res.status(500).json({ msg: "internal server error" });
                }
            });
            const token = jwt.sign(req.body.email.toLowerCase(), process.env.SECRET);
            res.status(201).json({ token: token });
        } else {  
            res.status(409).json({ msg: "account already exists" });
        }
    })
}

exports.postlogin = async (req, res) => {
    if (verifyFieldsLog(req) == -1) {
        res.status(400).json({ msg: "Invalid credentials" });
        return (84);
    }
    connection.query("SELECT email FROM user WHERE email = '"+ req.body.email.toLowerCase() +"'", function(err, result, field) {
        if (result.length === 0) {
            res.status(400).json({ msg: "Invalid credentials" });
            return (84);
        } else {
            connection.query(`SELECT password FROM user WHERE email = "${req.body.email.toLowerCase()}"`, [], async function(err, results, test) {
            const pass = results[0].password;
            if (err) {
                pass = "ye";
            }
            try {
                if (await bcrypt.compare(req.body.password, pass)) {
                    const token = jwt.sign(req.body.email.toLowerCase(), process.env.SECRET);
                    res.status(201).json({ token: token });
                } else {
                    res.status(400).json({ msg: "Invalid credentials" });
                }
            } catch {
                res.status(500).json({ msg: "internal server error" });
            }
        })
    }});
}


function verifyFieldsReg(req) {
    if ((typeof req.body.name !== 'undefined' && req.body.name) &&
    (typeof req.body.firstname !== 'undefined' && req.body.firstname) &&
    (typeof req.body.password !== 'undefined' && req.body.password) &&
    (typeof req.body.email !== 'undefined' && req.body.email))
        return (0);
    else
        return (-1);
}

function verifyFieldsLog(req) {
    if ((typeof req.body.password !== 'undefined' && req.body.password) &&
    (typeof req.body.email !== 'undefined' && req.body.email))
        return (0);
    else
        return (-1);
}

function verifyEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}