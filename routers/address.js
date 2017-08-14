var express = require('express');
var path = require('path')
var app = express()

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db/data.db')

var router = express.Router()

var addressModel = require('../models/address')

var dbModel = require('../models/dbmodel')
var conn = new dbModel()

router.get('/', function (req,res){
  addressModel.findAll(conn.connection)
  .then(rows =>{
    res.render('address',{address:rows})
  })
})

router.post('/', function (req,res){
  addressModel.insertData(conn.connection,req.body)
  res.redirect('/address')
})

router.get('/delete/:id', function (req,res) {
  addressModel.remove(conn.connection,req.params.id)
  res.redirect('/address')
})

router.post('/editaddress/:id', function (req,res){
  addressModel.update(conn.connection,req.body,req.params.id)
  res.redirect('/address')
})

router.get('/editaddress/:id', function(req,res){
  addressModel.findById(conn.connection,req.params)
  .then(rows =>{
    res.render('editaddress',{input:rows})
  })
})

module.exports = router;
