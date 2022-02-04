const express = require('express')
const router = express.Router({mergeParams: true});

const Campground = require('../models/campgrounds'); // the file that contains the schema and exported as a module Campground
const Review = require('../models/review');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const {campgroundSchema, reviewSchema} = require('../schemas.js')

const {validateReview, isLoggedIn , isReviewAuthor} = require('../middleware')

const reviews = require('../controllers/reviews');






router.post('/',isLoggedIn , validateReview, catchAsync(reviews.createReview))


router.delete('/:reviewId',isLoggedIn,catchAsync(reviews.deleteReview))
 
 
 
 

 module.exports = router;
 