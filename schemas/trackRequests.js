var mongoose = require("mongoose");

var trackRequestsSchema = new mongoose.Schema({
  _id: { type: String, trim: true }
}, { strict: false });

module.exports = mongoose.model('trackRequests', trackRequestsSchema, 'trackRequests');
