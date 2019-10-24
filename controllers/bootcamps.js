const Bootcamp = require('../models/Bootcamp');
const ErrorResonse = require('../util/errorResonse');
const asyncHandler = require('../middleware/async')

// @desc Get All Bootcamps
// @route GET /api/v1/bootcamps
// @route Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps})
});

// @desc Show Bootcamp by ID
// @route GET /api/v1/bootcamps:id
// @route Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResonse(`Bootcamp ID:${req.params.id}, not found`, 404));     
        }

        res.status(200).json({success: true, data: bootcamp})    
});

// @desc Create A Bootcamp 
// @route POST /api/v1/bootcamps
// @route Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp
        });
});

// @desc Update Bootcamp by ID
// @route PUT /api/v1/bootcamps/:id
// @route Private
exports.updateBootcamp = asyncHandler(async(req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!bootcamp){
            next(error);
        }

        res.status(200).json({success: true, data: bootcamp})
});

// @desc Delete Bootcamp by ID
// @route Delete /api/v1/bootcamps/:id
// @route Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if(!bootcamp){
            next(error);     
        }

        res.status(200).json({success: true, data: {}})
});