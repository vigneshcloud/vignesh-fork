const cloudinary = require('cloudinary').v2;
const multer  = require('multer')

const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'du689i1vn',
    api_key: '734849661357559',
    api_secret: 'Q9St1Cs105lfHQOJ27sbiPUwrog'
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