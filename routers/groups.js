const express = require('express');
const router = express.Router();
const dbModel = require('../models/DBModel');
const Model = require('../models/Models');

const pathDB = './db/data.db';
const db = new dbModel(pathDB);
const model = new Model();

let grou = 'Groups';
let cont = 'Contacts';
let grco = 'GroupsContact';

router.get('/', (req, res)=>{
  model.findAll(db.connection, grou)
    .then(groups=>{
      model.findAll(db.connection, cont)
        .then(contacts=>{
          model.findAll(db.connection, grco)
            .then(groupsContact=>{
              manipulateGroups(groupsContact, groups, contacts, d_groups=>{
                res.render('groups', {dataGroups:d_groups});
              })
            })
            .catch(err=>{
              res.send(err.toString());
            })
        })
        .catch(err=>{
          res.send(err.toString());
        })
    })
    .catch(err=>{
      res.send(err.toString());
    })
});

function manipulateGroups(gc, groups, contacts, cb){
  groups.forEach(group=>{
    let member = [];
    gc.forEach(groupCon=>{
      if(groupCon.groups_id == group.id){
        contacts.forEach(contact=>{
          if(groupCon.contacts_id == contact.id){
            member.push(contact.name);
          }
        })
      }
    })
    group['members'] = member.join(', ');
  })
  cb(groups);
}

router.post('/', (req, res)=>{
  let obj = createObjGrou(req);
  model.createData(db.connection, grou, obj)
    .then(redirect=>{
      res.redirect('/groups');
    })
    .catch(err=>{
      res.send(err.toString());
    });
});

router.get('/edit/:id', (req, res)=>{
  let id = req.params.id;
  model.findById(db.connection, grou, id)
    .then(group=>{
      res.render('edit-groups', {data:group});
    })
    .catch(err=>{
      res.send(err.toString());
    });
});

router.get('/assign_contact/:id', (req, res)=>{
  model.findAll(db.connection, cont)
    .then(contacts=>{
      model.findById(db.connection, grou, req.params.id)
        .then(group=>{
          res.render('assign-contact', {dataContacts:contacts, dataGroup:group});
        })
        .catch(err=>{
          res.send(err.toString());
        })
    })
    .catch(err=>{
      res.send(err.toString());
    });
});

router.post('/assign_contact/:id', (req, res)=>{
  let obj = {contacts_id:req.body.contacts_id,groups_id:req.params.id};
  model.createData(db.connection, grco, obj)
    .then(redirect=>{
      res.redirect('/groups');
    })
    .catch(err=>{
      res.send(err.toString());
    })
});

router.post('/edit/:id', (req, res)=>{
  let obj = createObjGrou(req);
  let id = req.params.id;
  model.update(db.connection, grou, obj, id);
  res.redirect('/groups');
});

router.get('/delete/:id', (req, res)=>{
  let id = req.params.id;
  model.remove(db.connection, grou, id);
  res.redirect('/groups');
});

function createObjGrou(req){
  let obj = {};
  obj['group_name'] = req.body.group_name;
  return obj;
}

module.exports = router;
