
const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');

dotenv.config({path: './config/config.env' });


connectDB();
//Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth')

// load enviroment variables



const app = express();

//Body Parser
app.use(express.json());
//dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
//File upload
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, console.log(`Server runnig in ${process.env.NODE_ENV} mode on port ${PORT}`));
// Handle unhandled rejections
process.on('unhandledRejection', (error, promise) => {
    console.error(`Error: ${error.message}`);
    server.close(() => {process.exit(1)})
})