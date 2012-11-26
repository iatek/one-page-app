var port = process.env.PORT || 4000,
    app = require('./app').init(port),
	dirty = require('dirty');
	
var locals = {
	title: 		 'Mobile Test',
	description: 'Test of Lighweight Mobile Data Store',
	author: 	 ''
};

var userDb = dirty('user.db');

app.get('/', function(req,res){
    locals.date = new Date().toLocaleDateString();
	
	var appDb = dirty('app.db'),
		sectionsDb = dirty('sections.db');
	
	sectionsDb.forEach(function(key, val) {
		console.log('Found key: %s, val: %j', key, val);
	});
	
	sectionsDb.on('load', function() {
		res.render('index', {locals:locals,sections:sectionsDb});
	});
	
    
});

app.get('/admin', function(req,res){
    locals.date = new Date().toLocaleDateString();
	
	var appDb = dirty('app.db'),
		sectionsDb = dirty('sections.db'),
		templatesDb = dirty('templates.db');
	
	appDb.on('load', function() {
		sectionsDb.forEach(function(key, val) {
			console.log('Found key: %s, val: %j', key, val);
		});
	
		res.render('admin', {locals:locals,sections:sectionsDb,templates:templatesDb,app:appDb});
	});
});

app.post('/admin/app', function(req,res){
	appDb = dirty('app.db');
	console.log('save app.');
	
	appDb.on('load', function() {
		console.log('save app----');
		appDb.set('app',{title:req.body["title"],description:req.body["description"],keywords:req.body["keywords"]}, function() {
			console.log('Added mobile %s.', appDb.get('app'));
		});
	});
	
	appDb.on('drain', function() {
		console.log('app is saved on disk.');
		res.render('admin', {locals:locals,app:appDb,sections:[],msg:"Saved"});
	});
});


app.post('/admin/page', function(req,res){
	appDb = dirty('app.db');
	console.log('save page.');
	
	appDb.on('load', function() {
		console.log('save page----');
		appDb.set('page',req.body}, function() {
			console.log('Saved page %s.', appDb.get('app'));
		});
	});
	
	appDb.on('drain', function() {
		console.log('app is saved on disk.');
		res.render('admin', {locals:locals,app:appDb,sections:[],msg:"Saved"});
	});
});

app.post('/admin/sections/:k', function(req,res){
	var appDb = dirty('app.db'),
		sectionsDb = dirty('sections.db'),
		key = req.params["k"],
		//section = req.body["section"],
		//content = req.body["content"];
		vals = req.body;
	
	console.log("saving");
	
	if (typeof key!="undefined") {
		sectionsDb.on('load', function() {
			sectionsDb.set(key,vals, function() {
				console.log('Added content', sectionsDb.get(key));
			});
			//res.render('admin', {locals:locals,app:appDb,sections:sectionsDb,msg:"Saved Section: "+key});
			res.redirect("/admin");
		});
	}
	else {
		res.render('error');
	}
	
});

app.del('/admin/sections/:k', function(req,res){
	var appDb = dirty('app.db'),
		sectionsDb = dirty('sections.db'),
		key = req.params["k"],
		section = req.body["section"];
	
	if (typeof key!="undefined") {
		sectionsDb.rm(key, function() {
			console.log('Deleted section');
		});
	}
	
	sectionsDb.on('drain', function() {
		res.redirect('/admin');
	});
	
})

app.post('/admin/sections/all', function(req,res){
	var appDb = dirty('app.db'),
		sectionsDb = dirty('sections.db'),
		sections = req.body["section"],
		contents = req.body["content"];
	
	console.log(sections.toString());
	console.log(contents.toString());
	
	var i=0;
	sections.forEach(function() {
		sectionsDb.set(sections[i],{content:contents[i]}, function() {
			console.log('Added content %s.', sectionsDb.get(sections[i]));
		});
		i++;
	});
	
	res.render('admin', {locals:locals,app:appDb,sections:sectionsDb,msg:"Saved Sections"});
});

app.post('/admin/sections', function(req,res){
	var appDb = dirty('app.db'),
		sectionsDb = dirty('sections.db'),
		section = req.body["section"],
		content = req.body["content"];
	
	if (typeof section!="undefined") {
		sectionsDb.set(section,{content:content}, function() {
			console.log('Added content', sectionsDb.get(section));
			res.redirect('/admin');
		});
	}
	else {
		res.redirect('/error');
	}

});

app.get('/admin/templates/:k', function(req,res){
	locals.date = new Date().toLocaleDateString();

	var appDb = dirty('app.db'),
		sectionsDb = dirty('sections.db'),
		templatesDb = dirty('templates.db'),
		key = req.params["k"];
		
	locals.id = key;
	
	if (typeof key!="undefined") {
		templatesDb.on('load', function() {
			res.render("admin",{locals:locals,templates:templatesDb,sections:sectionsDb,app:appDb,template:templatesDb.get(key)});
		});
	}
	else {
		res.render('error');
	}
	
});

app.post('/admin/templates/:k', function(req,res){
	var appDb = dirty('app.db'),
		templatesDb = dirty('templates.db'),
		key = req.params["k"],
		vals = req.body;
	
	console.log("saving");
	
	if (typeof key!="undefined") {
		templatesDb.on('load', function() {
			templatesDb.set(key,vals, function() {
				console.log('Template saved', templatesDb.get(key));
			});
			res.redirect("/admin");
		});
	}
	else {
		res.render('error');
	}
});

app.del('/admin/templates/:k', function(req,res){
	console.log("deleting template");
	
	var appDb = dirty('app.db'),
		templatesDb = dirty('templates.db'),
		key = req.params["k"];
	
	if (typeof key!="undefined") {
		templatesDb.rm(key, function() {
			console.log('Deleted template');
		});
	}
	
	templatesDb.on('drain', function() {
		res.redirect('/admin');
	});
	
})

/* The 404 Route (ALWAYS Keep this as the last route) */
app.get('/*', function(req, res){
    res.render('404.ejs', locals);
});