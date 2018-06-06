
const router = require('express').Router();
const UserModel = require('../models/user-model');

router.get('/', (req, res, next) => {
	res.render('login/step1');
});

router.post('/', (req, res, next) => {
	let { username, password } = req.body;

	if (!username || !password) {
		return res.render('login/step1', {
			msg: 'Ingrese un usuario y clave'
		});
	}

	UserModel.findByUsername(username)
		.then(user => {
			if (!user) {
				return res.render('login/step1', {
					msg: 'Usuario no encontrado'
				});
			}

			if (user.state != 'enabled') {
				return res.render('login/step1', {
					msg: 'Usuario no habilitado'
				});
			}

			if (user.password != password) {
				return res.render('login/step1', {
					msg: 'Clave incorrecta'
				});
			}

			req.session.login = {
				state: 'incomplete',
				uid: user._id
			};

			res.redirect('/login/step2?m=' + user.credentials.mtype);
		})
});

router.get('/step2', (req, res, next) => {
	if (!req.session.login) {
		return res.redirect('/login');
	}

	let m = req.query.m;
	if (m == 'blonder') {
		return res.render('login/step2-blonder');
	} else if (m == 'pps') {
		UserModel.findById(req.session.login.uid)
		.then(user => {
			return res.render('login/step2-pps', {
				imgb64: user.credentials.data.image
			});
		});
	} else {
		res.redirect('login');
	}
});

router.post('/step2', (req, res, next) => {
	if (!req.session.login) {
		return res.status(401).send('Error');
	}

	let m = req.query.m;
	if (m == 'blonder') {
		let points = req.body.points;

		UserModel.loginBlonder(req.session.login.uid, points)
			.then(result => {
				if (!result) {
					return res.status(401).send('Clave incorrecta');
				}

				delete req.session.login;
				req.session.user = result._id;
				res.send('ok');
			});
	} else if(m == 'pps') {
		let points = req.body.points;

		UserModel.loginPps(req.session.login.uid, points)
			.then(result => {
				if (!result) {
					return res.status(401).send('Clave incorrecta');
				}

				delete req.session.login;
				req.session.user = result._id;
				res.send('ok');
			});
	} else {
		return res.status(401).send('Error');
	}
});

module.exports = router;