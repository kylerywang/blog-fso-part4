const usersRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');

usersRouter.post('/', async (req, res) => {
  const {username, name, password} = req.body;
  // encrypt password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate(
      'blogs',
      {url: 1, title: 1, author: 1});
  res.json(users);
});

module.exports = usersRouter;