var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var prodSchema = new Schema({
  name: String
});


module.exports = mongoose.model('prod', prodSchema);
