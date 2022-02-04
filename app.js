if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
} // env variables feteched from .env file if not production 
console.log(process.env.CLOUDINARY_CLOUD_NAME)
console.log(process.env.CLOUDINARY_KEY)
const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet');
const MongoDBStore = require('connect-mongodb-session')(session);


const path = require('path');
const mongoose = require('mongoose'); //mongoose  framework to run and interact with mongodb
const Campground = require('./models/campgrounds'); // the file that contains the schema and exported as a module Campground
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const Review = require('./models/review');
const User = require('./models/user')


//routes 
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews'); // the file that contains the schema and exported as a module Campground
const userRoutes = require('./routes/user');


//https://source.unsplash.com/collection/190727/
// mongodb+srv://vignesh-db:<password>@vignesh.ouyxd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

// const dbUrl = process.env.DB_URL
// mongoose.connect(dbUrl,{
//     useNewUrlParser: true,
//    // useCreateIndex: true,
//     useUnifiedTopology: true,
//     //useFindAndModify: false
// });


//const dbUrl = 'mongodb://localhost:27017/yelp-camp'
const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl,{
    useNewUrlParser: true,
   // useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("DB connected")
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true})) // returns in json format

const secret = process.env.SECRET || 'this is a secret'
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true ,
    //store: 
    cookie:{
        
        httpOnly: true , 
        // secure: true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7 ,
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}
app.use(session(sessionConfig))
app.use(flash());
//app.use(helmet({contentSecurityPolicy: false}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    // console.log(req.session)
    console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//app.use(session(sessionConfig)) // returns in json format
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize())
app.engine('ejs', ejsMate);

//const validateReview = (req,res,next) =>{
    //const reviewschema = Joi.object({
        //review: Joi.object({
            //rating: Joi.string().required(),
           // price: Joi.number().required().min(0),
            //description: Joi.string().required().min(0),
            //location: Joi.string().required(),
            //image: String
       // }).required()
   // })
  //  const {error} = reviewSchema.validate(req.body);
    //if(error){
      //  const msg = error.details.map(el=> el.message).join(',')
        //throw new ExpressError(msg, 400)
    //} else{
      //  next();
    //}
//}

app.use('/',userRoutes)
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)

app.get('/',(req,res)=>{
//res.send('Hello from YelpCamp')
    res.render('home')
}
)
// app.get('/fakeUser', async(req,res)=>{
//     const user = new User({email: 'abc@gmail.com' , username: 'test'}) 
//     const newUser = await User.register(user,'netapp123')
//     res.send(newUser);
// })




app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next)=>{
    const {statusCode = 500 , message = 'Error Reported'} = err ;
    res.status(statusCode).render('error',{err})
    res.send('Error reported')
})

app.listen(8086,()=>{
    console.log('serving on port 8086')
})