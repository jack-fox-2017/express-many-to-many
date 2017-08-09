const express = require('express');
const router = express.Router();
const dbModel = require('../models/DBModel');
const Model = require('../models/Models');

const pathDB = './db/data.db';
const db = new dbModel(pathDB);
const model = new Model();

let cont = 'Contacts';
let grou = 'Groups';
let grco = 'GroupsContact';

router.get('/', (req, res)=>{
  model.findAll(db.connection, cont)
    .then(contacts=>{
      model.findAll(db.connection, grou)
        .then(groups=>{
          res.render('contacts', {dataContacts: contacts, dataGroups: groups});
        })
        .catch(err=>{
          res.send(err.toStri());
        });
    })
    .catch(err=>{
      res.send(err.toString());
    });
});

router.post('/', (req, res)=>{
  let obj = createObjCont(req);
  model.createData(db.connection, cont, obj)
    .then(redirect=>{
      model.findAll(db.connection, cont)
        .then(contacts=>{
          let objGC = {groups_id:req.body.groups_id, contacts_id:contacts[contacts.length-1].id}
          model.createData(db.connection, grco, objGC)
            .then(redirect=>{
              res.redirect('/contacts');
            })
            .catch(err=>{
              res.send(err.toString());
            });
        })
    })
    .catch(err=>{
      res.send(err.toString());
    });
});

router.get('/edit/:id', (req, res)=>{
  let id = req.params.id;
  model.findById(db.connection, cont, id)
    .then(contact=>{
      res.render('edit-contact', {data:contact});
    })
    .catch(err=>{
      res.send(err.toString());
    });
});

router.post('/edit/:id', (req, res)=>{
  let id = req.params.id;
  let obj = createObjCont(req);
  model.update(db.connection, cont, obj, id);
  res.redirect('/contacts');
});

router.get('/delete/:id', (req, res)=>{
  let id = req.params.id;
  model.remove(db.connection, cont, id);
  res.redirect('/contacts');
});

function createObjCont(req){
  let obj = {};
  obj['name'] = req.body.name;
  obj['company'] = req.body.company;
  obj['phone'] = req.body.phone;
  obj['email'] = req.body.email;
  return obj;
}

module.exports = router;
