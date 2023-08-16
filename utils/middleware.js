const logger = require('./logger');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const User = require('../models/user');

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message});
  }
  next(error);
};

const userExtractor = async (req, res, next) =>{
  const authorization = req.get('authorization');

  if (!(authorization && authorization.startsWith('Bearer '))) {
    return res.status(401).json({error: 'authentication error'});
    return next();
  }

  const token = authorization.replace('Bearer ', '');

  const decodedToken = jwt.verify(token, config.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({error: 'token invalid'});
  }

  req.user = await User.findById(decodedToken.id);

  next();
};

module.exports = {
  errorHandler,
  userExtractor,
};
