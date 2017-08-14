var sqlite3 = require('sqlite3').verbose()

class Groups{
  constructor(){
  }

  static insertData(conn,req){
    conn.run(`INSERT INTO groups (groupname) VALUES ('${req.groupname}'
  )`)
  }

  static remove(conn,id){
    conn.run(`DELETE FROM groups WHERE id = ${id}`)
  }

  static update(conn,req,id){
    conn.run(`UPDATE groups SET groupname = '${req.groupname}' WHERE id = '${id}'`)
  }

  static findAll(conn){
    return new Promise(function(resolve, reject) {
      var query = `SELECT * FROM groups`;
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
      var query = `SELECT * FROM groups WHERE id = ${req.id}`;
      conn.all(query, function (err,data) {
        if(!err){
          resolve(data)
        } else {
          reject(err)
        }
      })
    });
  }

}

module.exports = Groups;
