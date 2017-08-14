var express = require ('express');
var path = require ('path');
var app = express()

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/data.db')

var router = express.Router()

var profilesModel = require('../models/profiles')

var dbModel = require('../models/dbmodel')
var conn = new dbModel()


router.get ('/', function(req,res){
  profilesModel.findAll(conn.connection)
  .then(rows =>{
      rows.forEach((row, i) =>{
        profilesModel.conjunctionProfId(conn.connection, row.id) // conjuction yang memiliki profiles_id = row.id dimana dia adalah profiles
         .then(teja =>{
           rows[i].groups = teja.map(harsony =>{
             return harsony.groupname
           }).join(",") // semua groups yang kita ambil dijadikan string
            // console.log(rows);
            if (i == rows.length - 1) {
               res.render('profiles', {profiles: rows})
            }
         })



      })
    // res.render('profiles', {profiles:rows})

  })
})

router.post ('/', function(req,res){
  profilesModel.insertData(conn.connection, req.body)
  res.redirect('/profiles')
})

router.get ('/delete/:id', function (req,res) {
  profilesModel.remove(conn.connection,req.params.id)
  res.redirect('/profiles')
})

router.get ('/editprofiles/:id', function (req,res) {
  profilesModel.findById(conn.connection, req.params)
  .then(rows =>{
    res.render('editprofiles', {input:rows})
  })
})

router.post ('/editprofiles/:id', function(req,res){
  profilesModel.update(conn.connection, req.body, req.params.id)
  res.redirect('/profiles')
})

module.exports = router;
