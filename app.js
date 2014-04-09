
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var tasks =require('./routes/tasks');
var http = require('http');
var path = require('path');
var lessMiddleware = require('less-middleware');
var mongoskin = require('mongoskin');
var uri = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/todo?auto_reconnect';
var db = mongoskin.db(uri, {safe: true});

var app = express();

app.use(function (req, res, next) {
	// export the database object to all middlewares
	// be able to perform database operations in the routes modules
	req.db = {};
	// store the tasks collection in every request
	req.db.tasks = db.collection('tasks');
	next();
});

// to access appname from within every jade template
app.locals.appname = "node Todo app";

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
// logger will print requests in the terminal window
app.use(express.logger('dev'));
// for painlessly accessing incoming data
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// To use CSRF, we need cookieParser() and session()
app.use(express.cookieParser());
app.use(express.session({secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9'}));
app.use(express.csrf());


app.use(lessMiddleware(path.join(__dirname, 'public')));
// The other static files are also in the public folder
app.use(express.static(__dirname + '/public'));

// This is how we expose csrf to templates
app.use(function (req, res, next) {
	res.locals._csrf = req.session._csrf;
	return next();
});

app.use(app.router);

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// When there’s a request that matches route/RegExp with :task_id in it, this block is executed
app.param('task_id', function (req, res, next, taskId) {
	// The value of task ID is in taskId and we query the database to find that object
	req.db.tasks.findById(taskId, function (error, task) {
		if (error) return next(error);
		if (!task) return next(new Error ('Task is not found.'));
		// If there’s data, store it in the request and proceed to next middleware
		req.task = task;
		return next();
	});
});

app.get('/', routes.index);
app.get('/tasks', tasks.list);
app.post('/tasks', tasks.markAllCompleted);
app.post('/tasks', tasks.add);
app.post('/tasks/:task_id', tasks.markCompleted);
app.del('/tasks/:task_id', tasks.del);
app.get('/tasks/completed', tasks.completed);

// In case of malicious attacks or mistyped URL to catch all requests with *
app.all('*', function (req, res) {
	res.send(404);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
