/**
 * SessionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var bcrypt = require('bcrypt');

module.exports = {


	lupaPassword: function (req, res) {
		res.view('lupa-password', {
			layout: false

		})
	},
	daftar: function (req, res) {
		res.view('daftar', {
			layout: false

		})
	},
	login: function (req, res) {
		res.view('login', {

			layout: false

		})
	},
	lupaSandi: function (req, res, next) {
		User.findOne({ email: req.param('email') }).exec(function (err, user) {
			if (err) {
				return next(err)
			}
			if (user) {
				var kode = Math.floor(Math.random() * 90000) + 10000;
				User.update({ email: req.param('email') }, { kode_verifikasi: kode }).exec(function (err, userUpdated) {
					if (err) {
						console.log(err);

					}
					else {
						User.findOne({ email: req.param('email') }).exec(function (err, user1) {
							mailer.sendKataSandi(user1)
							res.view("user/validasi", {
								layout: false,
								status: 'OK',
								title: 'Aktivasi Akun',
								user: user
							})
						})
					}
				})
			}
		})
	},
	validasiLupaSandi: function (req, res, next) {
		User.findOne({ id: req.param('id') }).exec(function (err, user) {
			if (err) {
				return next(err)
			}
			if (user.kode_verifikasi == req.param('kode_verifikasi')) {
				res.view("user/ganti-sandi/", {
					layout: false,
					status: 'OK',
					title: 'Aktivasi Akun',
					user: user
				})
			}
			else {
				var kodeSalah = [
					"Kode yang Anda masukan salah, Cek email Anda untuk melihat Kode !"
				]
				req.session.flash = {
					err: kodeSalah
				}
				res.view("user/validasi", {
					layout: false,
					status: 'OK',
					title: 'Aktivasi Akun',
					user: user
				})
			}
		})
	},

	akunAktif: function (req, res, next) {

		User.findOne({ id: req.param('id') }).exec(function (err, user) {
			if (err) {
				return next(err)
			}

			if (user.kode_verifikasi == req.param('kode_verifikasi')) {
				User.update({ id: req.param('id') }, { status: true }).exec(function (err, userUpdated) {
					var akunAktif = [
						"Akun anda sudah di aktivasi, silahkan Login !!"
					]
					req.session.flash = {
						err: akunAktif
					}
					res.redirect('/login');
					return;
				})
			}
			else {
				var kodeSalah = [
					"Kode yang Anda masukan salah, Cek email Anda untuk melihat Kode !"
				]
				req.session.flash = {
					err: kodeSalah
				}
				res.view("user/akun-aktivasi", {
					layout: false,
					status: 'OK',
					title: 'Aktivasi Akun',
					user: user
				})
			}
		})
	},

	create: function (req, res, next) {


		if (!req.param('email') || !req.param('password')) {

			var usernamePasswordRequiredError = [
				"Masukan Username dan Password anda"
			]


			req.session.flash = {
				err: usernamePasswordRequiredError
			}

			res.redirect('/login');
			return;
		}


		User.findOneByEmail(req.param('email'), function foundUser(err, user) {
			if (err) return next(err);


			if (!user) {
				var noAccountError = [
					"Email Belum Terdaftar"
				]
				req.session.flash = {
					err: noAccountError
				}
				res.redirect('/login');
				return;
			}
			if (user.status) {
				bcrypt.compare(req.param('password'), user.password, function (err, valid) {
					if (err) return next(err);


					if (!valid) {
						var usernamePasswordMismatchError = [
							"Email atau Password Salah"
						]
						req.session.flash = {
							err: usernamePasswordMismatchError
						}
						res.redirect('/login');
						return;
					}


					req.session.authenticated = true;
					req.session.User = user;
					res.redirect('/anime-terbaru/1');

				});
			}
			else {
				res.view("user/akun-aktivasi", {
					layout: false,
					status: 'OK',
					title: 'Aktivasi Akun',
					user: user
				})
			}


		});
	},

	destroy: function (req, res, next) {

		User.findOne(req.session.User.id, function foundUser(err, user) {

			var userId = req.session.User.id;

			if (user) {

				User.update(userId, {
					online: false
				}, function (err) {
					if (err) return next(err);


					User.publishUpdate(userId, {
						loggedIn: false,
						id: userId,
						name: user.nama,
						action: ' has logged out.'
					});


					req.session.destroy();


					res.redirect('/login');
				});
			} else {


				req.session.destroy();


				res.redirect('/login');
			}
		});
	}
};