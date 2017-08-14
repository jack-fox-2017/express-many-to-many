var express = require('express');
var path = require ('path');
var app = express()
var bodyParser = require ('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.set('view engine', 'ejs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/data.db');

app.use(express.static(path.join(__dirname, 'public')))

routegroups = require('./routers/groups')
routeprofiles = require('./routers/profiles')
routercontacs = require('./routers/contacts')
routeraddreess = require('./routers/address')

app.use('/groups', routegroups)
app.use('/profiles', routeprofiles);
app.use('/contacts', routercontacs);
app.use('/address', routeraddreess)

app.listen(3000)
