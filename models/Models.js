class Models{
  constructor(){}

  findAll(db, table){
    return new Promise((resolve, reject)=>{
      let qry = `SELECT * FROM ${table}`;
      db.all(qry, (err, rows)=>{
        if(!err){
          resolve(rows);
        }else{
          reject(err);
        }
      });
    });
  }

  findById(db, table, id){
    return new Promise((resolve, reject)=>{
      let qry = `SELECT * FROM ${table} WHERE id=${id}`;
      db.each(qry, (err, row)=>{
        if(!err){
          resolve(row);
        }else{
          reject(err);
        }
      });
    });
  }

  createData(db, table, obj){
    switch(table){
      case 'Contacts' :
        return new Promise((resolve, reject)=>{
          let qryCont = `INSERT INTO ${table} (name, company, phone, email) VALUES (
            '${obj.name}',
            '${obj.company}',
            '${obj.phone}',
            '${obj.email}')`;
          db.run(qryCont, (err, redirect)=>{
            if(!err){
              resolve(redirect);
            }else{
              reject(err);
            }
          });
        });
        break;
      case 'Profiles' :
        return new Promise((resolve, reject)=>{
          let qryProf = `INSERT INTO ${table} (hometown, birth_year, relationship_status, contacts_id) VALUES (
            '${obj.hometown}',
            '${obj.birth_year}',
            '${obj.relationship_status}',
            '${obj.contacts_id}')`;
          db.run(qryProf, (err, redirect)=>{
            if(!err){
              resolve(redirect);
            }else{
              reject(err);
            }
          });
        });
        break;
      case 'Addresses' :
        return new Promise((resolve, reject)=>{
          let qryAdd = `INSERT INTO ${table} (street, city, zip_code, contacts_id) VALUES (
            '${obj.street}',
            '${obj.city}',
            '${obj.zip_code}',
            '${obj.contacts_id}')`;
          db.run(qryAdd, (err, redirect)=>{
            if(!err){
              resolve(redirect);
            }else{
              reject(err);
            }
          });
        });
        break;
      case 'Groups' :
        return new Promise((resolve, reject)=>{
          let qryGrou = `INSERT INTO ${table} (group_name) VALUES (
            '${obj.group_name}')`;
          db.run(qryGrou, (err, redirect)=>{
            if(!err){
              resolve(redirect);
            }else{
              reject(err);
            }
          });
        });
        break;
      case 'GroupsContact' :
        return new Promise((resolve, reject)=>{
          let qryGrCo = `INSERT INTO ${table} (groups_id, contacts_id) VALUES (
            '${obj.groups_id}',
            '${obj.contacts_id}')`;
          db.run(qryGrCo, (err, redirect)=>{
            if(!err){
              resolve(redirect);
            }else{
              reject(err);
            }
          });
        });
        break;
      default :
        console.log('Table not found!');
    }
  }

  update(db, table, obj, id){
    switch (table) {
      case 'Contacts':
        let qryCont = `UPDATE ${table} SET
          name='${obj.name}',
          company='${obj.company}',
          phone='${obj.phone}',
          email='${obj.email}'
          WHERE id=${id}`;
        db.run(qryCont);
        break;
      case 'Profiles':
        let qryProf = `UPDATE ${table} SET
          hometown='${obj.hometown}',
          birth_year='${obj.birth_year}',
          relationship_status='${obj.relationship_status}'
          WHERE id=${id}`;
        db.run(qryProf);
        break;
      case 'Addresses':
        let qryAdd = `UPDATE ${table} SET
          street='${obj.street}',
          city='${obj.city}',
          zip_code='${obj.zip_code}'
          WHERE id=${id}`;
        db.run(qryAdd);
        break;
      case 'Groups':
        let qryGrou = `UPDATE ${table} SET
          group_name='${obj.group_name}'
          WHERE id=${id}`;
        db.run(qryGrou);
        break;
      default:
        console.log('Table not found!');
    }
  }

  remove(db, table, id){
    let qry = `DELETE FROM ${table} WHERE id=${id}`;
    db.run(qry);
  }

}

module.exports = Models;
