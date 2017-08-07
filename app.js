var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var app = express()
var database = require('./setup');
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('./db/database.db');

app.set('view engine', 'ejs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, '/public')));
//sett database and checkit up
app.get('/setupdb', function(req, res){
	database()
	res.send('Berhasil setup database')
})

//halaman index route
app.get('/', function(req, res){
	res.render('index')
})

//contact route
app.get('/contact', function(req, res){
	db.all(`SELECT * FROM Contact`, function(err, rows){
		db.sequelize(function(){
			rows.forEach(r =>{
				db.all(`SELECT Groups.name_group FROM ContactGroup
					JOIN Groups ON Groups.id = ContactGroup.groups_id
					WHERE ContactGroup.contact_id = ${r.id}`)
			})
		})
		res.render('contact', {contact_data : rows})
	})
})

app.get('/addContact', function(req, res){
	db.all(`SELECT id, name_group FROM Groups`, function(err, data){
		res.render('addContact', {groups : data})
	})
})

app.post('/addContact', function(req, res){
	db.run(`INSERT INTO Contact(name, company, telp_number, email, groups_id) VALUES ('${req.body.name}', '${req.body.company}', '${req.body.telp_number}', '${req.body.email}','${req.body.groups_id}')`)
 	res.redirect('/contact');
})

app.get('/contact/edit/:id', function (req, res){
	db.all(`SELECT * FROM Contact WHERE id = '${req.params.id}'`, function(err, rows){
		res.render('editContact', {edit_contact: rows});
	});
});

app.post('/contact/edit/:id', function(req, res){
	db.run(`UPDATE Contact SET name ='${req.body.name}', company = '${req.body.company}',telp_number ='${req.body.telp_number}',email ='${req.body.email}', groups_id ='${req.body.groups_id}' WHERE id = '${req.params.id}'`)
	res.redirect('/contact')
});

app.get('/contact/delete/:id', function (req, res) {
	db.run(`DELETE FROM Contact WHERE id = '${req.params.id}' `, function(err, rows){
		res.redirect('/contact');
	});
});

//profile route
app.get('/profile', function(req, res){
	db.all(`SELECT * FROM Profile`, function(err, rows){
		res.render('profile', {profile_data: rows})
	})
})

app.get('/addProfile', function(req, res){
	db.all(`SELECT id, name FROM Contact`, function(err, data){
		res.render('addProfile', {contact: data, err_msg: false})
	})
})

app.post('/addProfile', function(req, res){
	db.all(`SELECT id, name FROM Contact`, function(err, data){
		db.run(`INSERT INTO Profile(nickname, account, contact_id) VALUES ('${req.body.nickname}', '${req.body.account}', '${req.body.contact_id}')`, function(err){
			if(!err){
				res.redirect('/profile')
			} else{
				res.render('addProfile', {contact: data, err_msg: "Kontak sudah terpakai, Pilih lainnya!!"})
			}
		})
	})
})

app.get('/profile/edit/:id', function(req, res){
	db.all(`SELECT * FROM Profile WHERE id = '${req.params.id}'`, function(err, rows){
		if(!err){
			db.all(`SELECT id, name FROM Contact`, function(err, data){
				res.render('editProfile', {edit_profile : rows, edit_contact:data, err_msg : false})
			})
		}
	})
})

app.post('/profile/edit/:id', function(req, res){
	let queryUpdate = `UPDATE Profile SET nickname = '${req.body.nickname}',
	account = '${req.body.account}',
	contact_id = '${req.body.contact_id}' WHERE id = '${req.params.id}'`

	db.all(`SELECT * FROM Profile WHERE id = '${req.params.id}'`, function(err, rows){
		if(!err){
			db.all(`SELECT * FROM Contact`, function(err, data){
				db.run(queryUpdate, function(err2){
					if(!err2){
						res.redirect('/profile')
					}
					else{
						res.render('editProfile', {edit_profile : rows, edit_contact:data, err_msg : "Maaf, kontak tersebut sudah digunakan"})
					}
				})
			})
		}
	})
})

app.get('/profile/delete/:id', function(req, res){
	db.run(`DELETE FROM Profile WHERE id = '${req.params.id}'`, function(err, rows){
		res.redirect('/profile')
	})
})

//address route
app.get('/address', function(req, res){
	db.all(`SELECT * FROM Address`, function(err, rows){
		res.render('address', {address_data: rows})
	})
})

app.get('/addAddress', function(req, res){
	db.all(`SELECT id, name FROM Contact`, function(err, data){
		res.render('addAddress', {contact: data})
	})
})

app.post('/addAddress', function(req, res){
	db.run(`INSERT INTO Address(street_name, city, province, zipcodes, contact_id) VALUES ('${req.body.street_name}', '${req.body.city}', '${req.body.province}', '${req.body.zipcodes}', '${req.body.contact_id}')`)
	res.redirect('/address')
})

app.get('/address/edit/:id', function(req, res){
	db.all(`SELECT * FROM Address WHERE id = '${req.params.id}'`, function(err, rows){
		if(!err){
			db.all(`SELECT id, name FROM Contact`, function(err, data){
				res.render('editAddress', {edit_address : rows, edit_contact:data})
			})
		}
	})
})

app.post('/address/edit/:id', function(req, res){
	db.run(`UPDATE Address SET street_name = '${req.body.street_name}', city = '${req.body.city}', province = '${req.body.province}', zipcodes = '${req.body.zipcodes}', contact_id = '${req.body.contact_id}' WHERE id = '${req.params.id}'`)
	res.redirect('/address')
})

app.get('/address/delete/:id', function(req, res){
	db.run(`DELETE FROM Address WHERE id = '${req.params.id}'`, function(err, rows){
		res.redirect('/address')
	})
})

app.get('/address_with_contact/:id', function(req, res){
	db.all(`SELECT * FROM Address WHERE id = '${req.params.id}'`, function(err, rows){
		if(!err){
			db.all(`SELECT * FROM Contact WHERE id = ${rows[0].contact_id}`, function(err, data){
				rows[0].company = data[0].company;
				rows[0].name = data[0].name;
				res.render('detail_address', {address: rows})
			})
		}
	})
})

//groups route
app.get('/groups', function(req, res){
	db.all(`SELECT * FROM Groups`, function(err, rows){
		res.render('groups', {groups_data : rows})
	})
})

app.get('/addGroups', function(req, res){
	res.render('addGroups')
})

app.post('/addGroups', function(req, res){
	db.run(`INSERT INTO Groups(name_group) VALUES ('${req.body.name_group}')`)
	res.redirect('/groups')
})

app.get('/groups/edit/:id', function(req, res){
	db.all(`SELECT * FROM Groups WHERE id = '${req.params.id}'`, function(err, rows){
		res.render('editGroups', {edit_groups: rows})
	})
})

app.post('/groups/edit/:id', function(req, res){
	db.run(`UPDATE Groups SET name_group = '${req.body.name_group}' WHERE id = '${req.params.id}'`)
	res.redirect('/groups')
})

app.get('/groups/delete/:id', function(req, res){
	db.run(`DELETE FROM Groups WHERE id = '${req.params.id}'`, function(err, rows){
		res.redirect('/groups')
	})
})



app.listen(3000, function(){
	console.log('Iam listen on port 3000')
})
