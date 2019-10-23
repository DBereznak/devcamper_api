// @desc Get All Bootcamps
// @route GET /api/v1/bootcamps
// @route Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: 'show all bootcamps'});
}

// @desc Show Bootcamp by ID
// @route GET /api/v1/bootcamps:id
// @route Public
exports.getBootcamp = (req, res, next) => {
    es.status(200).json({success: true, msg: `show bootcamp ${req.params.id}`});
}

// @desc Create A Bootcamp 
// @route POST /api/v1/bootcamps
// @route Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'create new bootcamp'});
}

// @desc Update Bootcamp by ID
// @route PUT /api/v1/bootcamps/:id
// @route Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Update ${req.params.id}`});
}

// @desc Delete Bootcamp by ID
// @route Delete /api/v1/bootcamps/:id
// @route Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Delete ${req.params.id}`})
}