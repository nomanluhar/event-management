const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });

mongoose.connect(process.env.MONGO_URL, {}).then(() => {
    console.log('Database Connected!!!')
}, (err) => {
    console.error('Database Not Connected!', err);
});

require('./events.model.js');
