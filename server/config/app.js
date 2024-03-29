let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let bookRouter = require('../routes/book');

let app = express();


// Modules for authentication

let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

// Set up MongoDB

let mongoose = require('mongoose');
let DB = require('./db');

mongoose.connect(DB.URI,{useNewUrlParser:true,useUnifiedTopology:true});

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console,'Connection Error'));
mongoDB.once('open',() => {
  console.log('Connected to MongoDB...');
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Set up express session
app.use(session({
  secret:"SomeSecret",
  saveUninitialized:false,
  resave:false
}));

// Set up flash

app.use(flash());

//Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// passport user config

//create a user model instance
let userModel = require('../models/user');
let User = userModel.User;
passport.use(User.createStrategy());

// serialize and deserialize the user info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Authentication with JWT Configuration
let cors=require('cors');
let passportJWT=require('passport-jwt');
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

let jwtOptions = { };
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = DB.Secret;

app.use(cors());

let strategy = new JWTStrategy(jwtOptions,(jwt_payload,done) => {
  User.findById(jwt_payload.id)
  .then(user => {
    return done(null,user);
  })
  .catch(err => {
    return done(err,false);
  });
})

passport.use(strategy);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books',bookRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:'Error'});
});

module.exports = app;
