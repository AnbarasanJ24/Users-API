const dotenv = require('dotenv');
const express = require('express');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');

const app = express();

/* Body Parser
=========================== */
app.use(express.json());

/* Cookie Parser
=========================== */
app.use(cookieParser());


/* Load Config Variables
=========================== */
dotenv.config({ path: './config/config.env' })

/* Connecting to DB
=========================== */
connectDB();

/* Route Files
=========================== */
const user = require('./routes/user');
const auth = require('./routes/auth');

/* Dev Logging Middleware
=========================== */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


/* Mounting Router
=========================== */
app.use('/api/V1/users', user)
app.use('/api/V1/auth', auth)


/* Error Middleware
=========================== */
app.use(errorHandler)


const PORT = process.env.PORT || 5000;

/* To start the server
=========================== */
app.listen(PORT, () => {
    console.log(`Server started on ${process.env.NODE_ENV} at ${PORT} port`.yellow.bold);
})