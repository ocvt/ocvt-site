const path = require('path')
const express = require('express');
const indexRouter = require('./routes/index');

/* Start app */
const app = express();

/* Configure view engine */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* Configure Routes */
app.use('/', indexRouter);

/* Error handling TODO */
//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});
//
//// error handler
//app.use(function(err, req, res, next) {
//  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});
//

app.listen(4000, () => console.log('RUNNING'));
