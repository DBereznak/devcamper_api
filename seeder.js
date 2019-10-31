const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course')

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const bootcamps = JSON.parse(fs.readFileSync('./config/data.json', 'utf-8'));
const courses = JSON.parse(fs.readFileSync('./config/courses.json', 'utf-8'));

const importData = async () => {
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('Data imported')
    }catch(error){
        console.error(error)
    }
}


const deleteData = async () => {
    try{
        await Bootcamp.deleteMany;
        await Course.deleteMany;
        console.log('Data destroyed')
        process.exit();
    }catch(error){
        console.error(error)
    }
}

if(process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else {
    console.log('Enter a proper code');
}