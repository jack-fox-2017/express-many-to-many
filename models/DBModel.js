const sql = require('sqlite3');

class DBModel{
  constructor(pathDB){
    this.connection = new sql.Database(pathDB);
  }
  createTable(){
    this.connection.serialize(()=>{
      let qry_createContacts = `CREATE TABLE IF NOT EXISTS Contacts(id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50), company VARCHAR(50), phone VARCHAR(16), email VARCHAR(25))`;
      this.connection.run(qry_createContacts);

      let qry_createProfiles = `CREATE TABLE IF NOT EXISTS Profiles(id INTEGER PRIMARY KEY AUTOINCREMENT,
        hometown VARCHAR(25), birth_year INT, relationship_status VARCHAR(50), contacts_id INTEGER UNIQUE, FOREIGN KEY(contacts_id) REFERENCES Contacts(id))`;
      this.connection.run(qry_createProfiles);

      let qry_createAddresses = `CREATE TABLE IF NOT EXISTS Addresses(id INTEGER PRIMARY KEY AUTOINCREMENT,
        street VARCHAR(100), city VARCHAR(50), zip_code VARCHAR(10), contacts_id INT, FOREIGN KEY(contacts_id) REFERENCES Contacts(id))`;
      this.connection.run(qry_createAddresses);

      let qry_createGroups = `CREATE TABLE IF NOT EXISTS Groups(id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_name VARCHAR(100))`;
      this.connection.run(qry_createGroups);

      let qry_createGroCon = `CREATE TABLE IF NOT EXISTS GroupsContact(id INTEGER PRIMARY KEY AUTOINCREMENT, groups_id INT, contacts_id INT,
        FOREIGN KEY(groups_id) REFERENCES Groups(id) ON DELETE CASCADE,
        FOREIGN KEY(contacts_id) REFERENCES Contacts(id) ON DELETE CASCADE)`;
      this.connection.run(qry_createGroCon);
    });
  }
}

// let db = new DBModel('../db/data.db');
// db.createTable();

module.exports = DBModel;
