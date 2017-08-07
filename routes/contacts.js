const express = require('express')
let router = express.Router()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/data.db')

router.get('/', (req, res) => {
  db.all(`SELECT * FROM contacts`, (errC, rowsC) => {
    if (errC) throw errC
    
    db.serialize(function(){
      rowsC.forEach(rowC => {
        db.all(`
          SELECT groups.name_of_group
            FROM groups_contacts
              JOIN groups
                ON groups.id = groups_contacts.group_id
                  WHERE groups_contacts.contact_id = ${rowC.id}
        `, function(errGName, rowsGName) {
          if (errGName) throw errGName

          rowC.groups_name = rowsGName.map(item => {return item.name_of_group}).join(', ')
        })
      })

      db.all(`SELECT * FROM groups`, (errG, rowsG) => {
        if (errG) throw errG
        res.render('contacts', {
          data: rowsC,
          groups: rowsG
        })
      })
    })
  })
})

router.post('/', (req, res) => {
  db.run(`INSERT INTO contacts (name, company, telp_number, email) VALUES (
    '${req.body.name}',
    '${req.body.company}',
    '${req.body.telp_number}',
    '${req.body.email}'
  )`, function() {

    if (req.body.hasOwnProperty('group_ids') && req.body.group_ids.length > 0) {
      let contact_id = this.lastID
      req.body.group_ids.forEach(item => {
        db.run(`INSERT INTO groups_contacts (contact_id, group_id) VALUES (
          ${contact_id},
          ${item}
        )`)
      })

      res.redirect('/contacts')
    }
  })

})

router.get('/edit/:id', (req, res) => {
  db.get(`SELECT * FROM contacts WHERE id=${req.params.id}`, (errC, rowC) => {
    if (errC) throw errC

    db.all(`
        SELECT
        groups.*,
        groups_contacts.contact_id
        FROM groups
          LEFT JOIN groups_contacts
            ON groups_contacts.group_id = groups.id
              AND groups_contacts.contact_id = ${req.params.id}
      `, (errG, rowsG) => {
      if (errG) throw errG

      res.render('contacts-edit', {
        data: rowC,
        groups: rowsG
      })
    })
  })
})

router.post('/edit/:id', (req, res) => {
  db.run(`UPDATE contacts SET
    name = '${req.body.name}',
    company = '${req.body.company}',
    telp_number = '${req.body.telp_number}',
    email = '${req.body.email}'
    WHERE id = ${req.params.id}
  `, function() {

    if (req.body.hasOwnProperty('group_ids') && req.body.group_ids.length > 0) {
      db.run(`DELETE FROM groups_contacts WHERE contact_id = ${req.params.id}`, () => {

        req.body.group_ids.forEach(item => {
          db.run(`INSERT INTO groups_contacts (contact_id, group_id) VALUES (
            ${req.params.id},
            ${item}
          )`)
        })

        res.redirect('/contacts')
      })
    }
  })
})

router.get('/delete/:id', (req, res) => {
  db.run(`DELETE FROM contacts WHERE id = ${req.params.id}`)
  db.run(`DELETE FROM groups_contacts WHERE contact_id = ${req.params.id}`)
  res.redirect('/contacts')
})

module.exports = router
