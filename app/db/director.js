var mongoose = require('mongoose');

//mogoose schema for director
var DirectorSchema = new mongoose.Schema({
	name: {
		type: String,
		index: 1,
		required: true
	}
});

module.exports = mongoose.model('Director', DirectorSchema);