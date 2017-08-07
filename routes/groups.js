const express = require('express')
let router = express.Router()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/data.db')

router.get('/', (req, res) => {
  db.all(`SELECT * FROM groups`, (errG, rowsG) => {
    if (errG) throw errG

    db.serialize(function(){
      rowsG.forEach(rowG => {
        db.all(`
          SELECT contacts.name
            FROM groups_contacts
              JOIN contacts
                ON contacts.id = groups_contacts.contact_id
                  WHERE groups_contacts.group_id = ${rowG.id}
        `, function(errCName, rowsCName) {
          if (errCName) throw errCName

          rowG.contacts_name = rowsCName.map(item => {return item.name}).join(', ')
        })
      })

      db.all(`SELECT * FROM groups`, (errG, rowsGr) => {
        if (errG) throw errG
        res.render('groups', {
          data: rowsG,
          groups: rowsGr
        })
      })
    })
  })
})

router.post('/', (req, res) => {
  db.run(`INSERT INTO groups (name_of_group) VALUES ('${req.body.name_of_group}')`)

  res.redirect('/groups')
})

router.get('/edit/:id', (req, res) => {
  db.get(`SELECT * FROM groups WHERE id=${req.params.id}`, (err, row) => {
    if (err) throw err

    db.all(`
      SELECT
        contacts.*,
        groups_contacts.group_id
        FROM contacts
          LEFT JOIN groups_contacts
            ON groups_contacts.contact_id = contacts.id
              AND groups_contacts.group_id = ${req.params.id}
    `, (errC, rowsC) => {
      if (errC) throw errC
      res.render('groups-edit', {
        data: row,
        contacts: rowsC
      })
    })
  })
})

router.post('/edit/:id', (req, res) => {
  db.run(`UPDATE groups SET
    name_of_group = '${req.body.name_of_group}'
    WHERE id = ${req.params.id}
  `, function() {
      if (req.body.hasOwnProperty('contact_ids') && req.body.contact_ids.length > 0) {
        db.run(`DELETE FROM groups_contacts WHERE group_id = ${req.params.id}`, () => {

          req.body.contact_ids.forEach(item => {
            db.run(`INSERT INTO groups_contacts (contact_id, group_id) VALUES (
              ${item},
              ${req.params.id}
            )`)
          })

          res.redirect('/groups')
        })
      }
  })
})

router.get('/delete/:id', (req, res) => {
  db.run(`DELETE FROM groups WHERE id = ${req.params.id}`)
  db.run(`DELETE FROM groups_contacts WHERE group_id = ${req.params.id}`)
  res.redirect('/groups')
})

module.exports = router
