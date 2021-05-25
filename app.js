'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const expressHbs = require('express-handlebars');
const MongoStore = require('connect-mongo')(session);  
const http = require('http');
const methodOverride = require('method-override');
const paginateHelper = require('express-handlebars-paginate');

// Import the passport configuration
require('./config/passport');
require('./database');

// Create the main application
const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

//-------------------------------------------------------------------------
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
 
app.set('view engine', '.hbs');

var hbs = expressHbs.create({
  helpers: { 

    paginateHelper: paginateHelper.createPagination
  }
});



//app.use(logger('dev')); 

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
 

app.use(validator());

app.use(cookieParser());
app.use(methodOverride('_method'));
// We don't actually want to store the session in memory as we have:
// 1) memory leaks
// 2) things are not optimized in any way

app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    maxAge: 180 * 60 * 1000
  }
})); // maxAge = 3hrs but for testing you'd want to set this to 10secs

// Use flash messaging for errors
app.use(flash());

// Initialize passport usage
app.use(passport.initialize());
app.use(passport.session());

// Declare the static file directory
app.use(express.static(path.join(__dirname, 'public')));






// authenticate?
app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
 
  next();
});

// Declare routing variables
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const ptoventaRouter = require('./routes/admin/ptoventaRoutes');


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', ptoventaRouter);

app.use(require('./routes/admin/homeAdminRoutes'));
app.use(require('./routes/admin/productRoutes'));

app.use(require('./routes/admin/categoryAdminRoutes'));
app.use(require('./routes/admin/ordenRoutes'));
app.use(require('./routes/admin/clientesAdminRoutes'));




app.use(require('./routes/admin/ordenRoutes'));


//-------------------------------------------------------------------------
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), () => {
  console.log('Puerto', app.get('port'));
});