const noToken = "no token";
const wrongToken = "wrong token";
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const connection = mysql.createConnection({
    host: `${process.env.MYSQL_HOST}`,
    user: `${process.env.MYSQL_USER}`,
    password: `${process.env.MYSQL_ROOT_PASSWORD}`,
    database: `${process.env.MYSQL_DATABASE}`
  });

exports.user = (req, res) => {
    if (verifToken(res, req) != 42) {
        if (verifToken(res, req) == -1) {
            res.status(401).json({ msg: "No token, authorization denied" });
        } else {
            res.status(401).json({ msg: "Token is not valid" });
        }
    } else {
        connection.query("SELECT * FROM user", function(err, result, field) {
            res.status(201).json(result);
        });
    }
}

exports.todos = (req, res) => {
    if (verifToken(res, req) != 42) {
        if (verifToken(res, req) == -1) {
            res.status(401).json({ msg: "No token, authorization denied" });
        } else {
            res.status(401).json({ msg: "Token is not valid" });
        }
    } else {
        connection.query("SELECT id FROM user WHERE email = '"+ req.mail +"'", function(err, result, field) {
            connection.query("SELECT * FROM todo WHERE user_id = '"+ result[0].id +"'", function(err, result, field) {
                res.status(201).json(result);
            });
        });
    }
}

exports.id = (req, res) => {
    if (verifToken(res, req) != 42) {
        if (verifToken(res, req) == -1) {
            res.status(401).json({ msg: "No token, authorization denied" });
        } else {
            res.status(401).json({ msg: "Token is not valid" });
        }
        return (0);
    }
    if (isNaN(req.params.id) == true) {
        connection.query("SELECT email FROM user WHERE email = '"+ req.params.id.toLowerCase() +"'", function(err, result, field) {
            if (result.length === 0) {
                res.status(404).json({ msg: "Not found" });
            } else {
                connection.query("SELECT * FROM user WHERE email = '"+ req.params.id.toLowerCase() +"'", function(err, result, field) {
                    res.status(201).json({ id: result[0].id, email: result[0].email, password: result[0].password, created_at: result[0].created_at, firstname: result[0].firstname,
                    name: result[0].name });
                });
            }
        });
    } else {
        connection.query("SELECT id FROM user WHERE id = '"+ req.params.id +"'", function(err, result, field) {
            if (result.length === 0) {
                res.status(404).json({ msg: "Not found" });
            } else {
                connection.query("SELECT * FROM user WHERE id = '"+ req.params.id +"'", async function(err, result, field) {
                    res.status(201).json({ id: result[0].id, email: result[0].email, password: result[0].password, created_at: result[0].created_at, firstname: result[0].firstname,
                    name: result[0].name });
                });
            }
        });
    }
}

exports.delUser = (req, res) => {
    if (verifToken(res, req) != 42) {
        if (verifToken(res, req) == -1) {
            res.status(401).json({ msg: "No token, authorization denied" });
        } else {
            res.status(401).json({ msg: "Token is not valid" });
        }
    } else {
        if (isNaN(req.params.id) == true) {
            res.status(404).json({ msg: "Not found" });
        }
        connection.query("SELECT id FROM user WHERE id = '"+ req.params.id +"'", function(err, result, field) {
            if (result.length === 0) {
                res.status(404).json({ msg: "Not found" });
            } else {
                connection.query("DELETE FROM user WHERE id = '"+ req.params.id +"'", function(err, result, field) {
                    res.status(201).json({ msg: `succesfully deleted record number: ${req.params.id}` });
                });
            }
        });
    }
}

exports.updateUser = async (req, res) => {
    if (verifToken(res, req) != 42) {
        if (verifToken(res, req) == -1) {
            res.status(401).json({ msg: "No token, authorization denied" });
        } else {
            res.status(401).json({ msg: "Token is not valid" });
        }
        return (0);
    }
    if (isNaN(req.params.id) == true) {
        res.status(404).json({ msg: "Not found" });
    } else {
        if (!verifyEmail(req.body.email)) {
            res.status(409).json({ msg: "internal server error" });
            return (84);
        }
        connection.query("SELECT id FROM user WHERE id = '"+ req.params.id +"'", function(err, result, field) {
            if (result.length === 0) {
                res.status(404).json({ msg: "Not found" });
            } else {
                connection.query(`SELECT email, password, name, firstname FROM user WHERE id = ${req.params.id}`, async function(err, result, field) {
                    const hashedPasswd = await bcrypt.hash(req.body.password, 10);
                    connection.query(`UPDATE user SET password = '${hashedPasswd}', name = '${req.body.name}',
                    firstname = '${req.body.firstname}', email = '${req.body.email.toLowerCase()}' WHERE id = ${req.params.id}`, function(err) {
                        if (err) {
                            res.status(500).json({ msg: "internal server error" });
                            return (84);
                        } else {
                            connection.query(`SELECT * FROM user WHERE id = "${req.params.id}"`, function(err, result, field) {
                                if (err) {
                                    res.status(500).json({ msg: "internal server error" });
                                    return (84);
                                } else {
                                    res.status(201).json(result[0]);
                                }
                            });
                        }
                    });
                });
            }
        });
    }
}

function verifToken(res, req) {
    if (req.mail == noToken) {
        return (-1)
    } else {
        if (req.mail.localeCompare("wrong token") == 0) {
            return (-2)
        }
    }
    return 42;
}

function verifyEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}