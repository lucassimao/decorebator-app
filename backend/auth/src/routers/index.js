const express = require('express');
const app = express();
const signupRouter = require('./signup.router')

app.use(signupRouter)


module.exports = app;