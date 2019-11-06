
const errorResponse = require('../util/errorResponse')
const errorHandler = (error, req, res, next) => {
let err = {...error}

err.messaqge = error.message;
// Bad Id
if(error.name === 'CastError'){
    const message = `Resource ID: ${error.value}, not found`;
    err = new errorResponse(message, 404);
}

//Duplicate key

if(error.code === 11000){
    const message = `Resource ID: ${error.value}, Duplicate field Error`;
    err = new errorResponse(message, 400); 
}

// Validation Error

if (error.name === 'ValidatorError') {
    const message = Object.values(error.errors).map(val => val.message);
    err = new errorResponse(message, 400); 
}


res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
});
}

module.exports = errorHandler;