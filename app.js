const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const {errorHandler} = require('./utils/middleware')
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users.js');
const loginRouter = require('./controllers/login');

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(errorHandler);

module.exports = app;
