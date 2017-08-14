var sqlite3 = require('sqlite3').verbose()

class Contacts {
  constructor() {
  }

  static insertData(conn,req){
    conn.run(`INSERT INTO contacts (telp_number,email,name,company) VALUES (${req.telp_number},'${req.email}','${req.name}','${req.company}');`);
  }

  static remove(conn,id){
    conn.run(`DELETE FROM contacts WHERE id = ${id}`)
  }

  static update(conn,req,id){
    conn.run(`UPDATE contacts SET
      telp_number = '${req.telp_number}',email = '${req.email}',name = '${req.name}', company = '${req.company}' WHERE id = '${id}'`)
  }

  static findAll(conn){
    return new Promise(function(resolve, reject) {
      var query = `SELECT * FROM contacts`;
      conn.all(query, function (err,data) {
        if(!err){
          resolve(data)
        } else {
          reject(err)
        }
      })
    });
  }

  static findById(conn,req){
    return new Promise(function(resolve, reject) {
      var query = `SELECT * FROM contacts WHERE id = ${req.id}`;
      conn.all(query, function (err,data) {
        if (!err) {
          resolve(data)
        } else {
          reject(!err)
        }
      })
    });
  }

}

module.exports = Contacts;
