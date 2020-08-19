const compression = require('compression');
const express = require('express');
const path = require('path');

/* Start app */
const app = express();

/* Configure app */
app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('static'));

/* Configure Routes */
const rootRouter = require('./routes/root');
const aboutRouter = require('./routes/about');
const duesRouter = require('./routes/dues');
const myocvtRouter = require('./routes/myocvt');
const tripapprovalRouter = require('./routes/tripapproval');
const tripsRouter = require('./routes/trips');
const webtoolsRouter = require('./routes/webtools');

app.use('/', rootRouter);
app.use('/about', aboutRouter);
app.use('/dues', duesRouter);
app.use('/myocvt', myocvtRouter);
app.use('/tripapproval', tripapprovalRouter);
app.use('/trips', tripsRouter);
app.use('/webtools', webtoolsRouter);

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
