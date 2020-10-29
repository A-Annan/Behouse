var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

const sequelize = require('./data_base')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const user = require('./Model/User');
const product = require('./Model/Product');
const images = require('./Model/Images');
const order = require('./Model/order');
const productQte = require('./Model/ProductQte');






app.use(logger('dev'));
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/uploads',express.static('uploads'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

sequelize.authenticate().then(function(){
  console.log("sucess");
}).catch(function(error){
  console.log("error: "+error);
});




//Associations
user.hasMany(product);
user.hasMany(order);
order.belongsTo(user,{constraints: false});
product.hasMany(images);
order.belongsToMany(product,{through: productQte,
  as: { singular: 'Product', plural: 'Products' },});
// productQte.hasOne(product);
product.belongsToMany(order,{through: productQte,
  as: { singular: 'Order', plural: 'Orders' }});



sequelize.sync({alter: true}).then( () =>{
  console.log('all synced')
  console.log(Object.keys(product.prototype));
})



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.redirect('/');
});

module.exports = app;
