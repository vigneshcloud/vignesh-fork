const Campground = require('../models/campgrounds')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder =mbxGeocoding({accessToken: mapBoxToken}) ;



module.exports.index = async (req,res)=>{  
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds}) //  opens index.ejs file under Campgrounds folder 
}

module.exports.renderNewForm = (req,res)=>{  
    
    res.render('campgrounds/new') //  opens index.ejs file under Campgrounds folder 
}

module.exports.createCampground =async (req,res)=>{   
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry;

    campground.images = req.files.map(f =>({url: f.path , filename: f.filename}));

    campground.author = req.user._id ;
    await campground.save();
    console.log(campground)
    req.flash('success','Successfully created ');
    res.redirect(`/campgrounds/${campground._id}`)  // after creation it redirects to the newly created campground
    
}

module.exports.showCampground = async (req,res)=>{  
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews' , 
        populate: { 
            path: 'author'
            }
    }).populate('author');
    if(!campground){
        req.flash('error','cannot find requested data')
        return res.redirect('/campgrounds')
    }
    //console.log(campground)
    res.render('campgrounds/show',{campground}) //  opens index.ejs file under Campgrounds folder 
}

module.exports.renderEditForm = async (req,res)=>{  
    const { id } = req.params;

    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','cannot find requested data')
        return res.redirect('/campgrounds');
    }
   
    
    res.render('campgrounds/edit' ,{campground}) //  opens index.ejs file under Campgrounds folder 
}

module.exports.updateCampground = async (req, res) => {

    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f =>({url: f.path , filename: f.filename}));
    campground.images.push(...imgs);

    await campground.save();
    //if(req.body.deleteImages){
      //  for(let filename of req.body.deleteImages){
        //    await cloudinary.uploader.destroy(filename);
        //}
        
    //pk.eyJ1IjoidnZjbG91ZG1hcGJveCIsImEiOiJja3o3ZXEwOXUwMzd1Mm5wYnIzY2d4MzZ3In0.S7ujF1YLiwnXpaMTp2o7UA
    
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
    }
        await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages} } } } )
    }

    

    req.flash('success','successfully updated')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndDelete(id);
    req.flash('success','successfully deleted campground')
    res.redirect('/campgrounds');
}