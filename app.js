const express=require('express');
const mongoose=require('mongoose');
const passport=require('passport');
const bodyParser=require('body-parser');
const session=require('express-session');
const path=require('path');
const ejs=require('ejs');
const flash=require('connect-flash');
const expressValidator=require('express-validator');
const authCheck=require('./config/authent');
const app=express();

var user=require('./routes/auth.js');
const {googleAuth,facebookAuth,githubAuth,localAuth}=require('./config/passport');
googleAuth(passport);
facebookAuth(passport);
githubAuth(passport);
localAuth(passport);

var db=mongoose.connect('mongodb://localhost:27017/TodoFinal',{useNewUrlParser:true}).then(()=>console.log('MongoDb Connected'))
.catch(err => console.log(err));

app.use(express.static(path.join(__dirname,'public')));

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })

  );

app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/home',authCheck);
app.use('/',user);

app.listen(8000,() => console.log('Server is Connected'));