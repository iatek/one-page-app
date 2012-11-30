var port = process.env.PORT || 4000,
    app = require('./app').init(port),
	dirty = require('dirty');
	
var locals = {
	author:'in1'
    //layout:'layout'
	// add other vars here
};

var userDb = dirty('user.db');

app.get('/', function(req,res){
    locals.date = new Date().toLocaleDateString();
	
	var appDb = dirty('app.db'),
		sectionsDb;
	
	appDb.on('load', function() {
		sectionsDb = dirty('sections.db');
		sectionsDb.on('load', function() {
			/*
			sectionsDb.forEach(function(key, val) {
				console.log('Found key: %s, val: %j', key, val);
			});
			*/
			res.render('index.ejs', {locals:locals,sections:sectionsDb,app:appDb.get('app'),page:appDb.get('page')});
		});
	});
});

app.get('/login', function(req,res){
	var appDb = dirty('app.db'),
		sectionsDb;
	
	appDb.on('load', function() {
		sectionsDb = dirty('sections.db');
		sectionsDb.on('load', function() {
		res.render('login', {locals:locals,sections:sectionsDb,app:appDb.get('app'),page:appDb.get('page')});
		});
	});

});

app.post('/login', function(req,res){

	console.log("logging in");
    
    if (req.body.password=="foo") {
        req.session.loggedIn=true;
	    res.redirect('/admin');
    }
    else {
        
         res.redirect('/');
    }

});

app.get('/logout', function(req,res){

	console.log("logging out");
	delete req.session.loggedIn;
	res.redirect('/');

});

app.get('/admin', function(req,res){
    locals.date = new Date().toLocaleDateString();
	
	//console.log("cookies:"+JSON.stringify(req.cookies));
	//console.log("session:"+JSON.stringify(req.session));
	
	if (req.session.loggedIn) {
		var appDb = dirty('app.db');
		appDb.on('load', function() {
			sectionsDb = dirty('sections.db');
			sectionsDb.on('load', function() {
				/*
				sectionsDb.forEach(function(key, val) {
					console.log('Found key: %s, val: %j', key, val);
				});
				*/
				templatesDb = dirty('templates.db');
				templatesDb.on('load', function() {
					res.render('admin', {locals:locals,sections:sectionsDb,templates:templatesDb,app:appDb.get('app'),page:appDb.get('page'),msg:req.param["msg"]});
				});
			});
		});
		
	}
	else {
		//res.render('login');
		res.redirect('/login');
	}
});

app.post('/admin/app', function(req,res){
	appDb = dirty('app.db');
	console.log('save app.');
	
	appDb.on('load', function() {
		console.log('save app----');
		//appDb.set('app',{title:req.body["title"],description:req.body["description"],keywords:req.body["keywords"]}, function() {
		appDb.set('app',req.body, function() {
			console.log('Added mobile %s.', appDb.get('app'));
		});
	});
	
	appDb.on('drain', function() {
		console.log('app is saved on disk.');
		
		sectionsDb = dirty('sections.db');
		sectionsDb.on('load', function() {
			/*
			sectionsDb.forEach(function(key, val) {
				console.log('Found key: %s, val: %j', key, val);
			});
			*/
			templatesDb = dirty('templates.db');
			templatesDb.on('load', function() {
				res.render('admin', {locals:locals,sections:sectionsDb,templates:templatesDb,app:appDb.get('app'),page:appDb.get('page'),msg:"App Settings Saved."});
			});
		});
	
		//res.redirect("/admin");
	});
});

app.post('/admin/page', function(req,res){
	appDb = dirty('app.db');
	console.log('save page.');
	
	appDb.on('load', function() {
		console.log('save page----');
		appDb.set('page',req.body, function() {
			console.log('Saved page %s.', appDb.get('app'));
		});
	});
	
	appDb.on('drain', function() {
		console.log('app page is saved on disk.');
		res.redirect("/admin");
	});
});

app.post('/admin/sections', function(req,res){
	var sectionsDb = dirty('sections.db'),
		key = req.body["section"],
		vals = req.body;
	
	console.log("create section");
	
	sectionsDb.on('load', function() {
		sectionsDb.set(key,vals, function() {
			console.log('Added content %s', sectionsDb.get(key));
			res.redirect("/admin#form"+key);
			/*
			appDb = dirty('app.db');
			appDb.on('load', function() {
				templatesDb = dirty('templates.db');
				templatesDb.on('load', function() {
					res.render('admin', {locals:locals,sections:sectionsDb,templates:templatesDb,app:appDb.get('app'),page:appDb.get('page'),msg:"Section '"+ key + "' created."});
				});
			});
			*/
		});
	});
});

app.post('/admin/sections/:k', function(req,res){
	var appDb = dirty('app.db'),
		sectionsDb = dirty('sections.db'),
		key = req.params["k"],
		//section = req.body["section"],
		//content = req.body["content"];
		vals = req.body;
	
	console.log("saving section:"+key);
	
	if (typeof key!="undefined") {
		sectionsDb.on('load', function() {
			sectionsDb.set(key,vals, function() {
				console.log('Added content', sectionsDb.get(key));
			});
			//res.redirect("/admin");
			res.send('Section saved.');
		});
	}
	else {
		res.send('Section not saved.');
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
		
		sectionsDb.on('drain', function() {
			/*
			appDb.on('load', function() {
				templatesDb = dirty('templates.db');
				templatesDb.on('load', function() {
					res.render('admin', {locals:locals,sections:sectionsDb,templates:templatesDb,app:appDb.get('app'),page:appDb.get('page'),msg:"Section '"+ key + "' deleted."});
				});
			});
			*/
			res.send('Section deleted.');
		});
	}
	else {
		res.send('Section delete failed.')
	}
})

app.post('/admin/sections/all', function(req,res){
	var appDb = dirty('app.db'),
		sectionsDb = dirty('sections.db'),
		sections = req.body["section"],
		contents = req.body["content"];
	
	//console.log(sections.toString());
	//console.log(contents.toString());
	
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
		key = req.params["k"];
		
	locals.id = key;
	
	if (typeof key!="undefined") {
		appDb.on('load', function() {
			sectionsDb = dirty('sections.db');
			sectionsDb.on('load', function() {
				templatesDb = dirty('templates.db');
				templatesDb.on('load', function() {
					res.render("admin",{locals:locals,templates:templatesDb,sections:sectionsDb,app:appDb.get('app'),page:appDb.get('page'),template:templatesDb.get(key)});
				});
			});
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
			//res.redirect("/admin");
			res.send('Thank you.');
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

app.post('/contact', function(req,res){
	appDb = dirty('app.db');
	console.log('contact form submit.');
	
	appDb.on('load', function() {
		console.log('Form submitted.');
		res.send('Thank you.');
	});
});

/* The 404 Route (ALWAYS Keep this as the last route) */
app.get('/*', function(req, res){
    res.render('404.ejs', locals);
});