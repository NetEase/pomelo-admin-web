var express = require('express');
var config = require('./config/admin');

var app = express();

//--------------------configure app----------------------
var pub = __dirname + '/public';
var view = __dirname + '/views';

app.configure(function() {
	app.set('view engine', 'html');
	app.set('views', view);
	app.engine('.html', require('ejs').__express);

	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.set('basepath', __dirname);
	
	app.use(express.cookieParser('sctalk admin manager'));
	app.use(express.session());
});

app.configure('development', function() {
	app.use(express.static(pub));
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.configure('production', function() {
	var oneYear = 31557600000;
	app.use(express.static(pub, {
		maxAge: oneYear
	}));
	app.use(express.errorHandler());
});

app.on('error', function(err) {
	console.error('app on error:' + err.stack);
});

app.get('/', checkLogin);
app.get('/', function(req, resp) {
	resp.render('index', config);
});

app.get('/login', function(req, resp) {
	console.log('get login');
	resp.render('login');
});

app.post('/login', function(req, resp) {
	console.log('post login');
	if (req.body.password === '123456' && req.body.username === 'admin') {
		req.session.user = 'admin';
		return resp.redirect('/');
	}
	
	resp.render('login');
});

app.get('/module/:mname', checkLogin);
app.get('/module/:mname', function(req, resp) {
	resp.render(req.params.mname);
});

function checkLogin(req, res, next) {
	console.log('checkLogin');
	if (!req.session.user) {
		return res.redirect('/login');
	}
	next();
}

app.listen(7001);
console.log('[AdminConsoleStart] visit http://0.0.0.0:7001');