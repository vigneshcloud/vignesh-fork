// this is to repopulate the DB with data
//const express = require('express'); // express framework for creating webapp - dependancy

const mongoose = require('mongoose'); //mongoose  framework to run and interact with mongodb
const cities = require('./cities'); // just an array containing of city details 
const Campground = require('../models/campgrounds'); // the file that contains the schema and exported as a module Campground
const { places, descriptors } = require('./seedHelpers') ;
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
   // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("DB connected")
})

//array[Math.floor(Math.random() * array.length)]
const sample = array => array[Math.floor(Math.random() * array.length)];


// function to prepopulate DB with random cities from the cities file
const seedDB = async () => {
//await Campground.deleteMany({});
//const c = new Campground({title: 'purple island'});
//await c.save();

  await Campground.deleteMany({});
    for (let i = 0; i < 2; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
       price = Math.floor(Math.random() * 20) + 1 ;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author:'61f948c96769c6f4168975f8',
           title: `${sample(descriptors)} ${sample(places)}`,
         description: '  Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita quia saepe fugiat laborum suscipit aspernatur dolore sint error fuga neque praesentium doloremque consequuntur iste, voluptatem voluptatum possimus culpa? Eveniet, praesentium?' ,
            image: 'https://source.unsplash.com/collection/190727/' ,
           price,
           geometry: { 
               type: 'Point', 
               coordinates: [ cities[random1000].longitude,
               cities[random1000].latitude ] 
            },
           images: [
              {
                  url: 'https://res.cloudinary.com/du689i1vn/image/upload/v1643826181/YelpCamp/ln1sc2udylp3uqqqm28i.jpg',
                  filename: 'YelpCamp/ln1sc2udylp3uqqqm28i',
              },
              {
                  url: 'https://res.cloudinary.com/du689i1vn/image/upload/v1643826181/YelpCamp/dkxuxflvncichaqlu8rl.jpg',
                  filename: 'YelpCamp/dkxuxflvncichaqlu8rl',
              },
              {
                  url: 'https://res.cloudinary.com/du689i1vn/image/upload/v1643826181/YelpCamp/lk0mzictoxxpsy4k6ipf.jpg',
                  filename: 'YelpCamp/lk0mzictoxxpsy4k6ipf',
    }
           ]

        })
       await camp.save();
   }
}
//    const c = new Campground({title: "purple purple  field"})
  //  await c.save();

  seedDB().then(() => {
    mongoose.connection.close();
}) //function call 
