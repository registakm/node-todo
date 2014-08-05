exports.login = function (req, res){
	var email = req.query.email;
	var password = req.query.password;
	var query = {
		"email": email,
		"password": password
	};
	req.db.user.find(query, function (err, data){
		if(err){
			console.log(err);
		}
		if (data === '') {
			res.render('login');
		} else {
			req.session.user = email;
			res.redirect('/tasks');
		}
	});
};