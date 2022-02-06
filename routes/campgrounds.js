const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campgrounds'); // the file that contains the schema and exported as a module Campground
const {campgroundSchema} = require('../schemas')
const flash = require('connect-flash')
const passport = require('passport')
const {isLoggedIn , isAuthor} = require('../middleware')
const campgrounds = require('../controllers/campgrounds'); // the file that contains the schema and exported as a module Campground
const multer  = require('multer')
//const upload = multer({ dest: 'uploads/' })
//const upload = multer({ dest: 'https://mannaiftp-my.sharepoint.com/:f:/g/personal/vignesh_ayyappan_mannai_com_qa/EjFb-k7euPhKuKSqpBh5Q1wBaGlCPvFuTo2b9gvKXlui9Q'})
const {storage} = require('../cloudinary')
const upload = multer({ storage })


const validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

//API key - 734849661357559 

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image') ,validateCampground,catchAsync (campgrounds.createCampground));
   
router.get('/new' ,isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor, upload.array('image'), validateCampground ,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync( campgrounds.delete));



 
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));



module.exports = router;