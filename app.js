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

app.listen(4000, () => console.log('RUNNING'));
