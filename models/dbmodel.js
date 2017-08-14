var sqlite3 = require ('sqlite3').verbose();
const filename = './db/data.db'

class DBModel {
  constructor() {
    this.connection = new sqlite3.Database(filename)
  }
  setup(){
    let db = this.connection
    function createTableMany(){
      db.run(`CREATE TABLE IF NOT EXISTS profiles (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR,password VARCHAR,first_name VARCHAR, last_name VARCHAR);`);

      console.log("table profil created");

      db.run(`CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, groupname VARCHAR);`);

      console.log("table group created");

      db.run(`CREATE TABLE IF NOT EXISTS address (id INTEGER PRIMARY KEY AUTOINCREMENT, postal_code INTEGER, city VARCHAR, street VARCHAR);`);

      console.log("table address created");

      db.run(`CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, telp_number INTEGER, email VARCHAR, name VARCHAR, company VARCHAR);`);

      console.log("table contacts created");

      db.run(`CREATE TABLE IF NOT EXISTS profilegrup (id INTEGER PRIMARY KEY AUTOINCREMENT, profiles_id INTEGER FOREIGN KEY (profiles_id) REFERENCES profiles.id, groups_id INTEGER FOREIGN KEY (groups_id) REFERENCES groups.id`)

      console.log("table many to many ok ");
      }

  }

}

module.exports = DBModel;
