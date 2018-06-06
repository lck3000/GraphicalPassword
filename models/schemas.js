const mongo = require('../database/mongo');
const mongoose = require('mongoose');

const UserModel = mongo.model('User', new mongoose.Schema({
	username: {
		type: String,
		index: true,
		required: true,
		unique: true
	},
	password: {
		type: String
	},
	name: String,
	state: String,
	credentials: {
		mtype: String,
		data: mongoose.Schema.Types.Mixed
	}
}));

module.exports = {
	UserModel: UserModel
};