var express = require ('express');
var path = require ('path');
var app = express();

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db/data.db')

var router = express.Router()

var groupsModel = require('../models/groups');

var dbModel = require('../models/dbmodel');

var conn = new dbModel()

router.get ('/', function (req,res) {
  groupsModel.findAll(conn.connection)
  .then(rows =>{
    res.render('groups', {groups:rows})
  })
})

router.post ('/', function (req,res){
  groupsModel.insertData(conn.connection,req.body)
  res.redirect('/groups')
})

router.get ('/delete/:id', function (req,res) {
  groupsModel.remove(conn.connection,req.params.id)
  res.redirect('/groups')
})

router.get ('/editgroups/:id', function(req,res){
  groupsModel.findById(conn.connection,req.params)
  .then(rows =>{
    res.render('editgroups', {input:rows})
  })
})

router.post ('/editgroups/:id', function (req,res) {
  groupsModel.update(conn.connection,req.body,req.params.id)
  res.redirect('/groups')
})

module.exports = router;
