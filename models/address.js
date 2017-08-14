var sqlite3 = require ('sqlite3').verbose()

class Address {
  constructor() {
  }

  static insertData(conn, req){
    conn.run(`INSERT INTO address(postal_code,city,street) VALUES ('${req.postal_code}','${req.city}','${req.street}')`)
  }

  static update(conn, req, id){
    conn.run(`UPDATE address SET postal_code = '${req.postal_code}',city = '${req.city}',street = '${req.street}' WHERE id = '${id}'`)
  }

  static remove (conn, id){
    conn.run(`DELETE FROM address WHERE id = ${id}`)
  }

  static findById(conn,req){
    return new Promise(function(resolve, reject) {
      var query = `SELECT * FROM address WHERE id = '${req.id}'`;
      conn.all(query, function (err,data){
        if (!err) {
          resolve(data)
        } else {
          reject(err)
        }
      })
    });
  }

  static findAll(conn){
    return new Promise(function(resolve, reject) {
      var query = `SELECT * FROM address`
      conn.all(query, function(err,data){
        if (!err){
          resolve(data)
        } else {
          reject(err)
        };
      })
    });
  }

}

module.exports = Address;
