
const {UserModel} = require('./schemas');

async function registrar(username, password, name) {
	let doc = new UserModel({
		username: username,
		password: password,
		name: name,
		state: 'registering'
	});

	await doc.save();
	return doc.toObject();
}

async function setBlondeAuthentication(userid, points) {
	let xd = await UserModel.updateOne({_id: userid}, {$set: {
		credentials: {mtype: 'blonder', data: points}, 
		state: 'enabled'
	}}).exec();
	return xd;
}

async function findByUsername(username) {
	return UserModel.findOne({username: username}).exec();
}

async function findById(userid) {
	return UserModel.findById(userid).exec();
}


function computeError(p1, p2) {
	let error = 0;
	p1.forEach((p, i) => {
		let dx = p.x - p2[i].x;
		let dy = p.y - p2[i].y;
		error += Math.sqrt(dx*dx + dy*dy);
	});

	error /= p1.length;
	return error;
}

async function loginBlonder(userid, points) {
	let user = await UserModel.findById(userid).exec();
	let credentials = user.credentials;

	if (credentials.mtype != 'blonder') {
		return false;
	}

	if (credentials.data.length != points.length) {
		return false;
	}

	let error = computeError(credentials.data, points);

	console.log(error);
	if (error > 5) {
		return false;
	}

	return user;
}

async function setPssAuthentication(userid, points, image) {
	let xd = await UserModel.updateOne({_id: userid}, {$set: {
		credentials: {mtype: 'pps', data: {points: points, image: image}}, 
		state: 'enabled'
	}}).exec();
	return xd;
}

async function loginPps(userid, points) {
	let user = await UserModel.findById(userid).exec();
	let credentials = user.credentials;

	if (credentials.mtype != 'pps') {
		return false;
	}

	if (credentials.data.points.length != points.length) {
		return false;
	}

	let error = computeError(credentials.data.points, points);

	console.log(error);
	if (error > 5) {
		return false;
	}

	return user;
}

module.exports = {
	registrar: registrar,
	setBlondeAuthentication: setBlondeAuthentication,
	findByUsername: findByUsername,
	loginBlonder: loginBlonder,
	setPssAuthentication: setPssAuthentication,
	findById: findById,
	loginPps: loginPps
};