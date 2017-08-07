const express = require('express')
let router = express.Router()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/data.db')

router.get('/', (req, res) => {
  db.all(`SELECT * FROM groups`, (err, rows) => {
    if (err) throw err
    res.render('groups', {data: rows})
  })
})

router.post('/', (req, res) => {
  db.run(`INSERT INTO groups (name_of_group) VALUES ('${req.body.name_of_group}')`)

  // if (req.body.group_id != '')
  //   db.run(`INSERT INSTO groups_contacts (contact_id, group_id) VALUES (
  //     ${db.lastInsertRowId},
  //     ${req.body.group_id}
  //   )`)

  res.redirect('/groups')
})

router.get('/edit/:id', (req, res) => {
  db.all(`SELECT * FROM groups WHERE id=${req.params.id}`, (err, rows) => {
    if (err) throw err
    res.render('groups-edit', {data: rows})
  })
})

router.post('/edit/:id', (req, res) => {
  db.run(`UPDATE groups SET
    name_of_group = '${req.body.name_of_group}'
  WHERE id = ${req.params.id}`)

  //

  res.redirect('/groups')
})

router.get('/delete/:id', (req, res) => {
  db.run(`DELETE FROM groups WHERE id = ${req.params.id}`)
  res.redirect('/groups')
})

module.exports = router
