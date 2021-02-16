var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

let userModel = require('../models/user');
let User = userModel.User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home',displayName:req.user?req.user.displayName:'' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home',displayName:req.user?req.user.displayName:'' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('index', { title: 'About' ,displayName:req.user?req.user.displayName:''});
});

/* GET products page. */
router.get('/products', function(req, res, next) {
  res.render('index', { title: 'Products' ,displayName:req.user?req.user.displayName:''});
});
/* GET services page. */
router.get('/services', function(req, res, next) {
  res.render('index', { title: 'Services',displayName:req.user?req.user.displayName:'' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('index', { title: 'Contact' ,displayName:req.user?req.user.displayName:''});
});

/* Get Login Page */

router.get('/login',(req,res,next) => {
  if(!req.user)
  {
    res.render('auth/login',{
      title:'Login',
      messages:req.flash('loginMessage'),
      displayName:req.user?req.user.displayName:''
    });
  }
  else
  {
    return res.redirect('/');
  }
})

/* Post Login Page */

router.post('/login',(req,res,next) => {
  passport.authenticate('local',
  (err,user,next) => {
    if(err)
    {
      return next(err);
    }
    if(!user)
    {
      req.flash('loginMessage','Authentication Error!');
      return res.redirect('/login');
    }
    req.login(user,(err) => {
      if(err)
      {
        return next(err);
      }
      return res.redirect('/books');
    })

  })(req,res,next);
  
})

/* Get Register Page */

router.get('/register',(req,res,next) => {
  if(!req.user)
  {
    res.render('auth/register',{
      title:'Register',
      messages:req.flash('registerMessage'),
      displayName:req.user?req.user.displayName:''
    });
  }
  else
  {
    return res.redirect('/');
  }
})

/* Post Register Page */

router.post('/register',(req,res,next) => {
  let newUser = new User({
    username:req.body.username,
    email:req.body.email,
    displayName:req.body.displayName
  });

  User.register(newUser,req.body.password,(err) => {
    if(err)
    {
      console.log("Error: Inserting a new user");
      if(err.name == "UserExistsError")
      {
        req.flash(
          'registerMessage',
          'Registration Error: User Already Exists!'
        );
        console.log("Error: User Already Exists!");
      }
      return res.render('auth/register',
      {
        title:'Register',
        messages:req.flash('registerMessage'),
        displayName:req.user?req.user.displayName:''
      });
    }
    else
    {
      return passport.authenticate('local')(req,res,() => {
        res.redirect('/books')
      });
    }
  })
  
})

/* Perform Logout Page */

router.get('/logout',(req,res,next) => {
  req.logout();
  res.redirect('/');

})

module.exports = router;
