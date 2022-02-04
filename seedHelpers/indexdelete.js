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
await Campground.deleteMany({});

//    const c = new Campground({title: "purple purple  field"})
  //  await c.save();

  seedDB().then(() => {
    mongoose.connection.close();
}) //function call 
}
