import compression from 'compression';
import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/* Configure Routes */
import { router as rootRouter } from './routes/root.js';
import { router as aboutRouter } from './routes/about.js';
import { router as duesRouter } from './routes/dues.js';
import { router as myocvtRouter } from './routes/myocvt.js';
import { router as tripapprovalRouter } from './routes/tripapproval.js';
import { router as tripsRouter } from './routes/trips.js';
import { router as webtoolsRouter } from './routes/webtools.js';

/* dirname stuff */
/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Start app */
const app = express();

/* Configure app */
app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Version-named library dirs never change; everything else revalidates hourly
app.use('/tinymce-6.8.6', express.static('static/tinymce-6.8.6', { immutable: true, maxAge: '365d' }));
app.use('/leaflet-1.6.0', express.static('static/leaflet-1.6.0', { immutable: true, maxAge: '365d' }));
app.use('/galleria-1.6.1', express.static('static/galleria-1.6.1', { immutable: true, maxAge: '365d' }));
app.use(express.static('static', { maxAge: '1h' }));

// Our own JS/CSS change between releases but sit in the Cloudflare edge and
// browser caches for hours, so templates reference them with ?v=#{assetV}: a
// content hash that changes exactly when the files do. Library files are
// version-named and never need it.
const ownAssets = ['css/ocvt.css', 'js/ocvt.js', 'js/ocvt_quicksignup.js', 'js/ocvt_webtools.js'];
const assetHash = crypto.createHash('sha256');
ownAssets.forEach((f) => assetHash.update(fs.readFileSync(path.join(__dirname, 'static', f))));
app.locals.assetV = assetHash.digest('hex').slice(0, 10);

app.use('/', rootRouter);
app.use('/about', aboutRouter);
app.use('/dues', duesRouter);
app.use('/myocvt', myocvtRouter);
app.use('/tripapproval', tripapprovalRouter);
app.use('/trips', tripsRouter);
app.use('/webtools', webtoolsRouter);

/* eslint-disable no-console */
app.listen(4000, () => console.log('RUNNING'));

/* Catch CTRL + C */
process.stdin.resume();
process.on('SIGINT', () => {
  console.log('SIGINT detected, EXITING!');
  process.exit(0);
});
