const cloudinary = require('cloudinary').v2;
const multer  = require('multer')

const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'YelpCamp',
    allowedFormats: ['jpeg','png','jpg']
    //format: async (req, file) => 'png', // supports promises as well
    //public_id: (req, file) => 'computed-filename-using-request',
  },
});

const parser = multer({ storage: storage });

//app.post('/upload', parser.single('image'), function (req, res) {
 // res.json(req.file);
//});


module.exports = { 
    cloudinary,
    storage
}