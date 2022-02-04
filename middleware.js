const {campgroundSchema , reviewSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campgrounds')
const Review = require('./models/review')


module.exports.isLoggedIn = (req,res,next)=>{
    console.log("REQ.USER...",req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','Must Login to view the page')
        return res.redirect('/login')
    }
    next();
}



module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
if(error){
    const msg = error.details.map(el=> el.message).join(',')
    throw new ExpressError(msg, 400)
} else{
    next();
}
}

module.exports.isAuthor = async(req,res,next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        //("you dont have perms to modify! contact admin")
        req.flash('error','Permission denied')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(id);
    if(!review.author.equals(req.user._id)){
        //("you dont have perms to modify! contact admin")
        req.flash('error','Permission denied')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


