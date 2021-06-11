const express = require('express');
const path = require('path');
const app = express();
const db = require('./config/db');
const bcrypt = require('bcryptjs');
const parser = require('body-parser')
require('dotenv').config();
var user = require('./routes/user/user');
var todo = require('./routes/todos/todos');
var auth = require('./routes/auth/auth');
var mid = require('./middleware/auth');

module.exports = app;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('server running');
});

//auth routes

app.post('/register', auth.postregister);
app.post('/login', auth.postlogin);

//user routes

app.get('/user', mid.auth, user.user);
app.get('/user/todos', mid.auth, user.todos);
app.get('/user/:id', mid.auth, user.id);
app.get('/user/:email', mid.auth, user.id);
app.delete('/user/:id', mid.auth, user.delUser);
app.put('/user/:id', mid.auth, user.updateUser);

//todo routes

app.get('/todo', mid.auth, todo.getTodo);
app.post('/todo', mid.auth, todo.postTodo);
app.get('/todo/:id', mid.auth, todo.id);
app.delete('/todo/:id', mid.auth, todo.delTodo);
app.put('/todo/:id', mid.auth, todo.updateTodo);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});