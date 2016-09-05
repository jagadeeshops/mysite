var mongoose = require("mongoose");

var postsSchema = new mongoose.Schema({
}, { strict: false });

module.exports = mongoose.model('posts', postsSchema, 'posts');
