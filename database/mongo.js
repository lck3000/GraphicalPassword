const mongoose = require('mongoose');

const host = '127.0.0.1';
const port = 27017;
const db = 'seguridad';

const dbConn = mongoose.createConnection(`mongodb://${host}:${port}/${db}`,{useNewUrlParser: true}, (err, xd) => {
	if (!err) {
		return console.info('MongoDB Connected');
	}

	console.error('Error connecting MongoDB. Stopping...');
	console.error(err);
	process.exit(0);
});

module.exports = dbConn;