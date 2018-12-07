var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
   name: String,
   subject: String,
   article: String,
   url: String,
   image: String,
   date : {
      type: Date,
      default: Date.now
   }
});

module.exports = mongoose.model('Article', articleSchema);
