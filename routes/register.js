
const router = require('express').Router();
const registerModel = require('../models/user-model');


router.get('/', (req, res, next) => {
	res.render('register/step1');
});

router.post('/', (req, res, next) => {
	let {username, password, name} = req.body;

	if (!username || !password || !name) {
		return res.render('register/step1', {username: username, name: name});
	}

	registerModel.registrar(username, password, name)
	.then(user => {
		req.session.uid = user._id;
		res.redirect('/register/step2');
	})
	.catch(next);
});

router.get('/step2', (req, res, next) => {
	if (!req.session.uid) {
		return res.redirect('/register');
	}

	let method = req.query.m;
	if (method == "blonder") {
		return res.render('register/step2-blonder');
	} else if (method == "pps") {
		return res.render('register/step2-pps');
	}

	res.render('register/step2');
});

router.post('/step2', (req, res, next) => {
	if (!req.session.uid) {
		return res.redirect('/register');
	}

	let m = req.query.m;
	if (m == 'blonder') {
		let points = req.body.points;
		if (!points || points.length < 5) {
			return res.status(400).send('Se necesita al menos 5 puntos.');
		}

		registerModel.setBlondeAuthentication(req.session.uid, points)
		.then(result => {
			delete req.session.uid;
			res.send('ok');
		}).catch(next);
	} else if (m == 'pps') {
		let points = req.body.points;
		let image = req.body.image;

		if (!image) {
			return res.status(400).send('No se ha seleccionado imagen.');
		}
		if (!points || points.length < 5) {
			return res.status(400).send('Se necesita al menos 5 puntos.');
		}

		registerModel.setPssAuthentication(req.session.uid, points, image)
		.then(result => {
			delete req.session.uid;
			res.send('ok');
		}).catch(next);
	} else {
		res.status(400).send('Error con el metodo');
	}
});

module.exports = router;