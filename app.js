const express = require('express');
const app = express();
const bodyParser = require('body-parser');

let routeIndex = require('./routers/index');
let routeContact = require('./routers/contacts');
let routeGroups = require('./routers/groups');

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', routeIndex);
app.use('/contacts', routeContact);
app.use('/groups', routeGroups);

app.listen(3000, ()=>{
  console.log('listening on port 3000');
});
