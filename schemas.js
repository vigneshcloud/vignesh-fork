const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})

// const sanitizeHtml = require('sanitize-html');
// const Joi = require('joi')
// const { number } = require('joi')

// const extension = (joi) => ({
//     type: 'string',
//     base: joi.string(),
//     messages: {
//         'string.escapeHTML': '{{#label}} must not include HTML!'
//     },
//     rules: {
//         escapeHTML: {
//             validate(value, helpers) {
//                 const clean = sanitizeHtml(value, {
//                     allowedTags: [],
//                     allowedAttributes: {},
//                 });
//                 if (clean !== value) return helpers.error('string.escapeHTML', { value })
//                 return clean;
//             }
//         }
//     }
// });

// module.exports.campgroundSchema = Joi.object({
//     campground: Joi.object({
//         title: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//        // image: Joi.String()
//     }).required(),
//     deleteImages: Joi.array()
// }) ; 

// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required().min(1).max(5),
//         body: Joi.string().required().escapeHTML()
      
//     }).required()
// }) ; 





