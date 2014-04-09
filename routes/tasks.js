/*
 * GET users listing.
 */

// request handler that gives us list of incomplete tasks
exports.list = function(req, res, next){
	// a database search with completed=false query
	req.db.tasks.find({
		completed: false
	}).toArray(function (err, tasks) {
		if (err) return next(err);
		res.render('tasks', {
			title: 'Todo List',
			tasks: tasks || []
		});
	});
};

exports.add = function (req, res, next) {
	if (!req.body || !req.body.name) return next(new Error ('No data provided'));
	//already have a database collection in the req object, and the default value for the task is incomplete (completed: false)
	req.db.tasks.save({
		name: req.body.name,
		completed: false
	}, function (err, task) {
		if (err) return next(err);
		if (!task) return next(new Error('failed to save'));
		console.log('Added %s with id=%s', task.name, task._id);
		res.redirect('/tasks');
	});
};

exports.markAllCompleted = function (req, res, next) {
	// check for the all_done parameter to decide if this request comes from the all done button or the add button
	if (!req.body.all_done || req.body.all_done !== 'true') return next();
	// If the execution come this far, we perform db query with multi: true
	req.db.tasks.update(
	{completed: false},
	{$set: {completed: true}},
	{multi: true},
	function (err, count) {
		if (err) return next(err);
		console.info('Marked %s task(s) completed.', count);
		res.redirect('/tasks');
	});
};

exports.completed = function (req, res, next) {
	req.db.tasks.find({
		completed: true
	}).toArray(function (err, tasks) {
		res.render('tasks_completed', {
			title: 'completed',
			tasks: tasks || []
		});
	});
};

exports.markCompleted = function (req, res, next) {
	if (!req.body.completed) return next(new Error('Param is missing'));
	req.db.tasks.updateById(req.task._id, {
		// is needed because the incoming value is a string and not a boolean
		$set: {completed: req.body.completed === 'true'}
	}, function (err, count) {
		if (err) return next(err);
		if (count !==1) return next(new Error('Something went wrong'));
		console.info('Marked task %s with id=%s completed.', req.task.name, req.task._id);
		res.redirect('/tasks');
	});
};

exports.del = function (req, res, next) {
	req.db.tasks.removeById(req.task._id, function (err, count) {
		if (err) return next(err);
		if (count !==1) return next(new Error('Something went wrong.'));
		console.info('Deleted task %s with id=%s completed.', req.task.name, req.task._id);
		res.send(200);
	});
};