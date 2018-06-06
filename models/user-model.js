
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

async function loginBlonder(userid, points) {
	let user = await UserModel.findById(userid).exec();
	let credentials = user.credentials;

	if (credentials.mtype != 'blonder') {
		return false;
	}

	if (credentials.data.length != points.length) {
		return false;
	}

	let error = 0;
	credentials.data.forEach((p, i) => {
		let dx = p.x - points[i].x;
		let dy = p.y - points[i].y;

		error += Math.sqrt(dx*dx + dy*dy);
	});

	error /= points.length;

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
	loginBlonder: loginBlonder
};