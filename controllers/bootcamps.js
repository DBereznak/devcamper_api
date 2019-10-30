
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../util/errorResonse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../util/geocoder');

// @desc Get All Bootcamps
// @route GET /api/v1/bootcamps
// @route Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
       let query;
        const reqQuery = { ...req.query}
        const removeFields = ['select', 'sort', 'page', 'limit']

        removeFields.forEach(param => delete reqQuery[param]);

        console.log(reqQuery);
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `${match}`);
        query = Bootcamp.find(JSON.parse(queryStr));

        // Select
        if(req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // sort
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt')
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 100;
        const startIndex = (page -1) * limit;
        const endIndex = page * limit;
        const total = await Bootcamp.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Execute query
        const bootcamps = await query;

                // Pagination Result
                const pagination = {};

                if(endIndex < total){
                    pagination.next = {
                    page: page + 1,
                    limit
                    }
                }
        
                if(startIndex > 0) {
                    pagination.prev = {
                        page: page -1,
                        limit
                    }
                }


        res
        .status(200)
        .json({success: true, count: bootcamps.length, pagination, data: bootcamps})
});

// @desc Show Bootcamp by ID
// @route GET /api/v1/bootcamps:id
// @route Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp ID:${req.params.id}, not found`, 404));     
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

// @desc Get Bootcamps within a radius
// @route /api/v1/bootcamps/radius/:zipcode/:distance

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [lng, lat], radius]}}
    });
    console.log(bootcamps);
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
})