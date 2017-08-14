var sqlite3 = require('sqlite3').verbose();

class Profiles{
  constructor(){
  }

  static insertData(conn,req){
    conn.run(`INSERT INTO profiles (username,password,first_name,last_name) VALUES ('${req.username}','${req.password}','${req.first_name}','${req.last_name}');`);
  }

  static remove(conn,id){
    conn.run(`DELETE FROM profiles WHERE id =${id}`)
  }

  static update(conn,req,id){
    conn.run(`UPDATE profiles SET username = '${req.username}',password = '${req.password}',first_name = '${req.first_name}',last_name = '${req.last_name}' WHERE id = '${id}'`)
  }

  static findAll (conn){
    return new Promise(function(resolve, reject) {
      var query = `SELECT * FROM profiles`;
      conn.all(query, function(err,data){
        if (!err) {
          resolve(data)
        } else {
          reject(err)
        }
      })
    });
  }

  static findById (conn,req){
    return new Promise(function(resolve, reject) {
      var query = `SELECT * FROM profiles WHERE id = ${req.id}`;
      conn.all(query, function (err,data) {
        if (!err) {
          resolve(data)
        } else {
          reject(err)
        }
      })
    });
  }

  static conjunctionProfId (conn,id){
    return new Promise(function(resolve, reject) {
      var query = `SELECT groups.groupname FROM profilegrup JOIN groups ON groups.id = profilegrup.groups_id WHERE profiles_id = ${id}`;
      conn.all(query, function (err,data) {
        if (!err){
          resolve(data)
        } else {
          reject(err)
        }
      })
    });
  }

}

module.exports = Profiles;
