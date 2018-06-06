const mongoose = require('mongoose');

const host = process.env.MONGO_HOST || '127.0.0.1';
const port = process.env.MONGO_PORT || 27017;
const db = process.env.MONGO_DB || 'seguridad';

const dbConn = mongoose.createConnection(`mongodb://${host}:${port}/${db}`, (err, xd) => {
	if (!err) {
		return console.info('MongoDB Connected');
	}

	console.error('Error connecting MongoDB. Stopping...');
	process.exit(0);
});

module.exports = dbConn;