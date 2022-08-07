//database required
require('./models/db');
const express = require('express');
const dotenv = require('dotenv');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const bodyparser = require('body-parser');
const path = require('path');

const app = express();

const eventControl = require('./controllers/event-controllers.js');

dotenv.config({ path: 'config.env' });
var PORT = process.env.PORT || 8000;

app.use(bodyparser.urlencoded({ extended: true }));

app.use('/event',eventControl)
// app.get('/img',path.join(__dirname, '/views/img'))

app.use("/img", express.static(path.join(__dirname, '/views/img'))); 

app.set('views', path.join(__dirname, '/views'));
app.engine('hbs', exphbs.engine({ extname: 'hbs', defaultLayout: 'mainEvent',handlebars: allowInsecurePrototypeAccess(Handlebars), layoutsDir: __dirname + '/views/layouts' }));
app.set('view engine', 'hbs');


require('./event-migrations/migrate-mongo-config.js');

app.listen(PORT, function () {
    console.log(`Server is running on http://localhost:${PORT}`);
});