var express = require('express');
var path = require ('path');
var app = express()

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db/data.db')

var router = express.Router()

var contactsModel = require('../models/contacts')

var dbModel = require('../models/dbmodel')
var conn = new dbModel()

router.get ('/', function (req,res) {
  contactsModel.findAll(conn.connection)
  .then(rows =>
    res.render('contacts', {contacts:rows})
  )
})

router.post('/', function (req,res) {
  contactsModel.insertData(conn.connection,req.body)
  res.redirect('/contacts')
})

router.get('/delete/:id', function(req,res){
  contactsModel.remove(conn.connection,req.params.id)
  res.redirect('/contacts')
})

router.post('/editcontacts/:id', function (req,res) {
  contactsModel.update(conn.connection,req.body,req.params.id)
  res.redirect('/contacts')
})

router.get('/editcontacts/:id', function(req,res){
  contactsModel.findById(conn.connection,req.params)
  .then(rows =>{
    res.render('editcontacts', {input:rows})
  })
})

module.exports = router;
