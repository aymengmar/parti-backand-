var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var utilisateurRouter = require('./routes/utilisateur');
var reclamationRouter = require('./routes/reclamation');
var notificationRouter = require('./routes/notification');
var menuRouter = require('./routes/Menu');
var nadaRouter = require('./routes/nada');
var fileUpload = require('express-fileupload');
var RestauRouter = require('./routes/Restaurant');
var CommandesItemRouter = require('./routes/CommandeItem');
var CommandesRouter = require('./routes/Commandes');

var app = express();
const db=require('./models');
const { Server } = require('http');
db.sequelize.sync().then(()=>{
  console.log('db connected')
});
//Body Parser confiuration 
app.use(cors());
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use('/', indexRouter);
app.use('/nada', nadaRouter);
app.use('/Restaurant', RestauRouter);
app.use('/Menu', menuRouter);
app.use('/users', usersRouter);
app.use('/tastaNotif', notificationRouter);
app.use('/tastaUser', utilisateurRouter);
app.use('/tastaReclm', reclamationRouter);
app.use('/commandeItem', CommandesItemRouter);
app.use('/commande', CommandesRouter);

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
  res.render('error');
});

module.exports = app;
