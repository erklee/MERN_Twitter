const express = require("express");
// const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug');

// ADD THESE TWO LINES
const cors = require('cors');
const { isProduction } = require('./config/keys');

// const indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/users');
const tweetsRouter = require('./routes/api/tweets');



const app = express();

app.use(logger('dev')); // log request components (URL/method) to terminal
app.use(express.json()); // parse JSON request body
app.use(express.urlencoded({ extended: false })); // parse urlencoded request body
app.use(cookieParser()); // parse cookies as an object on req.cookies
// app.use(express.static(path.join(__dirname, 'public'))); // serve the static files in the public folder

if (!isProduction) {
    // Enable CORS only in development because React will be on the React
    // development server (http://localhost:5173). (In production, the Express 
    // server will serve the React files statically.)
    app.use(cors());
}

// Attach Express routers
// app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/tweets', tweetsRouter);

// Express custom middleware for catching all unmatched requests and formatting
// a 404 error to be sent as the response.
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
  });
  
  const serverErrorLogger = debug('backend:error');
  
  // Express custom error handler that will be called whenever a route handler or
  // middleware throws an error or invokes the `next` function with a truthy value
  app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
      message: err.message,
      statusCode,
      errors: err.errors
    })
});


module.exports = app;  