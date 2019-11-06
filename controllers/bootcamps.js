
const path = require('path')
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedResults = require('../middleware/advancedResults');
const geocoder = require('../util/geocoder');

// @desc Get All Bootcamps
// @route GET /api/v1/bootcamps
// @route Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
       


        res
        .status(200)
        .json(res.advancedResults);
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
        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            next(error);     
        }

        bootcamp.remove();
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

// @desc upload photo for bootcamp
// @route Put /api/v1/bootcamps/:id/photo
// @route Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        next(error);     
    }

  if(!req.files){
    return next(new ErrorResponse(`Please upload a file`, 400))
  }
  const file = req.files.file;

  // Make sure image is photo
  if(!file.mimetype.startsWith('image')){
    return next(new ErrorResponse(`That is not a image`, 400))
  }

  if(file.size > process.env.MAX_FILE_UPLOAD){
    return next(new ErrorResponse(`Image is too large`, 400))
  }

  // create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}0`, async error => {
     if(error){
         console.log(error);
         return next(
             new ErrorResponse(
                 `Problem with upload`, 500
             )
         )
     } 

     await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});
     res.status(200).json({
         success: true,
         data: file.name
     })
  })
});