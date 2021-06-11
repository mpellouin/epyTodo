const noToken = "no token";
const wrongToken = "wrong token";
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: `${process.env.MYSQL_HOST}`,
    user: `${process.env.MYSQL_USER}`,
    password: `${process.env.MYSQL_ROOT_PASSWORD}`,
    database: `${process.env.MYSQL_DATABASE}`
  });

exports.getTodo = (req, res) => {
    if (verifToken(res, req) != 42) {
        if (verifToken(res, req) == -1) {
            res.status(401).json({ msg: "No token, authorization denied" });
        } else {
            res.status(401).json({ msg: "Token is not valid" });
        }
    } else {
        connection.query("SELECT * FROM todo", function(err, result, field) {
            res.status(201).json(result);
        });
    }
}

exports.postTodo = (req, res) => {
    if (verifToken(res, req) != 42) {
        if (verifToken(res, req) == -1) {
            res.status(401).json({ msg: "No token, authorization denied" });
        } else {
            res.status(401).json({ msg: "Token is not valid" });
        }
        return (84);
    }
    const obj = JSON.parse(JSON.stringify(req.body));
    if (verifyFieldsTodo(req) == -1) {
        res.status(409).json({ msg: "internal server error" });
        return (84);
    }
    connection.query(`INSERT INTO todo (title, description, due_time, status, user_id) VALUES ("${req.body.title}",
        "${req.body.description}", "${req.body.due_time}",
        "${req.body.status}", "${req.body.user_id}")`, function(err) {
        if (err) {
            res.status(500).json({ msg: "internal server error" });
            return (84);
        }
    });
    connection.query(`SELECT * FROM todo`, function(err, result, field) {
        req.params.id = result.length;
        connection.query("SELECT id FROM todo WHERE id = '"+ req.params.id +"'", function(err, result, field) {
            if (result.length === 0) {
                res.status(404).json({ msg: "Not found" });
            } else {
                connection.query("SELECT * FROM todo WHERE id = '"+ req.params.id +"'", async function(err, result, field) {
                    res.status(201).json({ id: result[0].id, title: result[0].title, description: result[0].description,
                        created_at: result[0].created_at, due_time: result[0].due_time, status: result[0].status, user_id: result[0].user_id })
                });
            }
        });
    });
    return (0);
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
        res.status(404).json({ msg: "Not found" });
    } else {
        connection.query("SELECT id FROM todo WHERE id = '"+ req.params.id +"'", function(err, result, field) {
            if (result.length === 0) {
                res.status(404).json({ msg: "Not found" });
            } else {
                connection.query("SELECT * FROM todo WHERE id = '"+ req.params.id +"'", async function(err, result, field) {
                    res.status(201).json({ id: result[0].id, title: result[0].title, description: result[0].description,
                        created_at: result[0].created_at, due_time: result[0].due_time, status: result[0].status, user_id: result[0].user_id })
                });
            }
        });
    }
}

exports.delTodo = (req, res) => {
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
        connection.query("SELECT id FROM todo WHERE id = '"+ req.params.id +"'", function(err, result, field) {
            if (result.length === 0) {
                res.status(404).json({ msg: "Not found" });
            } else {
                connection.query("DELETE FROM todo WHERE id = '"+ result[0].id +"'", function(err, result, field) {
                    res.status(201).json({ msg: `succesfully deleted record number: ${req.params.id}` });
                });
            }
        });
    }
}

exports.updateTodo = async (req, res) => {
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
        return (84);
    }
    if (verifyFieldsTodo(req) == -1) {
        res.status(409).json({ msg: "internal server error" });
        return (84);
    } else {
        connection.query("SELECT id FROM todo WHERE id = '"+ req.params.id +"'", function(err, result, field) {
            if (result.length === 0) {
                res.status(404).json({ msg: "Not found" });
            } else {
                connection.query(`UPDATE todo SET title = "${req.body.title}", description = "${req.body.description}", due_time = "${req.body.due_time}", user_id = "${req.body.user_id}", status = "${req.body.status}" WHERE id = ${req.params.id}`, function(err) {
                    if (err) {
                        res.status(500).json({ msg: "internal server error" });
                        return (84);
                    } else {
                        connection.query(`SELECT title, description, due_time, user_id, status FROM todo WHERE id = ${req.params.id}`, function(err, result, field) {
                            if (err) {
                                res.status(500).json({ msg: "internal server error" });
                            return (84);
                            } else {
                                res.status(201).json(result[0]);
                            }
                        });
                    }
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

function verifyFieldsTodo(req) {
    if ((typeof req.body.title !== 'undefined' && req.body.title) &&
    (typeof req.body.description !== 'undefined' && req.body.description) &&
    (typeof req.body.status !== 'undefined' && req.body.status) &&
    (typeof req.body.due_time !== 'undefined' && req.body.due_time) &&
    (typeof req.body.user_id !== 'undefined' && req.body.user_id)) {
        if (req.body.status == 'todo' || req.body.status == 'in progress' ||
        req.body.status == 'done' || req.body.status == 'not started') {
            connection.query("SELECT * FROM user WHERE id = '"+ req.body.user_id +"'", function(err, result, field) {
                if (result.length !== 0) {
                    if (!isNaN(req.body.due_time)) {
                        return (0);
                    } else {
                        return (-1);
                    }
                } else {
                    return (-1);
                }
            });
        } else {
            return (-1);
        }
    } else {
        return (-1);
    }
}