
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db')

dotenv.config({path: './config/config.env' });


connectDB();
//Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// load enviroment variables



const app = express();

//Body Parser
app.use(express.json());
//dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, console.log(`Server runnig in ${process.env.NODE_ENV} mode on port ${PORT}`));
// Handle unhandled rejections
process.on('unhandledRejection', (error, promise) => {
    console.error(`Error: ${error.message}`);
    server.close(() => {process.exit(1)})
})